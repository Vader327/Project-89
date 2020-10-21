import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { ListItem } from 'react-native-elements';
import MyHeader from '../Components/MyHeader';
import db from '../config';

export default class HomeScreen extends React.Component{
  constructor(){
    super();
    this.state={
      requestedItemsList: []
    }

    this.requestRef = null;
  }

  getRequestedBooksList=()=>{
    this.requestRef = db.collection("requested_items")
    .onSnapshot((snapshot)=>{
      var requestedItemsList = snapshot.docs.map(document=>document.data())
      this.setState({requestedItemsList: requestedItemsList})
    })
  }

  componentDidMount(){
    this.getRequestedBooksList();
  }

  componentWillUnmount(){
    this.requestRef();
  }

  keyExtractor=(item, index)=>index.toString()

  renderItem=({item, i})=>(
    <ListItem key={i} title={item.item_name} containerStyle={styles.list}
    subtitle={<Text numberOfLines={1}>{item.description}</Text>}
    description={item.item_value}
    titleStyle={{color: 'black', fontWeight: 'bold'}}
    rightElement={
      <TouchableOpacity style={styles.button}
      onPress={()=>{this.props.navigation.navigate("RecieverDetails", {"details": item})}}>
        <Text style={{color: '#ffffff', fontSize: 15, fontWeight: '600'}}>Exchange</Text>
        <Entypo name="chevron-right" size={18} color="#ffffff" />
      </TouchableOpacity>} />
    )
  
  
  render(){
    return(
      <View style={{height: "100%"}}>
        <MyHeader title="Donate Items" navigation={this.props.navigation} />

        <View style={{flex: 1, backgroundColor: '#fafafa'}}>
          {this.state.requestedItemsList.length==0
          ? (<View style={{alignItems: 'center', height: '100%', justifyContent: 'center'}}>
              <ActivityIndicator size="small" />
              <Text style={{fontSize: 20, color: 'lightgray', marginTop: 10,}}>Loading</Text>
            </View>)
          : <FlatList keyExtractor={this.keyExtractor} contentContainerStyle={{paddingBottom: 10,}}
            data={this.state.requestedItemsList} renderItem={this.renderItem} />}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  list:{
    marginTop: 10,
    width: '95%',
    alignSelf: 'center',
    borderRadius: 7,
    shadowColor: "#c9c9c9",
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 1,
		shadowRadius: 15,
    elevation: 16,
  },
  button:{
    flexDirection: 'row',
    backgroundColor: '#1c77ff',
    padding: 3,
    paddingLeft: 7,
    borderRadius: 6,
  }
})