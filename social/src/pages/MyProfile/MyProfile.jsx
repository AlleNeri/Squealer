import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Avatar, Box } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

const MyProfile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const fileInput = useRef(null);
    const token = localStorage.getItem('token');

    const [anchorEl, setAnchorEl] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if(user && user.imgId){
            setUser(prevState => ({ ...prevState, img: `http://localhost:8080/media/image/${user.imgId}` }));
        }
    }, [user]);

    
    const handleChangeImage = () => {
        // Simula un click sull'input del file quando l'utente clicca su "Cambia immagine"
        fileInput.current.click();
    };

    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
        setAnchorEl(null);
    };

    const handleCloseDialog = () => {
    setOpenDialog(false);
    };

    const handleRemoveImage = () => {
        // Chiudi il menu
        setAnchorEl(null);
      
        // Rimuovi l'immagine dal server
        fetch(`http://localhost:8080/media/image/`, {
            method: 'DELETE',
            headers: {
                'Authorization': token,
            },
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            // Aggiorna lo stato dell'utente per riflettere il cambiamento
            fetch(`http://localhost:8080/users/${user._id}`, {
            method: 'PUT',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ img: null }),
            })
            .then(response => response.json())
            .then(data => {
                console.log('User updated:', data);
                // Aggiorna lo stato dell'utente con i nuovi dati
                setUser(prevState => ({ ...prevState, img: null }));
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        })
          
      };

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const formData = new FormData();
            formData.append('image', file);
          
            // Mostra un'immagine di caricamento o un segnaposto
            setUser(prevState => ({ ...prevState, img: 'loading-image-url' }));
          
            fetch('http://localhost:8080/media/image', {
                method: 'PUT',
                headers: {
                    'Authorization': token,
                },
                body: formData,
                })
                .then(response => response.json())
                .then(data => {
                console.log('Success:', data);
                // Aggiorna l'utente con l'ID dell'immagine
                fetch(`http://localhost:8080/users/${user._id}`, {
                    method: 'PUT',
                    headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ img: data.imgId }),
                })
                .then(response => response.json())
                .then(data => {
                    console.log('User updated:', data);
                    // Aggiorna lo stato dell'utente con l'ID dell'immagine
                    setUser(prevState => ({ ...prevState, imgId: data.imgId }));
                    // Aggiorna l'URL dell'immagine
                    setUser(prevState => ({ ...prevState, img: `http://localhost:8080/media/image/${data.imgId}` }));
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
                })
                .catch((error) => {
                console.error('Error:', error);
                });
        }
  };

  useEffect(() => {
    console.log('Token:', token); // Debug: stampa il token
  
    const userId = id;
    console.log('User ID:', userId); // Debug: stampa l'ID dell'utente
  
    fetch(`http://localhost:8080/users/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Data:', data); // Debug: stampa i dati
        setUser(data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, [id]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" flexDirection="row" alignItems="flex-start">
            <div>
            <Avatar 
                src={`http://localhost:8080/media/image/${user.img}`} 
                onClick={handleAvatarClick} 
                style={{ height: '100px', width: '100px' }} 
            />
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleOpenDialog}>Visualizza immagine</MenuItem>
                <MenuItem onClick={handleRemoveImage}>Rimuovi immagine</MenuItem>
                <MenuItem onClick={handleChangeImage}>Cambia immagine</MenuItem>
            </Menu>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogContent>
                <img src={`http://localhost:8080/media/image/${user.img}`} alt="User" style={{ width: '100%', height: 'auto' }} />
            </DialogContent>
            </Dialog>
            <input type="file" ref={fileInput} style={{ display: 'none' }} onChange={handleFileChange} />
            </div>
            <Box display="flex" flexDirection="column">
            <Box display="flex" alignItems="center">
                <Typography variant="subtitle1" component="span" style={{ fontWeight: 'bold' }}>
                Username:
                </Typography>
                <Typography variant="body2" component="span" style={{ marginLeft: '8px' }}>
                {user.u_name}
                </Typography>
            </Box>
            <Box display="flex" alignItems="center">
                <Typography variant="subtitle1" component="span" style={{ fontWeight: 'bold' }}>
                    First name:
                </Typography>
                <Typography variant="body2" component="span" style={{ marginLeft: '8px' }}>
                    {user.name.first}
                </Typography>
            </Box>
            <Box display="flex" alignItems="center">
                <Typography variant="subtitle1" component="span" style={{ fontWeight: 'bold' }}>
                    Last name:
                </Typography>
                <Typography variant="body2" component="span" style={{ marginLeft: '8px' }}>
                    {user.name.last}
                </Typography>
            </Box>
            <Box display="flex" alignItems="center">
                <Typography variant="subtitle1" component="span" style={{ fontWeight: 'bold' }}>
                    E-mail Address:
                </Typography>
                <Typography variant="body2" component="span" style={{ marginLeft: '8px' }}>
                    {user.email}
                </Typography>
            </Box>
            <Box display="flex" alignItems="center">
                <Typography variant="subtitle1" component="span" style={{ fontWeight: 'bold' }}>
                    Type:
                </Typography>
                <Typography variant="body2" component="span" style={{ marginLeft: '8px' }}>
                    {user.type}
                </Typography>
            </Box>
            <Box display="flex" alignItems="center">
                <Typography variant="subtitle1" component="span" style={{ fontWeight: 'bold' }}>
                    Creation date:
                </Typography>
                <Typography variant="body2" component="span" style={{ marginLeft: '8px' }}>
                    {new Date(user.creation_date).toLocaleDateString()}
                </Typography>
                </Box>
            <Box display="flex" alignItems="center">
                <Typography variant="subtitle1" component="span" style={{ fontWeight: 'bold' }}>
                    Message popularity:
                </Typography>
                <Typography variant="body2" component="span" style={{ marginLeft: '8px', color: 'green' }}>
                    {user.messagePopularity.positive}
                </Typography>
                <Typography variant="body2" component="span">
                    /
                </Typography>
                <Typography variant="body2" component="span" style={{ color: 'red' }}>
                    {user.messagePopularity.negative}
                </Typography>
                </Box>
            </Box>
        </Box>
        </CardContent>
    </Card>
  );
};

export default MyProfile;