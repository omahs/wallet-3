import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'
import { useTranslation } from 'react-i18next'
import DAppsExplorerScreenSearchFilter from 'src/dappsExplorer/DAppsExplorerScreenSearchFilter'
import WalletHome from 'src/home/WalletHome'
import Discover from 'src/icons/navigator/Discover'
import Home from 'src/icons/navigator/Home'
import Wallet from 'src/icons/navigator/Wallet'
import { Screens } from 'src/navigator/Screens'
import { StackParamList } from 'src/navigator/types'
import Colors from 'src/styles/colors'
import AssetsScreen from 'src/tokens/Assets'

const Tab = createBottomTabNavigator()

type Props = NativeStackScreenProps<StackParamList, Screens.TabNavigator>

export default function TabNavigator({ route }: Props) {
  const initialScreen = route.params?.initialScreen ?? Screens.WalletHome
  const { t } = useTranslation()

  return (
    <Tab.Navigator
      initialRouteName={initialScreen}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.black,
        tabBarInactiveTintColor: Colors.gray3,
      }}
    >
      <Tab.Screen
        // TODO(act-1104) new assets screen
        name={Screens.Assets}
        // @ts-expect-error Type '{}' is missing the following properties from type 'Props': navigation, route
        component={AssetsScreen}
        icon={Wallet}
        options={{
          tabBarLabel: t('tabBar.wallet') as string,
          tabBarIcon: ({ color, size }) => <Wallet color={color} size={size} />,
        }}
      />
      <Tab.Screen
        // TODO(act-1105) new home tab screen
        name={Screens.WalletHome}
        component={WalletHome}
        options={{
          freezeOnBlur: false,
          lazy: false,
          tabBarLabel: t('tabBar.home') as string,
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tab.Screen
        // TODO(act-1106) discover tab screen
        name={Screens.DAppsExplorerScreen}
        component={DAppsExplorerScreenSearchFilter}
        options={{
          tabBarLabel: t('tabBar.discover') as string,
          tabBarIcon: ({ color, size }) => <Discover color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  )
}
