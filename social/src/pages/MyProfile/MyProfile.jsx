import React, { useEffect, useState, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Avatar, Box, Menu, MenuItem, Dialog, DialogContent, Button } from '@material-ui/core';
import { PostsContext } from '../../context/PostsContext/PostsContext';
import { LoginContext } from '../../context/LoginContext/LoginContext';
import MyPosts from '../MyPosts/MyPosts';
import './myProfile.css';

const MyProfile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const fileInput = useRef(null);
    const token = localStorage.getItem('token');
    const { posts, setPosts } = useContext(PostsContext);
    const {loggedIn} = useContext(LoginContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if(user && user.imgId){
            setUser(prevState => ({ ...prevState, img: `${import.meta.env.VITE_DEFAULT_URL}/media/image/${user.imgId}` }));
        }
    }, [user]);

    useEffect(() => {
        if (token) {
          fetch(`${import.meta.env.VITE_DEFAULT_URL}/posts/my`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token,
            },
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Not logged in');
            }
            return response.json();
          })
          .then(data => {
            setPosts(data);
            console.log(data);
          })
          .catch((error) => {
            console.error('Error:', error);
            navigate('/login');
          });
        } else {
          navigate('/login');
        }
    }, [loggedIn, posts._id]);

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
        fetch(`${import.meta.env.VITE_DEFAULT_URL}/media/image/`, {
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
            fetch(`${import.meta.env.VITE_DEFAULT_URL}/users/${user._id}`, {
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
                // Aggiorna l'utente con l'ID dell'immagine
                fetch(`${import.meta.env.VITE_DEFAULT_URL}/users/${user._id}`, {
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
                    setUser(prevState => ({ ...prevState, img: `${import.meta.env.VITE_DEFAULT_URL}/media/image/${data.imgId}` }));
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
  
    fetch(`${import.meta.env.VITE_DEFAULT_URL}/users/${userId}`, {
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

  useEffect(() => {
    console.log(posts);
    }, [posts]);
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>

    <Card style={{ backgroundColor: '#f5f5f5', width:'100%' }}>
      <CardContent>
        <Box display="flex" flexDirection="row" alignItems="center">
            <div>
            <Avatar 
                src={`${import.meta.env.VITE_DEFAULT_URL}/media/image/${user.img}`} 
                onClick={handleAvatarClick} 
                style={{ height: '200px', width: '200px' }} 
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
                    <img src={`${import.meta.env.VITE_DEFAULT_URL}/media/image/${user.img}`} alt="User" className="dialog-image" />
                </DialogContent>
            </Dialog>
            <input type="file" ref={fileInput} className="hidden-file-input" onChange={handleFileChange} />
            </div>

            <Box display="flex" flexDirection="column" ml={10}>
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
                    Birth date:
                </Typography>
                <Typography variant="body2" component="span" style={{ marginLeft: '8px' }}>
                    {new Date(user.b_date).toLocaleDateString()}
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
                    {user && user.messagePopularity && user.messagePopularity.positive || 0}
                </Typography>
                <Typography variant="body2" component="span">
                /
                </Typography>
                <Typography variant="body2" component="span" style={{ color: 'red' }}>
                    {user && user.messagePopularity && user.messagePopularity.negative || 0}
                </Typography>
            </Box>
            <Box display="flex" alignItems="center">
                <Typography variant="subtitle1" component="span" style={{ fontWeight: 'bold' }}>
                    Daily quote:
                </Typography>
                <Typography variant="body2" component="span" style={{ marginLeft: '8px' }}>
                    {user && user.quote && user.quote.dayly || 0}
                </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                    <Typography variant="subtitle1" component="span" style={{ fontWeight: 'bold' }}>
                        Weekly quote:
                    </Typography>
                    <Typography variant="body2" component="span" style={{ marginLeft: '8px' }}>
                        {user && user.quote && user.quote.weekly || 0}
                    </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                    <Typography variant="subtitle1" component="span" style={{ fontWeight: 'bold' }}>
                        Monthly quote:
                    </Typography>
                    <Typography variant="body2" component="span" style={{ marginLeft: '8px' }}>
                        {user && user.quote && user.quote.monthly || 0}
                    </Typography>
            </Box>
          </Box>
          {user.type === 'vip' && (
            <Box ml={20}>
              <Button variant="contained" color="primary" onClick={() => navigate('/Smm')}>
                Trova SMM
              </Button>
            </Box>
        )}
        </Box>
        </CardContent>
    </Card>

    

    <Typography variant="h4" component="h6" gutterBottom style={{ textAlign: 'center', marginTop:'20px' }}>
        POST PUBBLICATI DA {user.u_name.toUpperCase()}
    </Typography>
    <MyPosts/>
    </>

  );
};

export default MyProfile;