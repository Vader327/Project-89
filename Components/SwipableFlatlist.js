import React, {Component} from 'react';
import { View, Text, Animated, Dimensions, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Entypo, Octicons, Feather } from '@expo/vector-icons';
import {SwipeListView} from 'react-native-swipe-list-view';
import db from '../config';

export default class SwipableFlatlist extends Component{
  constructor(props){
    super(props);
    this.state={
      allNotifications: this.props.allNotifications,
    }
  }

  updateMarkAsRead=(notification)=>{
    db.collection('all_notifications').doc(notification.doc_id).update({
      "notification_status": "read",
    })
  }

  onSwipeValueChange=swipeData=>{
    var allNotifications = this.state.allNotifications;
    const {key, value} = swipeData;
    if(value < -Dimensions.get('window').width){
      const newData = [...allNotifications];
      const prevIndex = allNotifications.findIndex(item => (item.key===key))
      this.updateMarkAsRead(allNotifications[prevIndex]);
      newData.splice(prevIndex, 1)
      this.setState({allNotifications: newData})
    }
  }

  renderItem=data=>(
    <Animated.View>
      <ListItem bottomDivider leftElement={
        <View style={{backgroundColor: '#0394fc', padding: 5, borderRadius: 10,}}>
          <Entypo name="box" color ='#ffffff' size={25} />
        </View>
      }
      title={data.item.item_name} titleStyle={{color: 'black', fontFamily: 'SFBold',}}
      subtitle={data.item.message} subtitleStyle={{fontFamily: 'SFMedium',}} />
    </Animated.View>
  )

  renderHiddenItem=()=>(
    <View style={styles.swipeView}>
      <View style={styles.container}>
        <Feather name='chevron-left' color='#ffffff' size={25} style={{marginHorizontal: 2,}} />
        <Feather name='chevron-left' color='#ffffff' size={25} style={{marginHorizontal: 2,}} />
        <Feather name='chevron-left' color='#ffffff' size={25} style={{marginHorizontal: 2,}} />
        <Feather name='chevron-left' color='#ffffff' size={25} style={{marginHorizontal: 2,}} />
        <Feather name='chevron-left' color='#ffffff' size={25} style={{marginHorizontal: 2,}} />
        <Feather name='chevron-left' color='#ffffff' size={25} style={{marginHorizontal: 2,}} />

        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Octicons name="mail-read" color="#ffffff" size={25} />
          <Text style={{color: 'white', fontFamily: 'Poppins', marginTop: 5,}}>Swipe to Read</Text>
        </View>
      </View>
    </View>
  )

  render(){
    return(
      <View style={{flex: 1}}>
        <SwipeListView disableRightSwipe
        data={this.state.allNotifications}
        renderItem={this.renderItem}
        renderHiddenItem={this.renderHiddenItem}
        rightOpenValue={-Dimensions.get('window').width}
        previewRowKey='0' previewOpenValue={-40} previewOpenDelay={3000}
        onSwipeValueChange={this.onSwipeValueChange} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  swipeView:{
    alignItems: 'flex-end',
    backgroundColor: '#0394fc',
    justifyContent: 'center',
    paddingLeft: 15,
    height: '100%',
  },
  container:{
    alignItems: 'center',
    marginRight: 25,
    flexWrap: 'wrap',
    flexDirection: 'row',
  }
})