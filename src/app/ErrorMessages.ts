export enum ErrorMessages {
  TRANSACTION_FAILED = 'transactionFailed',
  TRANSACTION_TIMEOUT = 'transactionTimeout',
  EXCHANGE_FAILED = 'exchangeFailed',
  INCORRECT_PIN = 'incorrectPin',
  PIN_INPUT_CANCELED = 'pinInputCanceled',
  SET_PIN_FAILED = 'setPinFailed',
  NSF_GOLD = 'notEnoughGoldError',
  NSF_STABLE = 'notEnoughStableError',
  NSF_TO_SEND = 'needMoreFundsToSend',
  INSUFFICIENT_BALANCE = 'insufficientBalance',
  INVALID_AMOUNT = 'invalidAmount',
  INVALID_BACKUP_PHRASE = 'invalidBackupPhrase',
  INVALID_WORDS_IN_BACKUP_PHRASE = 'invalidWordsInBackupPhrase',
  IMPORT_BACKUP_FAILED = 'importBackupFailed',
  BACKUP_QUIZ_FAILED = 'backupQuizFailed',
  FAILED_FETCH_MNEMONIC = 'failedFetchMnemonic',
  INVALID_PHONE_NUMBER = 'invalidPhone',
  MISSING_FULL_NAME = 'missingFullName',
  NOT_READY_FOR_CODE = 'notReadyForCode',
  PHONE_NUMBER_VERIFICATION_FAILURE = 'phoneVerificationInput.verificationFailure',
  ADDRESS_LOOKUP_FAILURE = 'addressLookupFailure',
  ODIS_QUOTA_ERROR = 'odisQuotaError',
  SALT_FETCH_FAILURE = 'saltFetchFailure',
  SALT_QUOTA_EXCEEDED = 'saltQuotaExceededError',
  ODIS_INSUFFICIENT_BALANCE = 'odisInsufficientBalance',
  ACCOUNT_UNLOCK_FAILED = 'accountUnlockFailed',
  SEND_PAYMENT_FAILED = 'sendPaymentFailed',
  PAYMENT_REQUEST_FAILED = 'paymentRequestFailed',
  RECLAIMING_ESCROWED_PAYMENT_FAILED = 'reclaimingEscrowedPaymentFailed',
  EXCHANGE_RATE_FAILED = 'errorRefreshingRate',
  EXCHANGE_RATE_CHANGE = 'exchangeRateChange',
  ACCOUNT_SETUP_FAILED = 'accountSetupFailed',
  FIREBASE_DISABLED = 'firebaseDisabled',
  FIREBASE_FAILED = 'firebaseFailed',
  IMPORT_CONTACTS_FAILED = 'importContactsFailed',
  GAS_PRICE_UPDATE_FAILED = 'gasPriceUpdateFailed',
  QR_FAILED_INVALID_ADDRESS = 'qrFailedInvalidAddress',
  QR_FAILED_INVALID_RECIPIENT = 'qrFailedInvalidRecipient',
  QR_FAILED_NO_PHONE_NUMBER = 'qrFailedNoPhoneNumber',
  CORRUPTED_CHAIN_DELETED = 'corruptedChainDeleted',
  CONTRACT_KIT_INIT_FAILED = 'contractKitInitFailed',
  CALCULATE_FEE_FAILED = 'calculateFeeFailed',
  PAYMENT_REQUEST_UPDATE_FAILED = 'paymentRequestUpdateFailed',
  ADDRESS_VALIDATION_ERROR = 'addressValidationError',
  ADDRESS_VALIDATION_NO_MATCH = 'addressValidationNoMatch',
  ADDRESS_VALIDATION_FULL_POORLY_FORMATTED = 'addressValidationFullPoorlyFormatted',
  ADDRESS_VALIDATION_PARTIAL_POORLY_FORMATTED = 'addressValidationPartialPoorlyFormatted',
  ADDRESS_VALIDATION_FULL_OWN_ADDRESS = 'addressValidationFullOwnAddress',
  ADDRESS_VALIDATION_PARTIAL_OWN_ADDRESS = 'addressValidationPartialOwnAddress',
  KEYCHAIN_STORAGE_ERROR = 'keychainStorageError',
  PROVIDER_RATE_FETCH_FAILED = 'providerRateFetchFailed',
  ACCOUNT_CLEAR_FAILED = 'accountClearFailed',
  KEYCHAIN_FETCH_ACCOUNTS = 'keychainFetchAccounts',
  KEYCHAIN_ACCOUNT_ALREADY_EXISTS = 'keychainAccountAlreadyExists',
  COUNTRY_NOT_AVAILABLE = 'countryNotAvailable',
  FETCH_FAILED = 'fetchFailed',
  PICTURE_LOAD_FAILED = 'pictureLoadFailed',
  SIMPLEX_PURCHASE_FETCH_FAILED = 'simplexPurchaseFetchFailed',
  PROVIDER_FETCH_FAILED = 'providerFetchFailed',
  CASH_OUT_LIMIT_EXCEEDED = 'cashOutLimitExceeded',
  PERSONA_ACCOUNT_ENDPOINT_FAIL = 'personaAccountEndpointFail',
  GET_BANK_ACCOUNTS_FAIL = 'getBankAccountsFail',
  DELETE_BANK_ACCOUNT_FAIL = 'deleteBankAccountFail',
  SUPERCHARGE_FETCH_REWARDS_FAILED = 'superchargeFetchRewardsFailed',
  SUPERCHARGE_CLAIM_FAILED = 'superchargeClaimFailure',
  FETCH_SWAP_QUOTE_FAILED = 'swapScreen.fetchSwapQuoteFailed',
  SWAP_SUBMIT_FAILED = 'swapScreen.swapSubmitFailed',
  KYC_TRY_AGAIN_FAILED = 'fiatConnectKycStatusScreen.tryAgainFailed',
  INSUFFICIENT_BALANCE_STABLE = 'insufficientBalanceStable',
  WALLET_INIT_FAILED = 'walletInitFailed',
}
