import Logger from 'src/utils/Logger'
import { KeychainLock } from 'src/web3/KeychainLock'
import {
  Account,
  Address,
  Chain,
  Client,
  Transport,
  WalletActions,
  WalletRpcSchema,
  createWalletClient,
  http,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import {
  sendRawTransaction,
  sendTransaction,
  signMessage,
  signTransaction,
  signTypedData,
  writeContract,
} from 'viem/actions'

const TAG = 'viem/getLockableWallet'

// Largely copied from https://github.com/wagmi-dev/viem/blob/main/src/clients/createWalletClient.ts#L32
export type ViemWallet<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined
> = Client<transport, chain, account, WalletRpcSchema, Actions>

type Actions = Pick<
  WalletActions,
  | 'sendRawTransaction'
  | 'sendTransaction'
  | 'signTransaction'
  | 'signTypedData'
  | 'signMessage'
  | 'writeContract'
> & { unlockAccount: (passphrase: string, duration: number) => Promise<boolean> }

export default function getLockableViemWallet(
  lock: KeychainLock,
  chain: Chain,
  privateKey: Address
): ViemWallet {
  const account = privateKeyToAccount(privateKey)
  Logger.debug(TAG, `getting viem wallet for ${account.address} on ${chain.name}`)
  const checkLock = () => {
    if (!lock.isUnlocked(account.address)) {
      throw new Error('authentication needed: password or unlock')
    }
  }

  return createWalletClient({
    chain,
    transport: http(),
    account,
  }).extend((client: Client): Actions => {
    return {
      // All wallet functions that we want our ViemWallet to have must go here
      // For instance we will later need prepareTransactionRequest which we can add here by
      // importing the prepareTransactionRequest action and blocking it with the checkLock function
      // Introduction to wallet actions: https://viem.sh/docs/actions/wallet/introduction.html
      unlockAccount: (passphrase: string, duration: number) =>
        lock.unlock(account.address, passphrase, duration),
      writeContract: (args) => {
        checkLock()
        return writeContract(client, args)
      },
      signTransaction: (args) => {
        checkLock()
        return signTransaction(client, args)
      },
      sendRawTransaction: (args) => {
        return sendRawTransaction(client, args)
      },
      sendTransaction: (args) => {
        checkLock()
        return sendTransaction(client, args)
      },
      signTypedData: (args) => {
        checkLock()
        return signTypedData(client, args)
      },
      signMessage: (args) => {
        checkLock()
        return signMessage(client, args)
      },
    }
  })
}
