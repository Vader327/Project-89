import React from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { AppStackNavigator } from './AppStackNavigator'
import { Ionicons } from '@expo/vector-icons';
import ExchangeScreen from '../screens/ExchangeScreen';

export const AppTabNavigator = createBottomTabNavigator({
  "Home": {screen: AppStackNavigator, 
    navigationOptions: {
      tabBarIcon: ({focused})=>(<Ionicons name="ios-home" size={20} color={focused ? "#1c77ff" : "lightgray"} />),
      tabBarLabel: "Home",
    }},

  "Exchange": {screen: ExchangeScreen, 
    navigationOptions: {
      tabBarIcon: ({focused})=>(<Ionicons name="md-swap" size={20} color={focused ? "#1c77ff" : "lightgray"} />),
      tabBarLabel: "Exchange",
    }},
})
