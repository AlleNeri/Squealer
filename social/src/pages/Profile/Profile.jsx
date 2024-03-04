import React, { useEffect, useState, useRef, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, Typography, Avatar, Menu, MenuItem, Grid, Dialog, DialogContent, 
  DialogTitle, DialogActions, Button, TextField, Select, Table, TableHead, TableBody, 
  TableCell, TableRow, Divider} from '@material-ui/core';
import CakeIcon from '@mui/icons-material/Cake';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { PostsContext } from '../../context/PostsContext/PostsContext';
import { LoginContext } from '../../context/LoginContext/LoginContext';
import { SearchContext } from '../../context/SearchContext/SearchContext';
import { UserPostsContext } from '../../context/UserPostsContext/UserPostsContext';
import MyPosts from '../MyPosts/MyPosts';
import Post from '../../components/Post/Post';
import './profile.css';

const Profile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [open, setOpen] = useState(false);
    const fileInput = useRef(null);
    const token = localStorage.getItem('token');
    const { posts, setPosts } = useContext(PostsContext);
    const { isSearching } = useContext(SearchContext);
    const {loggedIn} = useContext(LoginContext);
    const { userPosts, setUserPosts } = useContext(UserPostsContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [image, setImage] = useState(null);
    const [period, setPeriod] = useState('day');
    const [channels, setChannels] = useState({});
    let [quantity, setQuantity] = useState(0);
    const [purchased, setPurchased] = useState(false);
    const currentUserId = localStorage.getItem('userId');

    const navigate = useNavigate();

    useEffect(() => {
        if (image) {
          setUser(prevState => ({ ...prevState, img: `${import.meta.env.VITE_DEFAULT_URL}/media/image/${image}` }));
        }
      }, [image, purchased, token]);
    
    useEffect(() => {
      if(isSearching) return;
      Promise.all(userPosts.map(post => 
        fetch(`${import.meta.env.VITE_DEFAULT_URL}/channels/${post.posted_on}`)
          .then(response => response.json())
      ))
      .then(data => {
        const channelsObj = data.reduce((obj, item, index) => {
          obj[userPosts[index]._id] = item;
          return obj;
        }, {});
        setChannels(channelsObj);
      })
      .catch(error => console.error('Error:', error));
    }, [userPosts, isSearching, token]);

    useEffect(() => {
      if (isSearching) return;
        if (id !== currentUserId) {
          const fetchUserPosts = async () => {
            const response = await fetch(`${import.meta.env.VITE_DEFAULT_URL}/posts?of=${id}`, {
              headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
              },
            });
            const data = await response.json();
            if (Array.isArray(data)) {
              setUserPosts(data);
            } else {
              console.error('Expected data to be an array but received', data);
            }
          };
    
          fetchUserPosts();
        }
    }, [isSearching, token]);

    useEffect(() => {
        if(isSearching) return;
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
          })
          .catch((error) => {
            console.error('Error:', error);
            navigate('/login');
          });
        } 
    }, [posts.length, isSearching, token]);

    const handleChangeImage = () => {
        // Simula un click sull'input del file quando l'utente clicca su "Cambia immagine"
        fileInput.current.click();
    };

    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setOpen(false);
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
            setImage(file);
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
    const userId = id;
  
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
        setUser(data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, [id, token, purchased]);

  if (!user) {
    return <div>Loading...</div>;
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  const handleSubmit = async () => {
    quantity = parseInt(quantity);
    const body =  JSON.stringify({ period, quantity });
    const response = await fetch(`${import.meta.env.VITE_DEFAULT_URL}/users/${currentUserId}/char`, {
      method: 'PATCH',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      body: body,
    });

    if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
      const data = await response.json();
      handleClose();
      setPurchased(!purchased);
    } 
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <>
    <Card style={{ backgroundColor: '#f5f5f5', width:'100%', marginTop:'20px' }}>
    <CardContent>
      <Grid container spacing={2}>
        <Grid item xs={12} align="center">
          <Avatar 
            src={user.img ? `${import.meta.env.VITE_DEFAULT_URL}/media/image/${user.img}` : undefined}
            onClick={handleAvatarClick} 
            style={{ height: '200px', width: '200px' }}
          >
            {user.img ? undefined : 
            <Typography variant="h1">
              {user.u_name.charAt(0).toUpperCase()}
            </Typography>}
          </Avatar>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleOpenDialog}>Visualizza immagine</MenuItem>
                {id === currentUserId && (
                  [
                    <MenuItem key="remove" onClick={handleRemoveImage}>Rimuovi immagine</MenuItem>,
                    <MenuItem key="change" onClick={handleChangeImage}>Cambia immagine</MenuItem>
                  ]
                )}
            </Menu>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogContent>
                    <img src={`${import.meta.env.VITE_DEFAULT_URL}/media/image/${user.img}`} alt="User" className="dialog-image" />
                </DialogContent>
            </Dialog>
            <input type="file" ref={fileInput} className="hidden-file-input" onChange={handleFileChange} />
            </Grid>
        <Grid item xs={12} align="left">
          <Typography variant="h6">
            {capitalizeFirstLetter(user.name.first)} {capitalizeFirstLetter(user.name.last)}
          </Typography>
        </Grid>
        <Grid item xs={12} align="left">
          <Typography variant="subtitle1">
            @{user.u_name}
          </Typography>
        </Grid>
        <Grid item xs={12} align="left">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CakeIcon />
            <Typography variant="body2" style={{ marginLeft: '8px' }}>
              Birthday:{new Date(user.b_date).toLocaleDateString()}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} align="left">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CalendarMonthIcon />
            <Typography variant="body2" style={{ marginLeft: '8px' }}>
              Registration date:{new Date(user.creation_date).toLocaleDateString()}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} align="center">
        </Grid>
        {id === currentUserId && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center"><strong>Daily</strong></TableCell>
                <TableCell align="center"><strong>Weekly</strong></TableCell>
                <TableCell align="center"><strong>Monthly</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="center">{user && user.quote && user.char_availability.dayly || 0}</TableCell>
                <TableCell align="center">{user && user.quote && user.char_availability.weekly || 0}</TableCell>
                <TableCell align="center">{user && user.quote && user.char_availability.monthly || 0}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}

        {id === currentUserId && (
          <Grid item xs={12} sm={4}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={handleClickOpen} fullWidth startIcon={<AttachMoneyIcon />} color="primary" style={{ marginTop: '20px' }}>
                Buy Chars
              </Button>
              {user.type === 'vip' && id === currentUserId && (
                <Button fullWidth startIcon={<EngineeringIcon />} color="primary" style={{ marginTop: '20px' }} onClick={() => navigate('/Smm')}>
                  Find Social Media Manager
                </Button>
              )}
            </div>
          </Grid>
        )}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Buy Chars</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} alignItems="center" justifyContent="center">
              <Grid item xs={12} sm={4}>
                <Select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="day">Day</MenuItem>
                  <MenuItem value="week">Week</MenuItem>
                  <MenuItem value="month">Month</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity((e.target.value))}
                  fullWidth
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="contained" color="secondary">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              style={{ backgroundColor: 'green', color: 'white' }}
            >
              Buy
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
      
      </CardContent>
    </Card>

    {loggedIn && 
      <div>
        <Typography variant="h4" component="h6" gutterBottom style={{ textAlign: 'center', marginTop:'20px' }}>
            {user.u_name.toUpperCase()}'s POSTS
        </Typography>
        <Divider style={{ backgroundColor: 'black', width: '30%', margin: '0 auto' }} />
      </div>
    }

    {!loggedIn &&
      <Typography variant="body1" style={{ marginTop: '50px', textAlign: 'center' }}>
        Per vedere i post di questo utente, per favore <Link to="/login">accedi</Link> o <Link to="/register">registrati</Link>.
      </Typography>     
    }

    {id === currentUserId ? (
        <MyPosts/>
    ) : (
        userPosts
        .filter(post => channels[post._id] && !channels[post._id].name.startsWith('__direct__'))
        .map(post => (
          <Post key={post._id} post={post} />
        ))
    )}
    </>

  );
};

export default Profile;