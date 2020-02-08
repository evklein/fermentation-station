import React, { FormEvent, useState } from 'react';
import './App.css';
import SignUp from './components/auth/SignUp';
import SignIn from './components/auth/SignIn';
import firebase from 'firebase';
import { FirebaseConfig } from './config';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import Home from './components/home/Home';



const App = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp(FirebaseConfig);
}

  return (
    <Router>
      <Navbar bg="dark" expand="lg">
        <Navbar.Brand>Fermentation Station</Navbar.Brand>
        <Nav className="mr-auto">
          <Link to="/sign-up">Sign Up</Link>
          <Link to="/sign-in"></Link>
        </Nav>
      </Navbar>

      <Switch>
        <Route path="/sign-up">
          <SignUp></SignUp>
        </Route>
        <Route path="/sign-in">
          <SignIn></SignIn>
        </Route>
        <Route path="/home">
          <Home></Home>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
