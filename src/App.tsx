import React, { FormEvent, useState } from 'react';
import './App.css';
import SignUp from './components/auth/SignUp';
import SignIn from './components/auth/SignIn';
import firebase from 'firebase';
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
import { deleteAll } from './redux/actions/ProjectActions';
import Recipes from './components/recipes/Recipes';
import { deleteAllRecipes } from './redux/actions/RecipeActions';
import { firebaseConfig } from './config';

const App = () => {
  const [dispatch, setDispatch] = useState(useDispatch);
  const [loggedIn, setLoggedIn] = useState(false);

  if (!firebase.apps.length) {
    firebase.initializeApp(FirebaseConfig);
  }

  store.subscribe(() => {
    setLoggedIn(store.getState().auth.isLoggedIn);
  });

  firebase.auth().onAuthStateChanged((user) => {
    localStorage.setItem("authUser", JSON.stringify(user));
  })

  const logout = () => {
    firebase.auth().signOut().then((response) => {
      dispatch(signOutUser(store.getState().auth.email));
      dispatch(deleteAll());
      dispatch(deleteAllRecipes());
      localStorage.removeItem("authUser");
      return <Redirect to="/sign-in"></Redirect>
    });
  }

  return (
    <Router>
      <Redirect to="/sign-in"></Redirect> {/* Redirect if at / */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand>
          <FontAwesomeIcon icon={faBug as IconProp}/>{' '}
          Fermentation Station
        </Navbar.Brand>
        { !loggedIn ? 
          <Nav>
            <Link className="text-secondary mx-2 text-decoration-none" to="/sign-up">Sign Up</Link>
            <Link className="text-secondary mx-2 text-decoration-none" to="/sign-in">Sign-In</Link>
          </Nav> :
          <Navbar.Collapse>
            <Nav>
              <Link className="text-secondary mx-2 text-decoration-none" to="/home">Projects</Link>
              <Link className="text-secondary mx-2 text-decoration-none" to="/recipes">Recipes</Link>
            </Nav>
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
        <Route path="/recipes">
          <Recipes></Recipes>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
