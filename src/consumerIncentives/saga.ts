import { CeloTx, CeloTxReceipt, Contract, toTransactionObject } from '@celo/connect'
import { TxParamsNormalizer } from '@celo/connect/lib/utils/tx-params-normalizer'
import { ContractKit } from '@celo/contractkit'
import BigNumber from 'bignumber.js'
import { all, call, put, select, spawn, takeEvery } from 'redux-saga/effects'
import merkleDistributor from 'src/abis/MerkleDistributor.json'
import { showError, showMessage } from 'src/alert/actions'
import { RewardsEvents } from 'src/analytics/Events'
import ValoraAnalytics from 'src/analytics/ValoraAnalytics'
import { ErrorMessages } from 'src/app/ErrorMessages'
import {
  availableRewardsSelector,
  superchargeRewardContractAddressSelector,
  superchargeV2EnabledSelector,
} from 'src/consumerIncentives/selectors'
import {
  claimRewards,
  claimRewardsFailure,
  claimRewardsSuccess,
  fetchAvailableRewards,
  fetchAvailableRewardsFailure,
  fetchAvailableRewardsSuccess,
  setAvailableRewards,
} from 'src/consumerIncentives/slice'
import {
  isSuperchargePendingRewardsV2,
  SuperchargePendingReward,
  SuperchargePendingRewardV2,
} from 'src/consumerIncentives/types'
import i18n from 'src/i18n'
import { navigateHome } from 'src/navigator/NavigationService'
import { tokensByAddressSelector } from 'src/tokens/selectors'
import { TokenBalances } from 'src/tokens/slice'
import { addStandbyTransaction } from 'src/transactions/actions'
import { sendTransaction } from 'src/transactions/send'
import {
  newTransactionContext,
  TokenTransactionTypeV2,
  TransactionStatus,
} from 'src/transactions/types'
import { fetchWithTimeout } from 'src/utils/fetchWithTimeout'
import Logger from 'src/utils/Logger'
import { WEI_PER_TOKEN } from 'src/web3/consts'
import { getContractKit } from 'src/web3/contracts'
import config from 'src/web3/networkConfig'
import { getConnectedUnlockedAccount } from 'src/web3/saga'
import { walletAddressSelector } from 'src/web3/selectors'
import { applyChainIdWorkaround, buildTxo, getContract } from 'src/web3/utils'

const TAG = 'SuperchargeRewardsClaimer'
const SUPERCHARGE_FETCH_TIMEOUT = 30_000

export function* claimRewardsSaga() {
  try {
    const kit: ContractKit = yield call(getContractKit)
    const walletAddress: string = yield call(getConnectedUnlockedAccount)
    const baseNonce: number = yield call(
      // @ts-ignore I can't figure out the syntax for this, it works but TS complains :'(
      [kit.web3.eth, kit.web3.eth.getTransactionCount],
      walletAddress
    )
    const rewards: SuperchargePendingReward[] | SuperchargePendingRewardV2[] = yield select(
      availableRewardsSelector
    )

    Logger.debug(TAG, `Starting to claim ${rewards.length} rewards with baseNonce: ${baseNonce}`)

    let receivedRewards: {
      fundsSource: string
      amount: string
      tokenAddress: string
      txHash: string
    }[] = []

    if (isSuperchargePendingRewardsV2(rewards)) {
      receivedRewards = yield all(
        rewards.map((reward, index) => call(claimRewardV2, reward, index, baseNonce))
      )
    } else {
      receivedRewards = yield all(
        rewards.map((reward, index) => call(claimReward, reward, index, baseNonce))
      )
    }

    for (const reward of receivedRewards) {
      yield put(
        addStandbyTransaction({
          context: newTransactionContext('Claim Reward', reward.txHash),
          type: TokenTransactionTypeV2.Received,
          status: TransactionStatus.Complete,
          value: reward.amount,
          tokenAddress: reward.tokenAddress,
          comment: '',
          timestamp: Math.floor(Date.now() / 1000),
          address: reward.fundsSource,
          hash: reward.txHash,
        })
      )
    }
    yield put(setAvailableRewards([]))
    yield put(fetchAvailableRewards())
    yield put(claimRewardsSuccess())
    yield put(showMessage(i18n.t('superchargeClaimSuccess')))
    navigateHome()
  } catch (error) {
    yield put(claimRewardsFailure())
    yield put(showError(ErrorMessages.SUPERCHARGE_CLAIM_FAILED))
    Logger.error(TAG, 'Error claiming rewards', error as Error)
  }
}

function* claimReward(reward: SuperchargePendingReward, index: number, baseNonce: number) {
  const kit: ContractKit = yield call(getContractKit)
  const tokens: TokenBalances = yield select(tokensByAddressSelector)
  const walletAddress: string = yield call(getConnectedUnlockedAccount)

  Logger.debug(TAG, `Start claiming reward at index ${index}: ${JSON.stringify(reward)}`)
  const merkleContract: Contract = yield call(
    getContract,
    merkleDistributor.abi,
    reward.contractAddress
  )
  const fundsSource: string = yield call(async () => merkleContract.methods.fundsSource().call())
  const tx = toTransactionObject(
    kit.connection,
    merkleContract.methods.claim(reward.index, walletAddress, reward.amount, reward.proof ?? [])
  )

  const receipt: CeloTxReceipt = yield call(
    sendTransaction,
    tx.txo,
    walletAddress,
    newTransactionContext(TAG, 'Claim Supercharge reward'),
    undefined,
    undefined,
    undefined,
    baseNonce + index
  )
  Logger.info(TAG, `Claimed reward at index ${index}: ${JSON.stringify(receipt)}`)
  const amount = new BigNumber(reward.amount, 16).div(WEI_PER_TOKEN).toString()
  const tokenAddress = reward.tokenAddress.toLowerCase()
  ValoraAnalytics.track(RewardsEvents.claimed_reward, {
    amount,
    token: tokens[tokenAddress]?.symbol ?? '',
    version: 1,
  })
  return {
    fundsSource: fundsSource.toLowerCase(),
    tokenAddress,
    amount,
    txHash: receipt.transactionHash,
  }
}

function* claimRewardV2(reward: SuperchargePendingRewardV2, index: number, baseNonce: number) {
  const { transaction, details } = reward

  const superchargeRewardContractAddress = yield select(superchargeRewardContractAddressSelector)
  if (superchargeRewardContractAddress !== transaction.to) {
    throw new Error(
      `Unexpected supercharge contract address ${transaction.to} on reward transaction, aborting claim.`
    )
  }

  const kit: ContractKit = yield call(getContractKit)
  const tokens: TokenBalances = yield select(tokensByAddressSelector)
  const walletAddress: string = yield call(getConnectedUnlockedAccount)

  Logger.debug(TAG, `Start claiming reward at index ${index}: ${JSON.stringify(reward)}`)

  applyChainIdWorkaround(transaction, yield call([kit.connection, 'chainId']))

  const normalizer = new TxParamsNormalizer(kit.connection)
  const tx: CeloTx = yield call([normalizer, 'populate'], transaction)
  const txo = buildTxo(kit, tx)

  const receipt: CeloTxReceipt = yield call(
    sendTransaction,
    txo,
    walletAddress,
    newTransactionContext(TAG, 'Claim Supercharge reward'),
    undefined,
    undefined,
    undefined,
    baseNonce + index
  )
  Logger.info(TAG, `Claimed reward at index ${index}: ${JSON.stringify(receipt)}`)
  const amount = new BigNumber(details.amount, 16).div(WEI_PER_TOKEN).toString()
  const tokenAddress = details.tokenAddress.toLowerCase()
  ValoraAnalytics.track(RewardsEvents.claimed_reward, {
    amount,
    token: tokens[tokenAddress]?.symbol ?? '',
    version: 2,
  })
  return {
    fundsSource: superchargeRewardContractAddress,
    tokenAddress,
    amount,
    txHash: receipt.transactionHash,
  }
}

export function* fetchAvailableRewardsSaga() {
  const address: string | null = yield select(walletAddressSelector)
  if (!address) {
    Logger.debug(TAG, 'Skipping fetching available rewards since no address was found')
    return
  }

  const superchargeV2Enabled = yield select(superchargeV2EnabledSelector)
  try {
    const superchargeRewardsUrl = superchargeV2Enabled
      ? config.fetchAvailableSuperchargeRewardsV2
      : config.fetchAvailableSuperchargeRewards

    const response: Response = yield call(
      fetchWithTimeout,
      `${superchargeRewardsUrl}?address=${address}`,
      SUPERCHARGE_FETCH_TIMEOUT
    )
    const data: { availableRewards: SuperchargePendingReward[] | SuperchargePendingRewardV2[] } =
      yield call([response, 'json'])
    if (!data.availableRewards) {
      throw new Error('No rewards field found in supercharge service response')
    }

    yield put(setAvailableRewards(data.availableRewards))
    yield put(fetchAvailableRewardsSuccess())
  } catch (e) {
    yield put(fetchAvailableRewardsFailure())
    yield put(showError(ErrorMessages.SUPERCHARGE_FETCH_REWARDS_FAILED))
    Logger.error(TAG, 'Error fetching supercharge rewards', e as Error)
  }
}

export function* watchAvailableRewards() {
  yield takeEvery(fetchAvailableRewards.type, fetchAvailableRewardsSaga)
}

export function* watchClaimRewards() {
  yield takeEvery(claimRewards.type, claimRewardsSaga)
}

export function* superchargeSaga() {
  yield spawn(watchClaimRewards)
  yield spawn(watchAvailableRewards)
}
