import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import deviceInfoModule from 'react-native-device-info'
import { useSelector } from 'react-redux'
import { defaultCountryCodeSelector, e164NumberSelector, nameSelector } from 'src/account/selectors'
import { phoneNumberVerifiedSelector } from 'src/app/selectors'
import AccountNumber from 'src/components/AccountNumber'
import ContactCircleSelf from 'src/components/ContactCircleSelf'
import PhoneNumberWithFlag from 'src/components/PhoneNumberWithFlag'
import Touchable from 'src/components/Touchable'
import Times from 'src/icons/Times'
import Help from 'src/icons/navigator/Help'
import { Invite } from 'src/icons/navigator/Invite'
import Settings from 'src/icons/navigator/Settings'
import { navigate, navigateBack } from 'src/navigator/NavigationService'
import RewardsPill from 'src/navigator/RewardsPill'
import { Screens } from 'src/navigator/Screens'
import { StackParamList } from 'src/navigator/types'
import { NETWORK_NAMES } from 'src/shared/conts'
import colors, { Colors } from 'src/styles/colors'
import fontStyles, { typeScale } from 'src/styles/fonts'
import { Spacing } from 'src/styles/styles'
import variables from 'src/styles/variables'
import { getSupportedNetworkIdsForTokenBalances } from 'src/tokens/utils'
import { currentAccountSelector } from 'src/web3/selectors'

type Props = NativeStackScreenProps<StackParamList, Screens.ProfileMenu>

export default function ProfileMenu({ route }: Props) {
  const { t } = useTranslation()
  const displayName = useSelector(nameSelector)
  const e164PhoneNumber = useSelector(e164NumberSelector)
  const defaultCountryCode = useSelector(defaultCountryCodeSelector)
  const account = useSelector(currentAccountSelector)
  const appVersion = deviceInfoModule.getVersion()
  const phoneNumberVerified = useSelector(phoneNumberVerifiedSelector)
  const networks = getSupportedNetworkIdsForTokenBalances()
  const networkNames = networks.map((network) => NETWORK_NAMES[network])
  return (
    <ScrollView>
      <View style={styles.drawerTop}>
        <View style={styles.drawerHeader} testID="Drawer/Header">
          <Touchable
            onPress={navigateBack}
            borderless={true}
            hitSlop={variables.iconHitslop}
            testID="InviteModalCloseButton"
          >
            <Times />
          </Touchable>
          <RewardsPill />
        </View>
        <ContactCircleSelf size={64} />
        {!!displayName && (
          <Text style={styles.nameLabel} testID="Drawer/Username">
            {displayName}
          </Text>
        )}
        {phoneNumberVerified && e164PhoneNumber && (
          <PhoneNumberWithFlag
            e164PhoneNumber={e164PhoneNumber}
            defaultCountryCode={defaultCountryCode ? defaultCountryCode : undefined}
          />
        )}
      </View>
      <View style={styles.topBorder} />
      <Touchable testID="Invite" onPress={() => navigate(Screens.Invite)}>
        <View style={styles.container}>
          <Invite color={Colors.gray3} />
          <Text style={styles.actionLabel}>{t('invite')}</Text>
        </View>
      </Touchable>
      <Touchable testID="Settings" onPress={() => navigate(Screens.Settings)}>
        <View style={styles.container}>
          <Settings color={Colors.gray3} />
          <Text style={styles.actionLabel}>{t('settings')}</Text>
        </View>
      </Touchable>
      <Touchable testID="Help" onPress={() => navigate(Screens.Support)}>
        <View style={styles.container}>
          <Help color={Colors.gray3} />
          <Text style={styles.actionLabel}>{t('help')}</Text>
        </View>
      </Touchable>
      <View style={styles.bottomBorder} />
      <View style={styles.drawerBottom}>
        <Text style={fontStyles.label}>{t('address')}</Text>
        <AccountNumber address={account || ''} location={Screens.DrawerNavigator} />
        <Text style={styles.supportedNetworks}>
          {networks.length > 1
            ? t('supportedNetworks', {
                networks: `${networkNames.slice(0, -1).join(', ')} ${t('and')} ${networkNames.at(
                  -1
                )}`,
              })
            : t('supportedNetwork', {
                network: networkNames[0],
              })}
        </Text>
        <Text style={styles.smallLabel}>{t('version', { appVersion })}</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  drawerTop: {
    marginLeft: 24,
    alignItems: 'flex-start',
    marginRight: 16,
  },
  drawerHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  nameLabel: {
    ...typeScale.titleSmall,
    marginBottom: Spacing.Smallest8,
    marginTop: Spacing.Smallest8,
  },
  topBorder: {
    marginTop: 24,
    marginBottom: 24,
    marginLeft: 24,
    height: 1,
    backgroundColor: colors.gray2,
    alignSelf: 'stretch',
  },
  bottomBorder: {
    marginTop: 24,
    marginLeft: 24,
    height: 1,
    backgroundColor: colors.gray2,
    alignSelf: 'stretch',
  },
  drawerBottom: {
    marginVertical: 32,
    marginHorizontal: 16,
    gap: Spacing.Smallest8,
  },
  smallLabel: {
    ...fontStyles.small,
    color: colors.gray4,
    marginTop: 24,
  },
  supportedNetworks: {
    ...typeScale.bodyXSmall,
    color: colors.gray3,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 24,
    gap: 12,
  },
  actionLabel: {
    ...typeScale.bodyMedium,
  },
})
