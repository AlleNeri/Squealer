import React, { useState, useContext, useEffect } from 'react';
import './login.css';
import { LoginContext } from '../../context/LoginContext/LoginContext';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';

function Login() {
  const { setLoggedIn } = useContext(LoginContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedInState] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('loggedIn');
    if (isLoggedIn) {
      setLoggedInState(true);
      setLoggedIn(true);
    }
  }, [setLoggedIn]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch("http://localhost:8080/users/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password  
      }) 
    });

    const data = await response.json();

    if (data.success) {
      console.log("login success!");
      setLoggedInState(true);
      setLoggedIn(true);
      localStorage.setItem('loggedIn', true);
      console.log(data);
      const token = data.jwt.token;
      console.log("token al login:", token);
      localStorage.setItem('token', token);
      const user = data.id;
      localStorage.setItem('user', JSON.stringify(user));
      console.log("user al login:", user);
    } else {
      console.log("login failed!");
    }
  }
  const isDisabled = username.length === 0 || password.length === 0;
  return (
    <>
      {!loggedIn && 
      <Container maxWidth="sm" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', height: '100vh' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Effettua il login!
        </Typography>
        <form className='login-form' onSubmit={handleSubmit}>
          <TextField
            className="login-form-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />

          <TextField
            className="login-form-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <Button 
            className="login-button"
            type="submit"
            disabled={isDisabled}
            variant="contained" // This gives the button a solid background
            color="primary" // This makes the button blue
          >
            Login
          </Button>
        </form> 
      </Container>
      }  
    </>
  );
}

export default Login;