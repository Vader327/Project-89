import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Animated } from 'react-native';
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
      requestId: '',
      IsExchangeRequestActive: "",
      requestedItemName: "",
      itemStatus: "",
      userDocId: '',
      docId: '',
    }
    this.animatedScale = new Animated.Value(1);
  }
  
	handleButtonScaleIn=()=>{
    Animated.timing(this.animatedScale, {
      toValue: 0.85,
			duration: 100,
			useNativeDriver: true,
    }).start();
	}
	handleButtonScaleOut=()=>{
    Animated.timing(this.animatedScale, {
      toValue: 1,
			duration: 200,
			useNativeDriver: true,
    }).start();
  }

  createUniqeId(){
    return Math.random().toString(36).substring(7)
  }

  addItem=async(name, description)=>{
    if(this.state.name.trim() != "" && this.state.description.trim() != ""){
      var randomRequestId = this.createUniqeId();

      db.collection('requested_items').add({
        "user_id":  this.state.userID,
        'item_name': name,
        'description': description,
        'request_id': randomRequestId,
        'item_status': 'requested',
        'date': firebase.firestore.FieldValue.serverTimestamp()
      })

      await this.getItemRequest();

      db.collection('users').where('email_id', '==', this.state.userID).get()
      .then((snapshot)=>{
        snapshot.forEach((doc)=>{
          db.collection('users').doc(doc.id).update({
            IsExchangeRequestActive: true,
          })
        })
      })

      this.setState({name: "", description: "", requestId: randomRequestId})
      return Alert.alert("Item Added Successfully!")
    }
    else{
      return Alert.alert("Please Enter the Details!")
    }
  }

  receivedItems=(itemName)=>{
    db.collection('received_items').add({
      'user_id': this.state.userID,
      'item_name': itemName,
      'request_id': this.state.requestId,
      'item_status': 'received',
    })
  }

  getIsExchangeRequestActive(){
    db.collection('users').where('email_id', '==', this.state.userID).onSnapshot(snapshot=>{
      snapshot.forEach(doc=>{
        console.log()
        this.setState({
          IsExchangeRequestActive: doc.data().IsExchangeRequestActive,
          userDocId: doc.id,
        })
      })
    })
  }

  getItemRequest=()=>{
    db.collection('requested_items').where('user_id', '==', this.state.userID).get()
    .then(snapshot=>{
      snapshot.forEach(doc=>{
        if(doc.data().item_status !== 'received'){
          this.setState({
            requestId: doc.data().request_id,
            requestedItemName: doc.data().item_name,
            itemStatus: doc.data().item_status,
            docId: doc.id,
          })
        }
      })
    })
  }

  sendNotification=()=>{
    console.log("hi")
    db.collection('users').where('email_id', '==', this.state.userID).get().then(snapshot=>{
      snapshot.forEach(doc=>{
        var name = doc.data().first_name;
        var lastName = doc.data().last_name;
        console.log("hi1")

        db.collection('all_donations').where('request_id', '==', this.state.requestId).get().then(snapshot=>{
          snapshot.forEach(doc=>{
            var donorId = doc.data().donor_id;
            var itemName = doc.data().item_name;
            console.log("hi2")

            db.collection('all_notifications').add({
              'targeted_user_id': donorId,
              'message': name + " " + lastName + " received the item " + itemName,
              'notification_status': 'unread',
              'item_name': itemName,
            })
          })
        })
      })
    })
  }

  componentDidMount(){
    this.getItemRequest();
    this.getIsExchangeRequestActive();
  }

  updateItemRequestStatus=()=>{
    db.collection('requested_items').doc(this.state.docId).update({item_status: 'received'})
    db.collection("users").where("email_id", "==", this.state.userID).get().then((snapshot)=>{
      snapshot.forEach((doc)=>{
        db.collection("users").doc(doc.id).update({
          IsExchangeRequestActive: false,
        });
      });
    });
  }

  render(){
    if(this.state.IsExchangeRequestActive){
      return(
        <View style={{height: '100%', alignItems: 'center'}}>
          <MyHeader title="Add Item" navigation={this.props.navigation} />
          <View style={styles.container}>
            <View style={styles.field}>
              <Text style={styles.fieldName}>Name:</Text>
              <Text style={styles.fieldValue}>{this.state.requestedItemName}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldName}>Status:</Text>
              <Text style={styles.fieldValue}>{this.state.itemStatus.charAt(0).toUpperCase() + this.state.itemStatus.slice(1)}</Text>
            </View>
          </View>

          <TouchableWithoutFeedback onPressIn={this.handleButtonScaleIn} delayPressIn={0} delayPressOut={0}
          onPressOut={()=>{
            this.sendNotification()
            this.updateItemRequestStatus();
            this.receivedItems(this.state.requestedItemName)
          }}>
            <Animated.View style={[styles.button, {transform: [{scale: this.animatedScale}], width: '80%',}]}>
              <Text style={{color: '#ffffff', fontWeight: '600', fontSize: 20,}}>I have received the Item</Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      )
    }
    else{
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

              <TouchableWithoutFeedback onPressIn={this.handleButtonScaleIn} delayPressIn={0} delayPressOut={0}
              onPressOut={()=>{
                this.addItem(this.state.name, this.state.description);
                this.handleButtonScaleOut();}}>
                <Animated.View style={[styles.button, {transform: [{scale: this.animatedScale}]}]}>
                  <Text style={{color: '#ffffff', fontWeight: '600', fontSize: 20,}}>Request</Text>
                </Animated.View>
              </TouchableWithoutFeedback>

            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      )
    }
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
		transform: [{scale: 1}]
  },
  container:{
    alignItems: 'center',
    marginTop: 80,
    flex: 1,
    width: '100%',
  },
  field:{
    flexWrap: 'wrap',
    flexDirection: 'row',   
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  fieldName:{
    textAlign: 'left',
    fontSize: 20,
    fontFamily: 'Poppins',
    color: '#1c77ff',
    marginHorizontal: 10,
  },
  fieldValue:{
    marginHorizontal: 5,
    fontSize: 17,
    fontFamily: 'Poppins',
  }
})