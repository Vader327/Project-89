import React, {Component} from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Entypo } from '@expo/vector-icons';
import MyHeader from '../Components/MyHeader';
import firebase from 'firebase';
import db from '../config';

export default class MyBartersScreen extends Component {
  static navigationOptions = {header: null};

  constructor(){
    super();
    this.state={
      donorId: firebase.auth().currentUser.email,
      allBarters: [],
      donorName: "",
    }
    this.requestRef = null
  }

  getAllBarters=()=>{
    this.requestRef = db.collection("all_donations").where("donor_id" ,'==', this.state.donorId)
    .onSnapshot((snapshot)=>{
      var allBarters = []
      snapshot.docs.map((doc) =>{
        var barter = doc.data()
        barter["doc_id"] = doc.id
        allBarters.push(barter)
      });
      this.setState({
        allBarters: allBarters,
      });
    })
  }

  getDonorDetails=(donorId)=>{
    db.collection("users").where("email_id", "==", donorId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc) => {
        this.setState({donorName: doc.data().first_name + " " + doc.data().last_name})
      });
    })
  }

  sendItem=(itemDetails)=>{
    if(itemDetails.request_status === "Item Sent"){
      var requestStatus = "Donor Interested";
      db.collection('all_donations').doc(itemDetails.doc_id).update({
        "request_status": 'Donor Interested',
      })
      this.sendNotification(itemDetails, requestStatus);
    }
    else{
      var requestStatus = 'Item Sent';
      db.collection('all_donations').doc(itemDetails.doc_id).update({
        "request_status": 'Item Sent',
      })
      this.sendNotification(itemDetails, requestStatus);
    }
  }

  sendNotification=(itemDetails, requestStatus)=>{
    console.log(itemDetails)
    var requestId = itemDetails.request_id;
    var donorId = itemDetails.donor_id;
    db.collection('all_notifications').where("request_id", "==", requestId)
    .where('donor_id', '==', donorId).get().then((snapshot)=>{
      snapshot.forEach((doc)=>{
        var message = "";
        if(requestStatus=="Item Sent"){
          message = this.state.donorName + " has sent you the Item!"
        }
        else{
          message = this.state.donorName + " has shown interest in donating the item!"
        }
        db.collection('all_notifications').doc(doc.id).update({
          "message": message,
          'notification_status': "unread",
          'date': firebase.firestore.FieldValue.serverTimestamp(),
        })
      })
    })
  }

  keyExtractor=(item, index)=>index.toString()

  renderItem=({item, i})=>(
    <ListItem key={i} title={item.item_name} bottomDivider
      subtitle={<Text>{"Requested By: " + item.requested_by +"\nStatus: " + item.request_status}</Text>}
      titleStyle={{color: 'black', fontWeight: 'bold'}}
      leftElement={<Entypo name="box" color ='#696969' size={25} />}
      rightElement={
        <TouchableOpacity onPress={()=>{this.sendItem(item)}}
        style={[styles.button, {backgroundColor: item.request_status=="Item Sent" ?"#40eb34" : "#1c77ff"}]}>
          <Text style={{color: '#ffffff', fontWeight: '600'}}>{item.request_status=="Item Sent" ?"Exchanged" :"Exchange"}</Text>
        </TouchableOpacity>
    } />
  )


  componentDidMount(){
    this.getAllBarters();
    this.getDonorDetails(this.state.donorId);
  }

  componentWillUnmount(){
    this.requestRef();
  }

  render(){
     return(
       <View style={{flex:1}}>
         <MyHeader navigation={this.props.navigation} title="My Barters"/>
         <View style={{flex: 1}}>
            {this.state.allBarters.length===0
              ?(<View style={styles.subtitle}>
                  <Text style={{fontSize: 20}}>You have no Barters!</Text>
                </View>)
              :(<FlatList keyExtractor={this.keyExtractor} data={this.state.allBarters}
                 renderItem={this.renderItem} />)
            }
         </View>
       </View>
     )
   }
}


const styles = StyleSheet.create({
  button:{
    padding: 5,
    width: 85,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#1c77ff",
    borderRadius: 7,
  },
  subtitle:{
    flex: 1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  }
})