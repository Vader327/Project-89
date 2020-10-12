import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { DrawerItems } from 'react-navigation-drawer';
import { Ionicons } from '@expo/vector-icons';
import firebase from 'firebase';

export default class CustomSideBarMenu extends React.Component{
  render(){
    return(
      <View style={{flex: 1}}>
        <View style={{flex: 1,}}>
          <DrawerItems {...this.props} />
        </View>
        <View style={styles.logOutContainer}>
          <TouchableOpacity style={styles.logOutButton}
          onPress={()=>{
            this.props.navigation.navigate("SignupLoginScreen");
            firebase.auth().signOut();
          }}>
            <Ionicons name="ios-log-out" size={23} color="#000000" style={{marginRight: 30, transform: [{translateY: -3}]}} />
            <Text style={styles.logOutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  logOutContainer:{
    flex: 0.2,
    justifyContent: 'flex-end',
    paddingBottom: 30,
  },
  logOutText:{
    fontWeight: 'bold',
    color: "#000000",
    fontSize: 15,
  },
  logOutButton:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  }
})