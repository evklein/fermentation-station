import React, { FormEvent, useState } from 'react';
import './App.css';
import SignUp from './components/auth/SignUp';
import SignIn from './components/auth/SignIn';
import firebase from 'firebase';
import { FirebaseConfig } from './config';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';
import Home from './components/home/Home';
import { faCoffee } from '@fortawesome/fontawesome-free-solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faBug } from '@fortawesome/free-solid-svg-icons';
import { store } from '.';
import { useDispatch } from 'react-redux';
import { signOutUser } from './redux/actions/AuthActions';

const App = () => {
  const [dispatch, setDispatch] = useState(useDispatch);
  const [loggedIn, setLoggedIn] = useState(false);

  if (!firebase.apps.length) {
    firebase.initializeApp(FirebaseConfig);
  }

  store.subscribe(() => {
    setLoggedIn(store.getState().auth.isLoggedIn);
  })

  const logout = () => {
    dispatch(signOutUser(store.getState().auth.email));
    return <Redirect to="/sign-in"></Redirect>
  }

  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand>
          <FontAwesomeIcon icon={faBug as IconProp}/>{' '}
          Fermentation Station
        </Navbar.Brand>
        { !loggedIn ? 
          <Nav>
            <Nav.Link href="/sign-up">Sign Up</Nav.Link>
            <Nav.Link href="/sign-in">Sign-In</Nav.Link>
          </Nav> :
          <Navbar.Collapse>
            <Nav className="ml-auto">
              <Nav.Link onClick={logout}>Log Out</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        }
      </Navbar>

      <Switch>
        <Route path="/sign-in">
          <SignIn></SignIn>
        </Route>
        <Route path="/sign-up">
          <SignUp></SignUp>
        </Route>
        <Route path="/home">
          <Home></Home>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
