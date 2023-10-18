import { normalizeAddress } from '@celo/utils/lib/address'
import erc20 from 'src/abis/IERC20.json'
import getLockableViemWallet, { ViemWallet } from 'src/viem/getLockableWallet'
import { KeychainLock } from 'src/web3/KeychainLock'
import * as mockedKeychain from 'test/mockedKeychain'
import { mockAccount2, mockContractAddress, mockPrivateDEK } from 'test/values'
import {
  prepareTransactionRequest,
  sendTransaction,
  signMessage,
  signTransaction,
  signTypedData,
  writeContract,
} from 'viem/actions'
import { celo } from 'viem/chains'

jest.mock('viem/actions')

const methodsParams: Record<string, any> = {
  prepareTransactionRequest: {
    account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
    to: '0x0000000000000000000000000000000000000000',
    value: BigInt(1),
  },
  sendTransaction: {
    account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
    to: '0x0000000000000000000000000000000000000000',
    value: BigInt(1),
  },
  signTransaction: {
    account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
    to: '0x0000000000000000000000000000000000000000',
    value: BigInt(1),
  },
  signTypedData: {
    account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
    domain: {
      name: 'Ether Mail',
      version: '1',
      chainId: 1,
      verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
    },
    types: {
      Person: [
        { name: 'name', type: 'string' },
        { name: 'wallet', type: 'address' },
      ],
      Mail: [
        { name: 'from', type: 'Person' },
        { name: 'to', type: 'Person' },
        { name: 'contents', type: 'string' },
      ],
    },
    primaryType: 'Mail',
    message: {
      from: {
        name: 'Cow',
        wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
      },
      to: {
        name: 'Bob',
        wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
      },
      contents: 'Hello, Bob!',
    },
  },
  signMessage: {
    account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
    message: 'hello world',
  },
  writeContract: {
    address: mockContractAddress,
    abi: erc20.abi,
    functionName: 'mint',
    account: mockAccount2,
    chain: celo,
    args: [],
  },
}

describe('getLockableWallet', () => {
  let wallet: ViemWallet
  let lock: KeychainLock

  beforeEach(() => {
    lock = new KeychainLock()
    wallet = getLockableViemWallet(lock, celo, `0x${mockPrivateDEK}`)
  })

  it.each([
    ['prepareTransactionRequest', (args: any) => wallet.prepareTransactionRequest(args)],
    ['sendTransaction', (args: any) => wallet.sendTransaction(args)],
    ['signTransaction', (args: any) => wallet.signTransaction(args)],
    ['signTypedData', (args: any) => wallet.signTypedData(args)],
    ['signMessage', (args: any) => wallet.signMessage(args)],
    ['writeContract', (args: any) => wallet.writeContract(args)],
  ])('cannot call %s if not unlocked', (methodName, methodCall) => {
    expect(() => methodCall(methodsParams[methodName])).toThrowError(
      'authentication needed: password or unlock'
    )
  })

  it.each([
    {
      method: prepareTransactionRequest,
      methodCall: (args: any) => wallet.prepareTransactionRequest(args),
    },
    { method: sendTransaction, methodCall: (args: any) => wallet.sendTransaction(args) },
    { method: signTransaction, methodCall: (args: any) => wallet.signTransaction(args) },
    { method: signTypedData, methodCall: (args: any) => wallet.signTypedData(args) },
    { method: signMessage, methodCall: (args: any) => wallet.signMessage(args) },
    { method: writeContract, methodCall: (args: any) => wallet.writeContract(args) },
  ])('can call $method.name if unlocked', async ({ method, methodCall }) => {
    // Adding account to the lock and keychain
    const date = new Date()
    lock.addAccount({ address: wallet.account?.address as string, createdAt: date })
    mockedKeychain.setItems({
      [`account--${date.toISOString()}--${normalizeAddress(wallet.account?.address as string)}`]: {
        password: 'password',
      },
    })

    const unlocked = await wallet.unlockAccount('password', 100)
    expect(unlocked).toBe(true)
    expect(() => methodCall(methodsParams[method.name])).not.toThrowError(
      'authentication needed: password or unlock'
    )
    expect(method).toHaveBeenCalledWith(expect.anything(), methodsParams[method.name])
  })
})
