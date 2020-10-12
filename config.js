import firebase from 'firebase';
require('@firebase/firestore');

var firebaseConfig = {
    apiKey: "AIzaSyCUr9fM2sGbT-xRrBGGYf-3qNvTvLQjZAQ",
    authDomain: "barter-f2121.firebaseapp.com",
    databaseURL: "https://barter-f2121.firebaseio.com",
    projectId: "barter-f2121",
    storageBucket: "barter-f2121.appspot.com",
    messagingSenderId: "650755267823",
    appId: "1:650755267823:web:3646360e6f03ef9b240f1a"
};

firebase.initializeApp(firebaseConfig);

export default firebase.firestore();