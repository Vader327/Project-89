import React from 'react';
import { View } from 'react-native';
import { Header, Icon, Badge } from 'react-native-elements';
import { RFValue } from 'react-native-responsive-fontsize';
import firebase from 'firebase';
import db from '../config';

export default class MyHeader extends React.Component{
  constructor(props){
    super(props);
    this.state={
      value: "",
    }
  }

  getNumberOfUnreadNotifications(){
    db.collection('all_notifications')
    .where('notification_status', '==', 'unread')
    .where('targeted_user_id', '==', firebase.auth().currentUser.email)
    .onSnapshot((snapshot)=>{
      var unreadNotifications = snapshot.docs.map((doc)=>doc.data());
      this.setState({value: unreadNotifications.length})
    })
  }

  componentDidMount(){
    this.getNumberOfUnreadNotifications();
  }

  BellIconWithBadge=()=>{
    return(
      <View>
        <Icon name='notifications' type='ionicons' color='#ffffff' size={25}
          onPress={()=>this.props.navigation.navigate('Notifications')}/>
        <Badge value={this.state.value} status="error"
        containerStyle={{position: 'absolute', top: -4, right: -4}} />
      </View>
    )
  }


  render(){
    return(
      <Header backgroundColor="#1c77ff"
      leftComponent={<Icon name='menu' type='feather' color='#ffffff' onPress={()=>this.props.navigation.toggleDrawer()}/>}
      centerComponent={{text: this.props.title, style:{color: "#ffffff", fontSize: RFValue(25), fontFamily: 'Poppins'}}}
      rightComponent={<this.BellIconWithBadge {...this.props} />} />
    )
  }
}