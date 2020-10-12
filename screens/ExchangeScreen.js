import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import MyHeader from '../Components/MyHeader';
import firebase from 'firebase';
import db from '../config';

export default class ExchangeScreen extends React.Component{
  constructor(){
    super();
    this.state={
      userID: firebase.auth().currentUser.email,
      name: "",
      description: "",
    }
  }

  createUniqeId(){
    return Math.random().toString(36).substring(7)
  }

  addItem=(name, description)=>{
    if(this.state.name.trim() != "" && this.state.description.trim() != ""){
      var randomRequestId = this.createUniqeId();

      db.collection('requested_items').add({
        "user_id":  this.state.userID,
        'item_name': name,
        'description': description,
        'request_id': randomRequestId,
      })

      this.setState({name: "", description: ""})
      return Alert.alert("Item Added Successfully!")
    }
    else{
      return Alert.alert("Please Enter the Details!")
    }
  }

  render(){
    return(
      <View style={{height: "100%"}}>
        <MyHeader title="Add Item" navigation={this.props.navigation} />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{height: '100%'}}>
          <KeyboardAvoidingView style={{height: '100%'}} enabled behavior="padding">
            <TextInput style={styles.formatTextInput} placeholder="Item Name"
            onChangeText={(text)=>{this.setState({name: text})}} value={this.state.name} />

            <TextInput style={styles.formatTextInput}
            placeholder="Description" multiline maxHeight={150}
            onChangeText={(text)=>{this.setState({description: text})}} value={this.state.description} />

            <TouchableOpacity style={styles.button}
            onPress={()=>{this.addItem(this.state.name, this.state.description)}}>
              <Text style={{color: '#ffffff', fontWeight: '600', fontSize: 20,}}>Request</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  formatTextInput:{
    borderBottomColor: 'lightgray',
		borderBottomWidth: 3,
		marginTop: 30,
		width: '80%',
		alignSelf: 'center',
  },
  button:{
    position: 'absolute',
		bottom: 80,
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
  }
})