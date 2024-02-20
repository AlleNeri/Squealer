import React, { useState, useContext, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import './login.css';
import { LoginContext } from '../../context/LoginContext/LoginContext';
import Alert from '@mui/material/Alert';
import { Typography, Button, Container, TextField } from '@material-ui/core';

function Login() {
  const { loggedIn, setLoggedIn, justRegistered, setJustRegistered } = useContext(LoginContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoggedIn(true);
    }
  }, [setLoggedIn]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch(`${import.meta.env.VITE_DEFAULT_URL}/users/login`, {
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
      const token = data.jwt.token;

      localStorage.setItem('userId', data.id);
      localStorage.setItem('username', username);
      localStorage.setItem('token', token);
      setLoggedIn(true);
      
      navigate('/HomePage');
    }else {
      setAlertMessage(data.msg);
      setOpen(true);
    }
  }

  const isDisabled = username.length === 0 || password.length === 0;
  return (
    <>
      {!loggedIn && 
        <Container maxWidth="sm" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', height: '100vh',marginTop: '70px' }}>
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
          {open && (
            <Alert severity="error" onClose={() => setOpen(false)}>
              {alertMessage}
            </Alert>
          )}
        </Container>
      }
    </>
  );
}

export default Login;