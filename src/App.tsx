import React, { FormEvent, useState } from 'react';
import './App.css';
import SignUp from './auth/SignUp';
import firebase from 'firebase';
import { FirebaseConfig } from './config';


const App = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp(FirebaseConfig);
}

  return (
    <div className="App">
      <header className="App-header">
        <SignUp></SignUp>
      </header>
    </div>
  );
}

export default App;
