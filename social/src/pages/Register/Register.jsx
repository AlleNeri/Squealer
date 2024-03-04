import React, { useState, useContext } from 'react';
import "./register.css";
import { LoginContext } from '../../context/LoginContext/LoginContext';
import {TextField, Button, Container, Typography, Box, InputLabel, Select, MenuItem, Snackbar, IconButton} from '@material-ui/core';
import ClearIcon from '@mui/icons-material/Clear';
import { Alert } from '@mui/material';
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
    img: '',
    u_name: ''
  });

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [uploadComplete, setUploadComplete] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(''); 
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const { setLoggedIn, setJustRegistered } = useContext(LoginContext);

  const  navigate = useNavigate();

  const isEmailValid = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };
  
  const handleEmailChange = (event) => {
    const email = event.target.value;
    setUser(prevState => ({ ...prevState, email: email }));
  };

  const isPasswordValid = (password) => {
    // La password deve avere almeno 8 caratteri, una lettera maiuscola, una lettera minuscola e un numero
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return regex.test(password);
  };
  
  const isAdult = (b_date) => {
    const birthDate = new Date(b_date);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 18;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEmailValid(user.email)) {
      setAlertMessage('Please enter a valid email address');
      setShowAlert(true);
      return;
    }
    
    if (password !== confirmPassword) {
      setAlertMessage('Passwords do not match');
      setShowAlert(true);
      return;
    }

    if (!isPasswordValid(password)) {
      setAlertMessage('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
      setShowAlert(true);
      return;
    }
  
    if (!isAdult(user.b_date)) {
      setAlertMessage('You must be at least 18 years old to register and write a valid date');
      setShowAlert(true);
      return;
    }

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

    if (!response.ok) {
      const responseBody = await response.json();
      setAlertMessage( 'An error occurred while registering. Make sure you have written your name and surname, and that your username and email do not already exist');
      setShowAlert(true);
      return;
    }

    const data = await response.json();

    if(data.success) {
      localStorage.setItem('token', data.jwt.token);
      localStorage.setItem('userId', data.id);
      setJustRegistered(true);
      setLoggedIn(true);
      handleImageUpload(imageFile);
      navigate('/Homepage');
    }

  }

  const handleImageSelection = (event) => {
    setImageFile(event.target.files[0]);
    setUploadComplete(true);
  
    // Crea un URL di anteprima per il file selezionato
    setPreview(URL.createObjectURL(event.target.files[0]));
  }

  const handleClearImage = () => {
    // Annulla l'URL di anteprima
    URL.revokeObjectURL(preview);
  
    // Reimposta lo stato dell'immagine e della preview
    setImageFile(null);
    setPreview(null);
    setUploadComplete(false);
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
      // Update the user state with the returned image URL
      setUser(prevState => ({ ...prevState, img: data.url }));
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }


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
            style={{ marginTop: '10px' }}
          />
        
          <TextField
            className='register-Form-Input'
            label="First Name"
            value={user.name.first}
            onChange={(e) => setUser({ ...user, name: { ...user.name, first: e.target.value } })}
            fullWidth
            style={{ marginTop: '10px' }}
          />
        
          <TextField
            className='register-Form-Input'
            label="Last Name"
            value={user.name.last}
            onChange={(e) => setUser({ ...user, name: { ...user.name, last: e.target.value } })}
            fullWidth
            style={{ marginTop: '10px' }}
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
            style={{ marginTop: '10px' }}
          />

          <TextField
            className='register-Form-Input'
            label="Email"
            value={user.email}
            onChange={handleEmailChange}
            fullWidth
            style={{ marginTop: '10px' }}
          />
        
          <TextField
            className='register-Form-Input'
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            style={{ marginTop: '10px' }}
          />
          
          <TextField
            className='register-Form-Input'
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            style={{ marginTop: '10px' }}
          />

          <InputLabel style={{marginTop:'10px'}}>Type</InputLabel>
          <Select
            value={user.type}
            onChange={(e) => setUser({ ...user, type: e.target.value })}
            fullWidth
            style={{ marginTop: '10px' }}
          >
            <MenuItem value={'normal'}>Normal</MenuItem>
            <MenuItem value={'vip'}>VIP</MenuItem>
          </Select>

          <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
            <Button
              component="label"
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: '10px' }}
            >
              Upload profile image
              <input
                type="file"
                hidden
                onChange={handleImageSelection}
                style={{ marginTop: '10px' }}
              />
            </Button>
          </Box>

          {preview && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div>
                <img src={preview} alt="preview" style={{maxHeight:"200px", width:"50%", objectFit:'cover'}}/>
              </div>
              <IconButton style={{ color: 'red' }} onClick={handleClearImage}>
                <ClearIcon />
              </IconButton>
            </div>
          )}

          <Button 
            className="register-button"
            type="submit"
            variant="contained" // This gives the button a solid background
            color="primary" // This makes the button blue
            fullWidth // This makes the button take up the full width of the container
            style={{ marginTop: '10px' }} // This adds some space above the button
          >
            Register
          </Button>
        
    </form>
          {showAlert && (
                <Snackbar open={showAlert} onClose={() => setShowAlert(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
                  <Alert onClose={() => setShowAlert(false)} severity="error">
                    {alertMessage}
                  </Alert>
                </Snackbar>
          )}
    </Container>
  );

}

export default Register;
