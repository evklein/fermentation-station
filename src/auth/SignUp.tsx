import React, { FormEvent, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import firebase from 'firebase';
import { useDispatch } from 'react-redux';
import { signUpUser, signInUser } from '../actions/AuthActions';
import { store } from '../index';


const SignUp = () => {
    const [dispatch, setDispatch] = useState(useDispatch);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event: FormEvent<HTMLFormElement>) : void => {
        event.preventDefault();
        event.stopPropagation();
        
        firebase.auth().createUserWithEmailAndPassword(email, password).then((response) => {
            dispatch(signUpUser(email, password));
            console.log("wHAAAT");
            console.log(store.getState());
            login();
        });
    }

    const login = () => {
        firebase.auth().signInWithEmailAndPassword(email, password).then((response) => {
            dispatch(signInUser(email, password));
            console.log("User logged in.");
            console.log(store.getState());
        });
    }

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" onChange={(event: React.FormEvent) => { setEmail((event.currentTarget as any).value )}} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter password" onChange={(event: React.FormEvent) => { setPassword((event.currentTarget as any).value )}} />
                </Form.Group>
                <Button type="submit">Log In</Button>
            </Form>
        </div>
    );

}

export default SignUp;