import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { DrawerItems } from 'react-navigation-drawer';
import { Ionicons } from '@expo/vector-icons';
import { Avatar, BottomSheet } from 'react-native-elements';
import firebase from 'firebase';
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import db from "../config";

export default class CustomSideBarMenu extends React.Component{
  constructor(){
    super();
    this.state={
      userId: firebase.auth().currentUser.email,
      image: '#',
      name: "",
      email: "",
      docId: "",
      isModalVisible: false,
      hasCameraPermisson: false,
    }
  }

  getCameraPermission=async()=>{
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasCameraPermisson: status === "granted"})
  }

  selectPicture=async(type)=>{
    if(type=="gallery"){
      const {cancelled, uri} = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      })
      if(!cancelled){this.uploadImage(uri, this.state.userId)}
      this.setState({isModalVisible: false})
    }
    else if(type=="camera"){
      this.getCameraPermission()
        const {cancelled, uri} = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        })
        if(!cancelled){this.uploadImage(uri, this.state.userId)}
        this.setState({isModalVisible: false})
      
    }
  }

  uploadImage=async(uri, imageName)=>{
    var response = await fetch(uri);
    var blob = await response.blob();
    var ref = firebase.storage().ref().child('user_profiles/' + imageName)

    return ref.put(blob).then((response)=>{this.fetchImage(response)})
  }

  fetchImage=(imageName)=>{
    var ref = firebase.storage().ref().child('user_profiles/' + imageName)      
    ref.getDownloadURL()
    .then((url)=>{this.setState({image: url})})
    .catch((err)=>{this.setState({image: '#'})})
  }

  getUserProfile(){
    db.collection('users').where('email_id', '==', this.state.userId).onSnapshot((snapshot)=>{
      snapshot.forEach((doc)=>{
        this.setState({
          name: doc.data().first_name + " " + doc.data().last_name,
          docId: doc.id,
          image: doc.data().image,
          email: doc.data().email_id,
        })
      })
    })
  }

  componentDidMount(){
    this.fetchImage(this.state.userId);
    this.getUserProfile();
  }

  render(){
    return(
      <View style={{flex: 1}}>
        <View style={styles.container}>
          <Ionicons name="ios-close" color="white" size={40}
          style={{position: 'absolute', top: 10, left: 10, width: 50, height: 50}}
           onPress={()=>this.props.navigation.toggleDrawer()} />
          
          <Avatar rounded source={{uri: this.state.image}} size="large" icon={{name: "user", type: "font-awesome"}}
          onPress={()=>{this.setState({isModalVisible: true})}} showAccessory />

          <View style={{marginTop: 10, alignItems: 'center'}}>
            <Text style={{fontFamily: 'Poppins', fontSize: 20, color: 'white'}}>
              {this.state.name}
            </Text>
            <Text style={{fontFamily: 'SFMedium', fontSize: 15, color: 'white'}}>
              {this.state.email}
            </Text>
          </View>

          <BottomSheet isVisible={this.state.isModalVisible}>
            <View style={{alignItems: 'center'}}>
              <View style={styles.menuButton}>
                <TouchableOpacity style={{margin: 15, width: '100%', alignItems: 'center'}} onPress={()=>{this.selectPicture("camera")}}>
                  <Text style={styles.menuText}>Camera</Text>
                </TouchableOpacity>
                <View style={{width: '100%', height: 2, backgroundColor: '#eeeeee'}} />
                <TouchableOpacity style={{margin: 15, width: '100%', alignItems: 'center'}} onPress={()=>{this.selectPicture("gallery")}}>
                  <Text style={styles.menuText}>Gallery</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.menuButton} onPress={()=>{this.setState({isModalVisible: false})}}>
                <Text style={[styles.menuText, {color: '#ff313b', padding: 15}]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </BottomSheet>
        </View>
        <View style={{flex: 1}}>
          <DrawerItems {...this.props} />
        </View>
        <View style={{width: '80%', height: 2, backgroundColor: '#eeeeee', alignSelf: 'center'}} />
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
  },
  menuButton:{
    backgroundColor: 'white',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '95%',
    borderRadius: 10,
  },
  menuText:{
    color: '#0a84ff',
    fontSize: 18,
    fontFamily: 'SFMedium',
  },
  container:{
    flex: 0.6,
    alignItems: 'center',
    backgroundColor: '#1c77ff',
    justifyContent: 'center',
  }
})