import React, { useState, useEffect } from "react";
import './App.css';
import "./asset/tailwind.css";

import firebase from "@firebase/app";
import fire from './firebaseConfig';
import Hero from './components/Hero';
import "@firebase/auth";
import Login from './components/Login.js';
import LoggedIn from "./components/LoggedIn";

const App = () => {
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [google, setGoogleSignup] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [hasAccount, setHasAccount] = useState(false);
  var provider = new firebase.auth.GoogleAuthProvider();



  const clearInputs = () => {
    setEmail('');
    setPassword('');
    setGoogleSignup('');
  }

  const clearErrors = () => {
    setEmailError('');
    setPasswordError('');
    setGoogleSignup('');

  }

  const handleLogin = () => {
    clearErrors();
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(err => {
        switch (err.code) {
          case "auth/invalid-email":
          case "auth/user-disabled":
          case "auth/user-not-found":
            setEmailError(err.message);
            break;
          case "auth/wrong-password":
            setPasswordError(err.message);
            break;
        }
      });
  };

  const googleSignup = () => {
   
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
  }

  const handleSignup = () => {
    clearErrors();
    fire
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch((err) => {
        switch (err.code) {
          case "auth/email-already-in-use":
          case "auth/invalid-email":
          case "auth/weak-password":
            setPasswordError(err.message);
            break;
        }
      });
  }
  const handleLogout = () => {
    fire.auth().signOut();
  };
  
  const authListener = () => {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        clearInputs();
        setUser(user);
      } else {
        setUser("");
      }
    });
  };
  
  useEffect(() => {
    authListener();
  });



  
  

    
  
          
            
      


  return (
    <div className="App">
      {user ? (
        // <Hero handleLogout={handleLogout}></Hero>
        <LoggedIn logOut={handleLogout} />
      ) : (
        <Login
          email={email}
          setEmail={setEmail}
          password={password}
          google={googleSignup}
          setPassword={setPassword}
          handleLogin={handleLogin}
          handleSignup={handleSignup}
          hasAccount={hasAccount}
          setHasAccount={setHasAccount}
          emailError={emailError}
          passwordError={passwordError}
        />
      )}
      ;
    </div>
  );
}

export default App;
