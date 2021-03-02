import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBNF-C50nZYX_rkdiBkmcRS3Sah6mdp_W4",
  authDomain: "fir-authclout.firebaseapp.com",
  databaseURL: "https://firebaseauthclout-default-rtdb.firebaseio.com",
  projectId: "firebaseauthclout",
  storageBucket: "firebaseauthclout.appspot.com",
  messagingSenderId: "759274942411",
  appId: "1:759274942411:web:6bee46728878ec7a39d04e",
};

const fire = firebase.initializeApp(firebaseConfig);

export default fire;