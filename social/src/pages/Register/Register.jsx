import React, { useState, useEffect } from 'react';
import "./register.css";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {TextField, Button, Container, Typography, Box, FormControl, InputLabel, Select, MenuItem} from '@material-ui/core';
import {green} from '@material-ui/core/colors/';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [user, setUser] = useState({
    name: {
      first: '',
      last: ''
    },
    email: '',
    type: 'normal',
    b_date: '', 
    img: '' 
  });

  const [password, setPassword] = useState('');
  const [uploadComplete, setUploadComplete] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');

  const  navigate = useNavigate();

  const isEmailValid = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };
  
  const handleEmailChange = (event) => {
    const email = event.target.value;
    setUser(prevState => ({ ...prevState, email: email }));
  
    if (!isEmailValid(email)) {
      setError('Please enter a valid email address');
    } else {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`${import.meta.env.VITE_DEFAULT_URL}/users/register`, {
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
      localStorage.setItem('token', data.jwt.token);
      handleImageUpload(imageFile);
    } else {
      console.log('Registration failed!'); 
    }
  }

  const handleImageSelection = (event) => {
    setImageFile(event.target.files[0]);
    setUploadComplete(true);
  }

  const handleImageUpload = (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const token = localStorage.getItem('token');

    // Show a loading image or placeholder
    setUser(prevState => ({ ...prevState, img: 'loading-image-url' }));
  
    fetch(`${import.meta.env.VITE_DEFAULT_URL}/media/image`, {
      method: 'PUT',
      headers: {
        'Authorization': token,
      },
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      // Update the user state with the returned image URL
      setUser(prevState => ({ ...prevState, img: data.url }));
      localStorage.removeItem('token');
      navigate('/login');
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  const isDisabled = !isEmailValid(user.email) || user.u_name?.length === 0 || user.email?.length === 0 ||user.name.first?.length === 0 || 
  user.name?.last.length === 0 || user.u_name?.length === 0 || password?.length === 0;
  
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
      Unisciti a noi!
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
            label="Birth Date"
            type="date"
            value={user.b_date}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setUser({ ...user, b_date: e.target.value })}
            fullWidth
          />

          <TextField
            className='register-Form-Input'
            label="Email"
            value={user.email}
            onChange={handleEmailChange}
            fullWidth
          />

          {error && <p style={{ color: 'red' }}>{error}</p>}
        
          <TextField
            className='register-Form-Input'
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />

          <InputLabel>Type</InputLabel>
          <Select
            value={user.type}
            onChange={(e) => setUser({ ...user, type: e.target.value })}
            fullWidth
          >
            <MenuItem value={'normal'}>Normal</MenuItem>
            <MenuItem value={'vip'}>VIP</MenuItem>
            <MenuItem value={'smm'}>Smm</MenuItem>
          </Select>

          <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
            <Button
              component="label"
            >
              Upload profile image
              <input
                type="file"
                hidden
                onChange={handleImageSelection}
              />
            </Button>
            {uploadComplete && <CheckCircleIcon style={{ color: green[500] }} />}
          </Box>

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
