import React, { FormEvent, useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import firebase from 'firebase';
import { useDispatch } from 'react-redux';
import { signUpUser, signInUser } from '../../redux/actions/AuthActions';
import { Redirect } from 'react-router-dom';
import { Container } from 'react-bootstrap';


const SignUp = () => {
    const [dispatch, setDispatch] = useState(useDispatch);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        checkIfAlreadyLoggedIn();
    }, []);

    const checkIfAlreadyLoggedIn = () => {
        const authUser = JSON.parse(localStorage.getItem("authUser") as string);
        if (authUser) {
            dispatch(signInUser(authUser.email, ''));
            setRedirect(true);
        }
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) : void => {
        event.preventDefault();
        event.stopPropagation();
        setError('');
        
        if (checkPasswords()) {
            firebase.auth().createUserWithEmailAndPassword(email, password).then((response) => {
                dispatch(signUpUser(email, password));
                login();
            }, (error) => {
                setError(error.message);
            });
        }
    }

    const login = () => {
        firebase.auth().signInWithEmailAndPassword(email, password).then((response) => {
            dispatch(signInUser(email, password));
            setRedirect(true);
        });
    }

    const checkPasswords = (): boolean => {
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return false;
        }
        
        return true;
    }

    return (
        <Container className="mt-2">
            { redirect ? <Redirect to="/home"></Redirect> : '' }
            <h4>Sign Up</h4>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" onChange={(event: React.FormEvent) => { setEmail((event.currentTarget as any).value )}} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter password" onChange={(event: React.FormEvent) => { setPassword((event.currentTarget as any).value )}} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" placeholder="Confirm Password" onChange={(event: React.FormEvent) => { setConfirmPassword((event.currentTarget as any).value )}} />
                </Form.Group>
                <Button type="submit">Sign Up</Button>
                { error ? <Alert className="mt-2" variant="danger">{ error }</Alert> : '' }
            </Form>
        </Container>
    );

}

export default SignUp;