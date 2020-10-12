import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Modal, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import TradeAnimation from '../Components/TradeAnimation.js';
import firebase from 'firebase';
import db from '../config';

export default class SignupLoginScreen extends React.Component{
	constructor(){
		super();
		this.state={
			username: '',
			password: '',
			firstName: '',
			lastName: '',
			contact: 0,
			address: '',
			confirmPassword: '',
			isModalVisible: false,
			isLoginViewActive: true,
		}
	}

	userSignup=(username, password, confirmPassword)=>{
		if(password !== confirmPassword){
			return Alert.alert("Passwords do not match!")
		}
		else{
			firebase.auth().createUserWithEmailAndPassword(username, password)
			.then(()=>{
				db.collection('users').add({
					first_name: this.state.firstName,
					last_name: this.state.lastName,
					address: this.state.address,
					contact: this.state.contact,
					email_id: this.state.username,
				})
				return Alert.alert("User added successfully!", '', [{
					text: 'Ok',
					onPress: ()=>{this.setState({"isModalVisible": false, isLoginViewActive: true})}}])
			})
			.catch(function(error){
				var errorCode = error.code;
				var errorMessage = error.message;
				return Alert.alert(errorMessage);
			})
		}
	}

	userLogin=(username, password)=>{
		firebase.auth().signInWithEmailAndPassword(username, password)
		.then(()=>{
			return this.props.navigation.navigate("Home")
		})
		.catch(function(error){
			var errorCode = error.code;
			var errorMessage = error.message;
			return Alert.alert(errorMessage);
		})
	}

	showModal=()=>{
		return(
			<Modal animationType="slide" transparent={true} visible={this.state.isModalVisible}>
				<View style={styles.modalContainer}>
					<KeyboardAvoidingView behavior="padding" enabled style={{paddingTop: 20}}>
						<ScrollView>
							<Text style={{fontWeight: '600', alignSelf: 'center', fontSize: 25, color:'#1c77ff'}}>Sign Up</Text>
							<TextInput style={styles.input} placeholder="First Name"
							onChangeText={(text)=>{this.setState({firstName: text})}} />
							
							<TextInput style={styles.input} placeholder="Last Name"
							onChangeText={(text)=>{this.setState({lastName: text})}} />

							<TextInput style={styles.input} placeholder="Email ID" keyboardType="email-address"
							onChangeText={(text)=>{this.setState({username: text})}} />

							<TextInput style={styles.input} placeholder="Contact" keyboardType="number-pad" maxLength={10}
							onChangeText={(text)=>{this.setState({contact: text})}} />

							<TextInput style={styles.input} placeholder="Address" multiline={true}
							onChangeText={(text)=>{this.setState({address: text})}} />

							<TextInput style={styles.input} placeholder="Password" secureTextEntry={true}
							onChangeText={(text)=>{this.setState({password: text})}} />

							<TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry={true}
							onChangeText={(text)=>{this.setState({confirmPassword: text})}} />

							<View style={styles.buttonContainer}>
								<TouchableOpacity style={[styles.login, {marginTop: 0}]}
								onPress={()=>{this.userSignup(this.state.username, this.state.password, this.state.confirmPassword)}}>
									<Text style={styles.buttonText}>Register</Text>
								</TouchableOpacity>

								<TouchableOpacity onPress={()=>{this.setState({isModalVisible: false, isLoginViewActive: true})}}>
									<Text style={[styles.buttonText, {color: '#1c77ff', marginTop: 31, marginBottom: 30}]}>Cancel</Text>
								</TouchableOpacity>
							</View>
						</ScrollView>
					</KeyboardAvoidingView>
				</View>
			</Modal>
		)
	}

	render(){
		return (
			<KeyboardAvoidingView behavior="position" enabled={this.state.isLoginViewActive}
			style={{height: '100%', backgroundColor: '#ffffff'}}>
				<View style={{alignContent: 'center', justifyContent: 'center'}}>
					{this.showModal()}
				</View>

				<View style={styles.container}>
					<View style={{alignItems: 'center', transform: [{scaleX: 0.7}]}}>
						<TradeAnimation />
						<Text style={styles.title}>Barter</Text>
					</View>
				</View>

				<TouchableWithoutFeedback style={{height: '100%'}} onPress={Keyboard.dismiss}>
					<View>
						<Text style={styles.loginText}>Login</Text>
						<TextInput style={styles.input} placeholder="Email"
						onChangeText={(text)=>{this.setState({username: text})}}
						keyboardType="email-address" />

						<TextInput style={styles.input} placeholder="Password"
						onChangeText={(text)=>{this.setState({password: text})}}
						secureTextEntry={true} />				

						<TouchableOpacity style={styles.login}
						onPress={()=>{this.userLogin(this.state.username, this.state.password)}}>
							<Text style={styles.buttonText}>Login</Text>
						</TouchableOpacity>

						<TouchableOpacity style={{marginTop: 20}}
						onPress={()=>{this.setState({isModalVisible: true, isLoginViewActive: false})}}>
							<Text style={[styles.buttonText, {color: "#1c77ff"}]}>Sign Up</Text>
						</TouchableOpacity>
					</View>
				</TouchableWithoutFeedback>
			</KeyboardAvoidingView>
		);
  }
}

const styles = StyleSheet.create({
	input:{
		borderBottomColor: 'lightgray',
		borderBottomWidth: 3,
		marginTop: 30,
		width: '80%',
		alignSelf: 'center',
	},
	login:{
		marginTop: 80,
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
		fontSize: 30,
		fontWeight:'600',
		color: '#ffffff',
		marginTop: 10,
	},
	loginText:{
		fontSize: 20,
		fontWeight:'600',
		color: '#1c77ff',
		marginTop: 15,
		alignSelf: 'center',
	},
	modalContainer:{
		top: '5%',
		width: '90%',
		height: '90%',
		alignSelf: 'center',
		borderRadius: 10,
		backgroundColor: '#ffffff',
		shadowColor: "#000",
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.30,
    shadowRadius: 10,
    elevation: 16,
	},
	buttonContainer:{
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 30
	},
	container:{
		alignItems:'center',
		paddingTop: 50,
		backgroundColor: '#1c77ff',
		paddingBottom: 10,
		transform: [{scaleX: 1.5}],
		borderBottomStartRadius: 200,
		borderBottomEndRadius: 200,
	}
});
