import React from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { AppTabNavigator } from './AppTabNavigator';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import CustomSideBarMenu from './CustomSideBarMenu';
import SettingScreen from '../screens/SettingScreen';
import MyBartersScreen from '../screens/MyBartersScreen';
import NotificationScreen from '../screens/NotificationScreen';
import MyReceivedItemsScreen from '../screens/MyReceivedItemsScreen';

export const AppDrawerNavigator = createDrawerNavigator({
  Home: {
    screen: AppTabNavigator,
    navigationOptions: {drawerIcon: ({tintColor})=><Ionicons name="ios-home" size={20} color={tintColor} />}
  },
  "My Donations": {
    screen: MyBartersScreen,
    navigationOptions: {
      drawerIcon: ({tintColor})=><Ionicons name="ios-swap" size={20} color={tintColor} />,
      drawerLabel: "My Barters",
    }
  },
  Notifications: {
    screen: NotificationScreen,
    navigationOptions: {drawerIcon: ({tintColor})=><Ionicons name="ios-notifications" size={20} color={tintColor} />}
  },
  "Received Items": {
    screen: MyReceivedItemsScreen,
    navigationOptions: {drawerIcon: ({tintColor})=><MaterialCommunityIcons name="file-document-box-check" size={20} color={tintColor} />}
  },
  Settings: {
    screen: SettingScreen,
    navigationOptions: {drawerIcon: ({tintColor})=><Ionicons name="ios-settings" size={20} color={tintColor} />}
  },
},
{contentComponent: CustomSideBarMenu},
{initialRouteName: 'Home'},
)