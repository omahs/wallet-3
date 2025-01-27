import { parseInputAmount } from '@celo/utils/lib/parsing'
import BigNumber from 'bignumber.js'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, TextInput as RNTextInput, StyleSheet, Text } from 'react-native'
import { View } from 'react-native-animatable'
import { getNumberFormatSettings } from 'react-native-localize'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SendEvents } from 'src/analytics/Events'
import ValoraAnalytics from 'src/analytics/ValoraAnalytics'
import BackButton from 'src/components/BackButton'
import { BottomSheetRefType } from 'src/components/BottomSheet'
import Button, { BtnSizes } from 'src/components/Button'
import InLineNotification, { Severity } from 'src/components/InLineNotification'
import KeyboardAwareScrollView from 'src/components/KeyboardAwareScrollView'
import KeyboardSpacer from 'src/components/KeyboardSpacer'
import SkeletonPlaceholder from 'src/components/SkeletonPlaceholder'
import TextInput from 'src/components/TextInput'
import TokenBottomSheet, {
  TokenBalanceItemOption,
  TokenPickerOrigin,
} from 'src/components/TokenBottomSheet'
import TokenDisplay from 'src/components/TokenDisplay'
import TokenIcon, { IconSize } from 'src/components/TokenIcon'
import Touchable from 'src/components/Touchable'
import CustomHeader from 'src/components/header/CustomHeader'
import DownArrowIcon from 'src/icons/DownArrowIcon'
import { useSelector } from 'src/redux/hooks'
import { NETWORK_NAMES } from 'src/shared/conts'
import Colors from 'src/styles/colors'
import { typeScale } from 'src/styles/fonts'
import { Spacing } from 'src/styles/styles'
import { feeCurrenciesSelector } from 'src/tokens/selectors'
import { TokenBalance } from 'src/tokens/slice'
import { PreparedTransactionsResult, getFeeCurrencyAndAmounts } from 'src/viem/prepareTransactions'

interface Props {
  tokens: TokenBalance[]
  defaultToken?: TokenBalance
  prepareTransactionsResult?: PreparedTransactionsResult
  onClearPreparedTransactions(): void
  onRefreshPreparedTransactions(
    amount: BigNumber,
    token: TokenBalance,
    feeCurrencies: TokenBalance[]
  ): void
  prepareTransactionError?: Error
  tokenSelectionDisabled?: boolean
  onPressProceed(amount: BigNumber, token: TokenBalance): void
  disableProceed?: boolean
  children?: React.ReactNode
}

const TOKEN_SELECTOR_BORDER_RADIUS = 100
const MAX_BORDER_RADIUS = 96
const FETCH_UPDATED_TRANSACTIONS_DEBOUNCE_TIME = 250

function FeeLoading() {
  return (
    <View testID="SendEnterAmount/FeeLoading" style={styles.feeInCryptoContainer}>
      <Text style={styles.feeInCrypto}>{'≈ '}</Text>
      <SkeletonPlaceholder backgroundColor={Colors.gray2} highlightColor={Colors.white}>
        <View style={styles.feesLoadingInternal} />
      </SkeletonPlaceholder>
    </View>
  )
}

function FeePlaceholder({ feeTokenSymbol }: { feeTokenSymbol: string }) {
  return (
    <Text testID="SendEnterAmount/FeePlaceholder" style={styles.feeInCrypto}>
      ~ {feeTokenSymbol}
    </Text>
  )
}

function FeeAmount({ feeTokenId, feeAmount }: { feeTokenId: string; feeAmount: BigNumber }) {
  return (
    <>
      <View testID="SendEnterAmount/FeeInCrypto" style={styles.feeInCryptoContainer}>
        <TokenDisplay
          tokenId={feeTokenId}
          amount={feeAmount}
          showLocalAmount={false}
          showApprox={true}
          style={styles.feeInCrypto}
        />
      </View>
      <TokenDisplay tokenId={feeTokenId} amount={feeAmount} style={styles.feeInFiat} />
    </>
  )
}

function EnterAmount({
  tokens,
  defaultToken,
  prepareTransactionsResult,
  onClearPreparedTransactions,
  onRefreshPreparedTransactions,
  prepareTransactionError,
  tokenSelectionDisabled = false,
  onPressProceed,
  disableProceed = false,
  children,
}: Props) {
  const { t } = useTranslation()

  // the startPosition and textInputRef variables exist to ensure TextInput
  // displays the start of the value for long values on Android
  // https://github.com/facebook/react-native/issues/14845
  const [startPosition, setStartPosition] = useState<number | undefined>(0)
  const textInputRef = useRef<RNTextInput | null>(null)
  const tokenBottomSheetRef = useRef<BottomSheetRefType>(null)

  const [token, setToken] = useState<TokenBalance>(() => defaultToken ?? tokens[0])
  const [amount, setAmount] = useState<string>('')

  const onTokenPickerSelect = () => {
    tokenBottomSheetRef.current?.snapToIndex(0)
    ValoraAnalytics.track(SendEvents.token_dropdown_opened, {
      currentTokenId: token.tokenId,
      currentTokenAddress: token.address,
      currentNetworkId: token.networkId,
    })
  }

  const onSelectToken = (token: TokenBalance) => {
    setToken(token)
    tokenBottomSheetRef.current?.close()
    // NOTE: analytics is already fired by the bottom sheet, don't need one here
  }

  const onMaxAmountPress = async () => {
    // eventually we may want to do something smarter here, like subtracting gas fees from the max amount if
    // this is a gas-paying token. for now, we are just showing a warning to the user prompting them to lower the amount
    // if there is not enough for gas
    setAmount(token.balance.toString())
    textInputRef.current?.blur()
    ValoraAnalytics.track(SendEvents.max_pressed, {
      tokenId: token.tokenId,
      tokenAddress: token.address,
      networkId: token.networkId,
    })
  }

  const handleSetStartPosition = (value?: number) => {
    if (Platform.OS === 'android') {
      setStartPosition(value)
    }
  }

  const { decimalSeparator } = getNumberFormatSettings()
  const parsedAmount = useMemo(() => parseInputAmount(amount, decimalSeparator), [amount])

  const { maxFeeAmount, feeCurrency } = getFeeCurrencyAndAmounts(prepareTransactionsResult)

  const feeCurrencies = useSelector((state) => feeCurrenciesSelector(state, token.networkId))

  useEffect(() => {
    onClearPreparedTransactions()

    if (parsedAmount.isLessThanOrEqualTo(0) || parsedAmount.isGreaterThan(token.balance)) {
      return
    }
    const debouncedRefreshTransactions = setTimeout(() => {
      return onRefreshPreparedTransactions(parsedAmount, token, feeCurrencies)
    }, FETCH_UPDATED_TRANSACTIONS_DEBOUNCE_TIME)
    return () => clearTimeout(debouncedRefreshTransactions)
  }, [parsedAmount, token])

  const showLowerAmountError = token.balance.lt(amount)
  const showMaxAmountWarning =
    !showLowerAmountError &&
    prepareTransactionsResult &&
    prepareTransactionsResult.type === 'need-decrease-spend-amount-for-gas'
  const showNotEnoughBalanceForGasWarning =
    !showLowerAmountError &&
    prepareTransactionsResult &&
    prepareTransactionsResult.type === 'not-enough-balance-for-gas'
  const sendIsPossible =
    !showLowerAmountError &&
    prepareTransactionsResult &&
    prepareTransactionsResult.type === 'possible' &&
    prepareTransactionsResult.transactions.length > 0

  const { tokenId: feeTokenId, symbol: feeTokenSymbol } = feeCurrency ?? feeCurrencies[0]
  let feeAmountSection = <FeeLoading />
  if (
    amount === '' ||
    showLowerAmountError ||
    (prepareTransactionsResult && !maxFeeAmount) ||
    prepareTransactionError
  ) {
    feeAmountSection = <FeePlaceholder feeTokenSymbol={feeTokenSymbol} />
  } else if (prepareTransactionsResult && maxFeeAmount) {
    feeAmountSection = <FeeAmount feeAmount={maxFeeAmount} feeTokenId={feeTokenId} />
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <CustomHeader style={{ paddingHorizontal: Spacing.Thick24 }} left={<BackButton />} />
      <KeyboardAwareScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.title}>{t('sendEnterAmountScreen.title')}</Text>
          <View style={styles.inputBox}>
            <View style={styles.inputRow}>
              <TextInput
                forwardedRef={textInputRef}
                onChangeText={(value) => {
                  handleSetStartPosition(undefined)
                  if (!value) {
                    setAmount('')
                  } else {
                    if (value.startsWith(decimalSeparator)) {
                      value = `0${value}`
                    }
                    setAmount(
                      (prev) => value.match(/^(?:\d+[.,]?\d*|[.,]\d*|[.,])$/)?.join('') ?? prev
                    )
                  }
                }}
                value={amount}
                placeholder="0"
                // hide input when loading to prevent the UI height from jumping
                style={styles.input}
                keyboardType="decimal-pad"
                // Work around for RN issue with Samsung keyboards
                // https://github.com/facebook/react-native/issues/22005
                autoCapitalize="words"
                autoFocus={true}
                // unset lineHeight to allow ellipsis on long inputs on iOS. For
                // android, ellipses doesn't work and unsetting line height causes
                // height changes when amount is entered
                inputStyle={[
                  styles.inputText,
                  Platform.select({ ios: { lineHeight: undefined } }),
                  showLowerAmountError && { color: Colors.error },
                ]}
                testID="SendEnterAmount/Input"
                onBlur={() => {
                  handleSetStartPosition(0)
                }}
                onFocus={() => {
                  handleSetStartPosition(amount?.length ?? 0)
                }}
                onSelectionChange={() => {
                  handleSetStartPosition(undefined)
                }}
                selection={
                  Platform.OS === 'android' && typeof startPosition === 'number'
                    ? { start: startPosition }
                    : undefined
                }
              />
              <Touchable
                borderRadius={TOKEN_SELECTOR_BORDER_RADIUS}
                onPress={onTokenPickerSelect}
                style={styles.tokenSelectButton}
                disabled={tokenSelectionDisabled}
                testID="SendEnterAmount/TokenSelect"
              >
                <>
                  <TokenIcon token={token} size={IconSize.SMALL} />
                  <Text style={styles.tokenName}>{token.symbol}</Text>
                  {!tokenSelectionDisabled && <DownArrowIcon color={Colors.gray5} />}
                </>
              </Touchable>
            </View>
            {showLowerAmountError && (
              <Text testID="SendEnterAmount/LowerAmountError" style={styles.lowerAmountError}>
                {t('sendEnterAmountScreen.lowerAmount')}
              </Text>
            )}
            <View style={styles.localAmountRow}>
              <TokenDisplay
                amount={parsedAmount}
                tokenId={token.tokenId}
                style={styles.localAmount}
                testID="SendEnterAmount/LocalAmount"
              />
              <Touchable
                borderRadius={MAX_BORDER_RADIUS}
                onPress={onMaxAmountPress}
                style={styles.maxTouchable}
                testID="SendEnterAmount/Max"
              >
                <Text style={styles.maxText}>{t('max')}</Text>
              </Touchable>
            </View>
          </View>
          <View style={styles.feeContainer}>
            <Text style={styles.feeLabel}>
              {t('sendEnterAmountScreen.networkFee', {
                networkName: NETWORK_NAMES[token.networkId],
              })}
            </Text>
            <View style={styles.feeAmountContainer}>{feeAmountSection}</View>
          </View>
        </View>

        {showMaxAmountWarning && (
          <InLineNotification
            severity={Severity.Warning}
            title={t('sendEnterAmountScreen.maxAmountWarning.title')}
            description={t('sendEnterAmountScreen.maxAmountWarning.description', {
              feeTokenSymbol: prepareTransactionsResult.feeCurrency.symbol,
            })}
            style={styles.warning}
            testID="SendEnterAmount/MaxAmountWarning"
          />
        )}
        {showNotEnoughBalanceForGasWarning && (
          <InLineNotification
            severity={Severity.Warning}
            title={t('sendEnterAmountScreen.notEnoughBalanceForGasWarning.title', {
              feeTokenSymbol: prepareTransactionsResult.feeCurrencies[0].symbol,
            })}
            description={t('sendEnterAmountScreen.notEnoughBalanceForGasWarning.description', {
              feeTokenSymbol: prepareTransactionsResult.feeCurrencies[0].symbol,
            })}
            style={styles.warning}
            testID="SendEnterAmount/NotEnoughForGasWarning"
          />
        )}
        {prepareTransactionError && (
          <InLineNotification
            severity={Severity.Error}
            title={t('sendEnterAmountScreen.prepareTransactionError.title')}
            description={t('sendEnterAmountScreen.prepareTransactionError.description')}
            style={styles.warning}
            testID="SendEnterAmount/PrepareTransactionError"
          />
        )}

        {children}

        <Button
          onPress={() => onPressProceed(parsedAmount, token)}
          text={t('review')}
          style={styles.reviewButton}
          size={BtnSizes.FULL}
          fontStyle={styles.reviewButtonText}
          disabled={!sendIsPossible || disableProceed}
          testID="SendEnterAmount/ReviewButton"
        />
        <KeyboardSpacer />
      </KeyboardAwareScrollView>
      <TokenBottomSheet
        forwardedRef={tokenBottomSheetRef}
        snapPoints={['90%']}
        origin={TokenPickerOrigin.Send}
        onTokenSelected={onSelectToken}
        tokens={tokens}
        title={t('sendEnterAmountScreen.selectToken')}
        TokenOptionComponent={TokenBalanceItemOption}
        titleStyle={styles.title}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.Thick24,
    paddingTop: Spacing.Thick24,
    flexGrow: 1,
  },
  title: {
    ...typeScale.titleSmall,
  },
  inputContainer: {
    flex: 1,
  },
  inputBox: {
    marginTop: Spacing.Large32,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderRadius: 16,
    borderColor: Colors.gray2,
  },
  inputRow: {
    paddingHorizontal: Spacing.Regular16,
    paddingTop: Spacing.Smallest8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  localAmountRow: {
    marginTop: Spacing.Thick24,
    marginLeft: Spacing.Regular16,
    paddingRight: Spacing.Regular16,
    paddingBottom: Spacing.Regular16,
    paddingTop: Spacing.Thick24,
    borderTopColor: Colors.gray2,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginRight: Spacing.Smallest8,
  },
  inputText: {
    ...typeScale.titleMedium,
  },
  tokenSelectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray2,
    borderRadius: TOKEN_SELECTOR_BORDER_RADIUS,
    paddingHorizontal: Spacing.Smallest8,
    paddingVertical: Spacing.Tiny4,
  },
  tokenName: {
    ...typeScale.labelSmall,
    paddingLeft: Spacing.Tiny4,
    paddingRight: Spacing.Smallest8,
  },
  localAmount: {
    ...typeScale.labelMedium,
    flex: 1,
  },
  maxTouchable: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.gray2,
    borderWidth: 1,
    borderColor: Colors.gray2,
    borderRadius: MAX_BORDER_RADIUS,
  },
  maxText: {
    ...typeScale.labelSmall,
  },
  feeContainer: {
    flexDirection: 'row',
    marginTop: 18,
  },
  feeLabel: {
    flex: 1,
    ...typeScale.bodyXSmall,
    color: Colors.gray4,
    paddingLeft: 2,
  },
  feeAmountContainer: {
    alignItems: 'flex-end',
    paddingRight: 2,
  },
  feeInCryptoContainer: {
    flexDirection: 'row',
  },
  feeInCrypto: {
    color: Colors.gray4,
    ...typeScale.labelXSmall,
  },
  feeInFiat: {
    color: Colors.gray4,
    ...typeScale.bodyXSmall,
  },
  feesLoadingInternal: {
    ...typeScale.labelXSmall,
    width: 46,
    borderRadius: 100,
  },
  lowerAmountError: {
    color: Colors.error,
    ...typeScale.labelXSmall,
    paddingLeft: Spacing.Regular16,
  },
  reviewButton: {
    paddingVertical: Spacing.Thick24,
  },
  reviewButtonText: {
    ...typeScale.labelSemiBoldMedium,
  },
  warning: {
    marginTop: Spacing.Regular16,
    marginBottom: Spacing.Smallest8,
    paddingHorizontal: Spacing.Regular16,
    borderRadius: 16,
  },
})

export default EnterAmount
