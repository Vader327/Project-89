import React, {Component} from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Entypo } from '@expo/vector-icons';
import SwipableFlatlist from '../Components/SwipableFlatlist';
import MyHeader from '../Components/MyHeader';
import firebase from 'firebase';
import db from '../config';

export default class NotificationScreen extends Component{
  constructor(props){
    super(props);
    this.state={
      userId: firebase.auth().currentUser.email,
      allNotifications: [],
    }
    this.notificationRef = null
  }

  getNotifications=()=>{
    this.requestRef = db.collection('all_notifications')
    .where('notification_status', '==', 'unread')
    .where('targeted_user_id', '==', this.state.userId)
    .onSnapshot((snapshot)=>{
      var allNotifications = [];
      snapshot.docs.map((doc)=>{
        var notification = doc.data();
        notification["doc_id"] = doc.id;
        allNotifications.push(notification);
      })
    this.setState({allNotifications: allNotifications})
    })
  }

  componentDidMount(){
    this.getNotifications();
  }
  componentWillUnmount(){
    this.notificationRef;
  }

  keyExtractor=(item, index)=>index.toString()

  renderItem=({item, index})=>{
    return(
      <ListItem key={index} title={item.item_name}
      leftElement={<Entypo name="box" color ='#696969' size={25} />}     
      titleStyle={{color: 'black', fontWeight: 'bold'}}
      subtitle={item.message}
      bottomDivider />
    )
  }

  render(){
    return(
      <View style={{flex: 1}}>
        <MyHeader title="Notifications" navigation={this.props.navigation} />
        <View style={{flex: 0.9}}>
          {this.state.allNotifications.length===0
          ? (<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 25, color: 'lightgray'}}>You have no notifications</Text>
          </View>)
          : <SwipableFlatlist allNotifications={this.state.allNotifications} />}
        </View>
      </View>
    )
  }
}