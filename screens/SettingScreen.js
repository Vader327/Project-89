import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert, TextInput } from 'react-native';
import MyHeader from '../Components/MyHeader';
import db from '../config';
import firebase from 'firebase';

export default class SettingScreen extends React.Component{
  constructor(){
    super();
    this.state={
      emailId : '',
			firstName: '',
			lastName: '',
			contact: 0,
			address: '',
			docId: '',
    }
  }

  getUserDetails=()=>{
    var email = firebase.auth().currentUser.email;
    db.collection('users').where('email_id', '==', email).get()
    .then(snapshot=>{
      snapshot.forEach(doc=>{
        var data = doc.data();
        this.setState({
          emailId: data.email_id,
          firstName: data.first_name,
          lastName: data.last_name,
          address: data.address,
          contact: data.contact,
          docId: doc.id,
        })
      })
    })
  }

  updateUserDetails=()=>{
    if(this.state.firstName != "" && this.state.lastName != "" && this.state.contact != "" && this.state.address != ""){
      db.collection('users').doc(this.state.docId).update({
        "first_name": this.state.firstName,
        "last_name": this.state.lastName,
        "contact": this.state.contact,
        "address": this.state.address,
      })
      Alert.alert("Profile Updated Successfully!")
    }
    else{
      Alert.alert("Fields cannot be Empty!")
    }
  }

  componentDidMount(){
    this.getUserDetails();
  }

  render(){
    return(
      <View style={{height: '100%'}}>
        <MyHeader title="Settings" navigation={this.props.navigation} />
        <KeyboardAvoidingView behavior="padding" enabled style={{height: '100%'}}>
          <ScrollView style={{height: '100%'}}>
            <Text style={styles.title}>Update Your Profile</Text>

            <Text style={styles.fieldName}>First Name</Text>
            <TextInput style={styles.input} placeholder="First Name"
            onChangeText={(text)=>{this.setState({firstName: text})}}  value={this.state.firstName} />
            
            <Text style={styles.fieldName}>Last Name</Text>
            <TextInput style={styles.input} placeholder="Last Name"
            onChangeText={(text)=>{this.setState({lastName: text})}} value={this.state.lastName} />

            <Text style={styles.fieldName}>Contact</Text>
            <TextInput style={styles.input} placeholder="Contact" keyboardType="number-pad" maxLength={10}
            onChangeText={(text)=>{this.setState({contact: text})}} value={this.state.contact} />

            <Text style={styles.fieldName}>Address</Text>
            <TextInput style={styles.input} placeholder="Address" multiline={true}
            onChangeText={(text)=>{this.setState({address: text})}} value={this.state.address} />

            <TouchableOpacity style={styles.updateButton}
            onPress={this.updateUserDetails}>
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>

          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    )
  }  
}

const styles = StyleSheet.create({
  input:{
		borderBottomColor: '#1c77ff',
		borderBottomWidth: 3,
		marginTop: 5,
		width: '80%',
		alignSelf: 'center',
	},
	updateButton:{
    marginTop: 50,
    marginBottom: 20,
		alignSelf: 'center',
		backgroundColor: '#1c77ff',
		width: '60%',
		height: 40,
		borderRadius: 7,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: "#1c77ff",
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
		shadowRadius: 15,
    elevation: 16,
	},
	buttonText:{
		color: '#ffffff',
		fontSize: 17,
		fontWeight: '600',
		alignSelf: 'center',
  },
  title:{
    alignSelf: 'center',
    marginTop: 10,
    fontSize: 18,
    fontWeight: '600',
  },
  fieldName:{
    left: '10%',
    marginTop: 40,
    textTransform: 'uppercase',
    fontWeight: '900',
    color: '#1c77ff',
  }
})