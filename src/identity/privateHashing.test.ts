import { OdisUtils } from '@celo/identity'
import { IdentifierHashDetails } from '@celo/identity/lib/odis/identifier'
import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'
import { call, select } from 'redux-saga/effects'
import { PincodeType } from 'src/account/reducer'
import { e164NumberSelector } from 'src/account/selectors'
import { ErrorMessages } from 'src/app/ErrorMessages'
import { updateE164PhoneNumberSalts } from 'src/identity/actions'
import { fetchPhoneHashPrivate } from 'src/identity/privateHashing'
import {
  e164NumberToSaltSelector,
  isBalanceSufficientForSigRetrievalSelector,
} from 'src/identity/selectors'
import { isAccountUpToDate } from 'src/web3/dataEncryptionKey'
import { getConnectedAccount } from 'src/web3/saga'
import { createMockStore } from 'test/utils'
import { mockAccount, mockE164Number, mockE164Number2 } from 'test/values'

jest.mock('react-native-blind-threshold-bls', () => ({
  blindMessage: jest.fn(() => '0Uj+qoAu7ASMVvm6hvcUGx2eO/cmNdyEgGn0mSoZH8/dujrC1++SZ1N6IP6v2I8A'),
  unblindMessage: jest.fn(() => 'vJeFZJ3MY5KlpI9+kIIozKkZSR4cMymLPh2GHZUatWIiiLILyOcTiw2uqK/LBReA'),
}))

jest.mock('@celo/identity', () => ({
  ...(jest.requireActual('@celo/identity') as any),
  ...(jest.requireActual('../../__mocks__/@celo/identity/index') as any),
  OdisUtils: jest.requireActual('@celo/identity').OdisUtils,
}))

describe('Fetch phone hash details', () => {
  it('retrieves salts correctly', async () => {
    const expectedPepper = 'piWqRHHYWtfg9'
    const expectedHash = '0xf6429456331dedf8bd32b5e3a578e5bc589a28d012724dcd3e0a4b1be67bb454'

    const lookupResult: IdentifierHashDetails = {
      plaintextIdentifier: mockE164Number,
      obfuscatedIdentifier: expectedHash,
      pepper: expectedPepper,
    }

    const state = createMockStore({
      web3: { account: mockAccount },
      account: { pincodeType: PincodeType.CustomPin },
    }).getState()

    await expectSaga(fetchPhoneHashPrivate, mockE164Number)
      .provide([
        [call(getConnectedAccount), mockAccount],
        [select(isBalanceSufficientForSigRetrievalSelector), true],
        [select(e164NumberSelector), mockE164Number2],
        [select(e164NumberToSaltSelector), {}],
        [matchers.call.fn(isAccountUpToDate), true],
        [matchers.call.fn(OdisUtils.Identifier.getObfuscatedIdentifier), lookupResult],
      ])
      .withState(state)
      .put(
        updateE164PhoneNumberSalts({
          [mockE164Number]: expectedPepper,
        })
      )
      .returns({
        e164Number: mockE164Number,
        pepper: expectedPepper,
        phoneHash: expectedHash,
        unblindedSignature: undefined,
      })
      .run()
  })

  it('warns about insufficient balance if ODIS query fails', async () => {
    const state = createMockStore({
      web3: { account: mockAccount },
      account: { pincodeType: PincodeType.CustomPin },
    }).getState()

    await expect(
      expectSaga(fetchPhoneHashPrivate, mockE164Number)
        .provide([
          [call(getConnectedAccount), mockAccount],
          [select(isBalanceSufficientForSigRetrievalSelector), false],
          [select(e164NumberSelector), mockE164Number2],
          [select(e164NumberToSaltSelector), {}],
          [matchers.call.fn(isAccountUpToDate), true],
          [
            matchers.call.fn(OdisUtils.Identifier.getObfuscatedIdentifier),
            throwError(new Error(ErrorMessages.ODIS_QUOTA_ERROR)),
          ],
        ])
        .withState(state)
        .run()
    ).rejects.toThrowError(ErrorMessages.ODIS_INSUFFICIENT_BALANCE)
  })

  // TODO confirm it navs to quota purchase screen
  it.todo('handles failure from quota')
})
