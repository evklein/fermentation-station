import React, { FormEvent, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import firebase from 'firebase';
import { useDispatch } from 'react-redux';
import { signInUser } from '../actions/AuthActions';


const SignUp = () => {
    const [dispatch, setDispatch] = useState(useDispatch);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (event: FormEvent<HTMLFormElement>) : void => {
        event.preventDefault();
        event.stopPropagation();
        setError('');
        
        firebase.auth().signInWithEmailAndPassword(email, password).then((response) => {
            dispatch(signInUser(email, password));
        }, (error) => {
            setError(error.message);
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
                { error ? <Alert variant="danger">{ error }</Alert> : '' }
            </Form>
        </div>
    );

}

export default SignUp;