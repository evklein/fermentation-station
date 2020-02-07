import React, { FormEvent, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl, { FormControlProps } from 'react-bootstrap/FormControl';


const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const login = (event: object) => {
    console.log(event);
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) : void => {
    event.preventDefault();
    event.stopPropagation();
    
    // firebase.auth().createUserWithEmailAndPassword(email, password).then((result) => {
    //   console.log(result);
    // });
  }

  return (
    <div className="App">
      <header className="App-header">
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

        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
