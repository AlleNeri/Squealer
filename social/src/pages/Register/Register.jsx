import React, { useState, useEffect } from 'react';
import "./register.css";
import { useNavigate } from 'react-router-dom';
import {TextField, Button, Container, Typography} from '@material-ui/core';
function Register() {
  const navigate = useNavigate(); // Initialize navigate

  const [user, setUser] = useState({
    u_name: '',
    name: {
        first: '',
        last: ''
    },
    email: '',
    type: 'normal'
  });

  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8080/users/register', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user,
        password
      })
    });

    console.log(user);
    const data = await response.json();
    console.log(data);

    if(data.success) {
      console.log('Registration successful!');
    } else {
      console.log('Registration failed!'); 
    }
  }
  const isDisabled = user.u_name.length === 0 || user.email.length === 0 ||user.name.first.length === 0 || 
  user.name.last.length === 0 || user.u_name.length === 0 || password.length === 0;
  
  useEffect(() => {
    // Prevent scrolling when component mounts
    document.body.style.overflow = 'hidden';

    // Allow scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <Container maxWidth="sm" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', height: '100vh', marginTop:'70px' }}>
    <Typography variant="h4" align="center" gutterBottom>
      Create a new account!
    </Typography>
    <form className='register-Form' onSubmit={handleSubmit}>
      
          <TextField
            className='register-Form-Input'
            label="Username"
            value={user.u_name}
            onChange={(e) => setUser({ ...user, u_name: e.target.value })}
            fullWidth
          />
        
          <TextField
            className='register-Form-Input'
            label="First Name"
            value={user.name.first}
            onChange={(e) => setUser({ ...user, name: { ...user.name, first: e.target.value } })}
            fullWidth
          />
        
          <TextField
            className='register-Form-Input'
            label="Last Name"
            value={user.name.last}
            onChange={(e) => setUser({ ...user, name: { ...user.name, last: e.target.value } })}
            fullWidth
          />
        
          <TextField
            className='register-Form-Input'
            label="Email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            fullWidth
          />
        
          <TextField
            className='register-Form-Input'
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
        
          <Button 
            className="register-button"
            type="submit"
            disabled={isDisabled}
            variant="contained" // This gives the button a solid background
            color="primary" // This makes the button blue
          >
            Register
          </Button>
        
    </form>
    </Container>
  );

}

export default Register;
