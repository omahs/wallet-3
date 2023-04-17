import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import AccountErrorScreen from 'src/account/AccountErrorScreen'
import { startStoreWipeRecovery } from 'src/account/actions'
import { recoveringFromStoreWipeSelector } from 'src/account/selectors'
import { noHeaderGestureDisabled } from 'src/navigator/Headers'
import { navigate } from 'src/navigator/NavigationService'
import { firstOnboardingScreen } from 'src/onboarding/steps'
import { requestPincodeInput } from 'src/pincode/authentication'
import { ExperimentConfigs } from 'src/statsig/constants'
import { useExperimentParams } from 'src/statsig/hooks'
import { StatsigExperiments } from 'src/statsig/types'
import Logger from 'src/utils/Logger'
import { getWalletAsync } from 'src/web3/contracts'

const TAG = 'StoreWipeRecoveryScreen'

function StoreWipeRecoveryScreen() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const recoveringFromStoreWipe = useSelector(recoveringFromStoreWipeSelector)
  const { onboardingNameScreenEnabled } = useExperimentParams(
    ExperimentConfigs[StatsigExperiments.CHOOSE_YOUR_ADVENTURE]
  )

  const onPressGoToOnboarding = async () => {
    try {
      const wallet = await getWalletAsync()
      const account = wallet.getAccounts()[0]

      await requestPincodeInput(true, false, account)
      dispatch(startStoreWipeRecovery(account))
      navigate(
        firstOnboardingScreen({
          onboardingNameScreenEnabled,
          recoveringFromStoreWipe,
        })
      )
    } catch (error) {
      Logger.error(`${TAG}@goToOnboarding`, 'PIN error', error)
    }
  }

  return (
    <AccountErrorScreen
      title={t('storeRecoveryTitle')}
      testID="StoreWipeRecovery"
      description={t('storeRecoveryBody')}
      onPress={onPressGoToOnboarding}
      buttonLabel={t('storeRecoveryButton')}
    />
  )
}

StoreWipeRecoveryScreen.navOptions = noHeaderGestureDisabled

export default StoreWipeRecoveryScreen
