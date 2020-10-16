import React from 'react';
import { LogBox } from "react-native";
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import SignupLoginScreen from './screens/SignupLoginScreen';
import { AppDrawerNavigator } from './Components/AppDrawerNavigator';
import { AppTabNavigator } from './Components/AppTabNavigator';
import * as Font from 'expo-font';

LogBox.ignoreAllLogs();

export default class App extends React.Component{
  constructor(){
    super();
    this.state={fontsLoaded: false,}
  }

  async loadFonts(){
    await Font.loadAsync({
      'Poppins': require('./assets/fonts/Poppins-SemiBold.ttf'),
      'SFMedium': require('./assets/fonts/SF-Compact-Medium.otf'),
      'SFBold': require('./assets/fonts/SF-UI-Display-Bold.otf'),
    });
    this.setState({fontsLoaded: true});
  }

  componentDidMount() {
    this.loadFonts();
  }

  render(){
    return( 
      <AppContainer />
    )
  }
}

const switchNavigator = createSwitchNavigator({
  SignupLoginScreen :{screen: SignupLoginScreen},
  Drawer: {screen: AppDrawerNavigator},
  BottomTab: {screen: AppTabNavigator},
})

const AppContainer = createAppContainer(switchNavigator);