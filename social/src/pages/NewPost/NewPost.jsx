import React, { useState, useContext, useEffect, useRef } from 'react';
import { LoginContext } from '../../context/LoginContext/LoginContext';
import { PostsContext } from '../../context/PostsContext/PostsContext';
import { TimeContext } from '../../context/TimeContext/TimeContext';
import Channel from '../../components/Channel/Channel';
import { TextField, Button, InputLabel, FormControl, MenuItem, Select, Box, Link, 
    Typography, Avatar, Checkbox, FormControlLabel, Chip, InputAdornment,
    Container, Grid, Paper, Table, TableBody, TableCell, TableRow, Divider, IconButton } from '@material-ui/core';
import { Autocomplete } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ClearIcon from '@mui/icons-material/Clear';
import FaceIcon from '@material-ui/icons/Face';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Alert } from '@mui/material';
import { MentionsInput, Mention } from 'react-mentions';
import './newPost.css';
import { useNavigate } from 'react-router-dom';

function NewPost() {
  const { loggedIn } = useContext(LoginContext);
  const [charAvailability, setCharAvailability] = useState({ dayly: 0, weekly: 0, monthly: 0 });
  const [initialCharAvailability, setInitialCharAvailability] = useState({ dayly: 0, weekly: 0, monthly: 0 });
  const { updateInterval, setUpdateInterval, updateTimes, setUpdateTimes } = useContext(TimeContext);
  const [open, setOpen] = useState(false);
  const [isTimed, setIsTimed] = useState(false);
  const [subject, setSubject] = useState('');
  const [postText, setPostText] = useState('');
  const [users, setUsers] = useState([]);
  const [image, setImage] = useState('');
  const [preview, setPreview] = useState(null);
  const [position, setPosition] = useState(undefined);
  const [hasPosition, setHasPosition] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [contentType, setcontentType] = useState('geolocation'); // ['text', 'image', 'geo']
  const [postType, setPostType] = useState('normal');
  const [directRecipient, setDirectRecipient] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [channel, setChannel] = useState(''); // New state variable for the selected channel
  const [myChannels, setMyChannels] = useState([]); // New state variable for the user's channels
  const { posts, setPosts } = useContext(PostsContext);
  const [lessChar, setLessChar] = useState(0);
  const [alert, setAlert] = useState({ open: false, message: '', severity: '' });
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const addedChannel = localStorage.getItem('addedChannel');
  const navigate = useNavigate();

  useEffect(() => {
    // Quando il componente viene montato, leggi lo stato da localStorage
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      localStorage.setItem('token', savedToken);
    }
  }, []);

  useEffect(() => {
    // Ogni volta che lo stato cambia, salvalo in localStorage
    localStorage.setItem('token', token);
  }, [token, loggedIn]);

  useEffect(() => {
    setIsFormValid(subject !== '' && (postText !== '' || image !== null || position ) && keywords !== '');
  }, [subject, postText, image, position, keywords]);

  useEffect(() => {
    const options = {
      headers: {
        'Authorization': token
      }
    };

    fetch(`${import.meta.env.VITE_DEFAULT_URL}/users/${localStorage.getItem('userId')}`, options)
      .then(response => response.json())
      .then(data => {
        setCharAvailability(data?.char_availability);
        setInitialCharAvailability(data?.char_availability);
      })
      .catch(error => {
        console.error('Error fetching user data', error);
      });
  }, []);

  useEffect(() => {
    // This function runs whenever contentType changes
    setImage(null);
    setPostText('');
    setPosition(null);
  }, [contentType]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_DEFAULT_URL}/users/mention`, {
      headers: {
        'Authorization': token,
      },
    })
      .then(response => response.json())
      .then(data => {
        const filteredData = data.filter(user => user.id !== localStorage.getItem('userId'));
        setUsers(filteredData);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  useEffect(() => {
    if (loggedIn) {
      const fetchMyChannels = async () => {
        const response = await fetch(`${import.meta.env.VITE_DEFAULT_URL}/channels/my`, {
          method: 'GET',
          headers: {
            'Authorization': token,
          },
        });

        if (!response.ok) {
          console.error('Error fetching my channels');
          return;
        }

        const channels = await response.json();
        setMyChannels(channels);
      };

      fetchMyChannels();
    }
  }, [loggedIn, token, addedChannel]);

  const handlePostTypeChange = (event) => {
    setPostType(event.target.value);
  };

  const handleClearImage = () => {
    setCharAvailability(prevState => ({
      ...prevState,
      dayly: prevState?.dayly + lessChar,
      weekly: prevState?.weekly + lessChar,
      monthly: prevState?.monthly + lessChar,
    }));

    setLessChar(0);
    setImage(null);
  };

  const handlePostTextChange = event => {
    const newPostText = event.target.value;
    if(postType === 'normal'){
      const diff = postText.length - newPostText.length;
      if (diff > 0 && charAvailability?.dayly < initialCharAvailability?.dayly) {
        setCharAvailability(prevState => ({
          ...prevState,
          dayly: prevState?.dayly + diff,
          weekly: prevState?.weekly + diff,
          monthly: prevState?.monthly + diff,
        }));
      } else if (diff < 0 && charAvailability?.dayly > 0 && charAvailability?.weekly > 0 && charAvailability?.monthly > 0) {
        setCharAvailability(prevState => ({
          ...prevState,
          dayly: prevState?.dayly + diff, // diff is negative, so this decreases dayly
          weekly: prevState?.weekly + diff, // diff is negative, so this decreases weekly
          monthly: prevState?.monthly + diff, // diff is negative, so this decreases monthly
        }));
      }else{
        setAlert('You have reached your daily, weekly, or monthly character limit');
        return;
      }
      setLessChar(newPostText.length);
    }
    setPostText(newPostText);
  };

  const handleSubjectChange = event => {
    const newSubject = event.target.value;
      if(postType === 'normal'){
      const diff = subject.length - newSubject.length;
      if (diff > 0 && charAvailability?.dayly < initialCharAvailability?.dayly) {
        setCharAvailability(prevState => ({
          ...prevState,
          dayly: prevState?.dayly + diff,
          weekly: prevState?.weekly + diff,
          monthly: prevState?.monthly + diff,
        }));
      } else if (diff < 0 && charAvailability?.dayly > 0 && charAvailability?.weekly > 0 && charAvailability?.monthly > 0) {
        setCharAvailability(prevState => ({
          ...prevState,
          dayly: prevState?.dayly + diff, // diff is negative, so this decreases dayly
          weekly: prevState?.weekly + diff, // diff is negative, so this decreases weekly
          monthly: prevState?.monthly + diff, // diff is negative, so this decreases monthly
        }));
      }else{
        setAlert('You have reached your daily, weekly, or monthly character limit');
        return;
      }
    }
    setSubject(newSubject);
  };

  const handleAddKeyword = () => {
    if (inputValue && !keywords.includes(inputValue)) {
      if (postType === 'normal') {
        // Subtract the length from the character availability
        setCharAvailability(prevAvailability => ({
          dayly: prevAvailability.dayly - (inputValue.length),
          weekly: prevAvailability.weekly - (inputValue.length),
          monthly: prevAvailability.monthly - inputValue.length,
        }));
      }

      setKeywords([...keywords, inputValue]);
      setInputValue('');
    }

    
  };

  const handleDeleteKeyword = (keywordToDelete) => () => {
    if (postType === 'normal') {
      // Add the length back to the character availability
      setCharAvailability(prevAvailability => ({
        dayly: prevAvailability.dayly + keywordToDelete.length,
        weekly: prevAvailability.weekly + keywordToDelete.length,
        monthly: prevAvailability.monthly + keywordToDelete.length,
      }));
    }
    setKeywords(keywords.filter((keyword) => keyword !== keywordToDelete));
  };

  const handlecontentTypeChange = (event) => {
    if(lessChar > 0){
      setCharAvailability(prevState => ({
        ...prevState,
        dayly: prevState?.dayly + lessChar,
        weekly: prevState?.weekly + lessChar,
        monthly: prevState?.monthly + lessChar,
      }));

      setLessChar(0);
    }
    setcontentType(event.target.value);
  };

  const handlePositionChange = () => {
    if(contentType==='geolocation'){
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Update character availability only if it's the first time getting the position
          if(postType === 'normal' && !hasPosition){
            if (charAvailability?.dayly - 125 < 0 || charAvailability?.weekly - 125 < 0 || charAvailability?.monthly - 125 < 0) {
              setAlert({ open: true, message: 'You have reached your daily, weekly, or monthly character limit', severity: 'error' });
              return; // return early to prevent further execution
            }
            setCharAvailability(prevState => ({
              ...prevState,
              dayly: prevState?.dayly - 125,
              weekly: prevState?.weekly - 125,
              monthly: prevState?.monthly - 125,
            }));
            setLessChar(125);
          }

          if (latitude !== null && longitude !== null) {
            setPosition({latitude, longitude});
            setHasPosition(true); // Set hasPosition to true after getting the position
          } else {
            setAllert('Could not get current position');
          }
          
        },
        (error) => {
          setAllert('Error getting current position', error);
        }
      );
    }
  };


  const handleImageChange = (event) => {
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Saves the image file in local state
    setImage(file);

    if(postType === 'normal' && !hasImage){
      if (charAvailability?.dayly - 125 < 0 || charAvailability?.weekly - 125 < 0 || charAvailability?.monthly - 125 < 0) {
        setAlert({ open: true, message: 'You have reached your daily, weekly, or monthly character limit', severity: 'error' });
        return; // return early to prevent further execution
      }
      // Update character availability
      setCharAvailability(prevState => ({
        ...prevState,
        dayly: prevState?.dayly - 125,
        weekly: prevState?.weekly - 125,
        monthly: prevState?.monthly - 125,
      }));
      setLessChar(125);
      setHasImage(true); // Set hasImage to true after loading the image
    };
  };

  const createChannel = async (channel) => {
    const response = await fetch(`${import.meta.env.VITE_DEFAULT_URL}/channels`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token, 
      },
      body: JSON.stringify({ channel }),
    });

    if (!response.ok) {
        throw new Error('Error creating channel');
      }

        const data = await response.json();
        return data;
      };
      
      const getUsers = async () => {
        const response = await fetch(`${import.meta.env.VITE_DEFAULT_URL}/users/mention`, {
          method: 'GET',
          headers: {
            'Authorization': token, // Assumendo che tu abbia un token di autenticazione
          },
        });

        if (!response.ok) {
          throw new Error('Error getting users');
        }

        const data = await response.json();
        return data;
      };

      const handleSubmit = async (event) => {
        event.preventDefault();

        if (!directRecipient && postType === 'direct') {
          setAlert('Please select a recipient.');
          return;
        }

        if (charAvailability?.dayly <= 0) {
          setAlert({ open: true, message: 'You have reached your daily character limit', severity: 'error' });
          return; // return early to prevent further execution
        } else if (charAvailability?.weekly <= 0) {
          setAlert({ open: true, message: 'You have reached your weekly character limit', severity: 'error' });
          return; // return early to prevent further execution
        } else if (charAvailability?.monthly <= 0) {
          setAlert({ open: true, message: 'You have reached your monthly character limit', severity: 'error' });
          return; // return early to prevent further execution
        } else{
          let channelId = channel;
          if (postType === 'direct') {
            const channelName = `__direct__${username}${directRecipient.u_name}`;
            const channelNameReverse = `__direct__${directRecipient.u_name}${username}`;

            const channelsResponse = await fetch(`${import.meta.env.VITE_DEFAULT_URL}/channels/my`, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
              },
            });
            const channels = await channelsResponse.json();
            let directChannel = channels.find(ch => ch.name === channelName || ch.name === channelNameReverse);
            const users = await getUsers();
            const recipientUser = users.find(user => user.u_name === directRecipient.u_name);

            if (!recipientUser) {
              throw new Error('Recipient user not found');
            }

            if (!directChannel) {
              directChannel = await createChannel({
                name: channelName,
                owners: [recipientUser.id],
                private: true,
              });
            }

            channelId = directChannel._id;
          }
          // First, create the post without the image ID
          const data = {
            title: subject || 'Default title',
            content: {
              text: postText || null,
              img: null,
              position: position || undefined,
            },
            timed: isTimed,
            keywords: keywords || [],
            posted_on: channelId || null,
            popular: false,
          };
      
        const postResponse = await fetch(`${import.meta.env.VITE_DEFAULT_URL}/posts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
          },
          body: JSON.stringify({post: data}),
        });
      
        if (!postResponse.ok) {
          console.error('Error creating post');
          return;
        }
      
        const newPost = await postResponse.json();
      
        // Then, if an image was selected, upload the image with the post ID
        if (image) {
          const imageData = new FormData();
          imageData.append('image', image);
          imageData.append('postId', newPost.post._id); // Assuming the post ID is available as _id
      
          const imageResponse = await fetch(`${import.meta.env.VITE_DEFAULT_URL}/media/image`, {
            method: 'PUT',
            headers: {
              'Authorization': token,
            },
            body: imageData,
          });
          if (!imageResponse.ok) {
            return;
          }

          const imageResponseData = await imageResponse.json();
          newPost.post.content.img = imageResponseData.imgId; // Assuming the image ID is available as imgId
        }
      
        try {
          const response = await fetch(`${import.meta.env.VITE_DEFAULT_URL}/users/${localStorage.getItem('userId')}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token,
            },
            body: JSON.stringify({
              user: {
                char_availability: {
                  dayly: charAvailability.dayly,
                  weekly: charAvailability.weekly,
                  monthly: charAvailability.monthly,
                },
              },
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.msg);
          }

          // Handle successful update
        } catch (error) {
          // Handle error
          console.error('Failed to update user', error);
        }

        // Updated the posts list
        setPosts(prevPosts => [...prevPosts, newPost]);

        // Reset form fields
        setSubject('');
        setImage(null);
        setPostText('');
        setPosition(null);
        setKeywords('');
        setcontentType('text');
        navigate('/HomePage');
      };
    }

    const handleOpen = () => {
      localStorage.setItem('lastPath', 'NewPost');
      setOpen(true);
    };
    
    const handleClose = () => {
      setOpen(false);
    };

    return (
    <Container maxWidth="sm">
      <Paper elevation={3}>
        <Box p={3}>
          {loggedIn ? (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h4" component="h2" gutterBottom align="center">
                  NEW SQUEAL
                </Typography>
                <Divider style={{ backgroundColor: 'black' }} />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="post-type-label">Post Type</InputLabel>
                  <Select
                    labelId="post-type-label"
                    id="post-type"
                    value={postType}
                    onChange={handlePostTypeChange}
                  >
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="direct">Direct Message</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {postType === 'direct' && (
                <Grid item xs={12}>
                  <Autocomplete
                    id="direct-recipient"
                    options={users}
                    getOptionLabel={(option) => option ? option.u_name : ""}
                    value={directRecipient || null}
                    onChange={(event, newValue) => {
                      setDirectRecipient(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} label="Recipient Username" required />}
                    fullWidth
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  label="Subject"
                  value={subject}
                  onChange={(e) => handleSubjectChange(e)}
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isTimed}
                      onChange={() => setIsTimed(!isTimed)}
                      name="isTimed"
                      color="primary"
                    />
                  }
                  label="Timed Squeal"
                />
                {isTimed && (
                  <Grid item xs={12}>
                    <TextField
                      label="Update Interval (minutes)"
                      type="number"
                      value={updateInterval}
                      onChange={(e) => setUpdateInterval(e.target.value)}
                      fullWidth
                    />
                    <TextField
                      label="Update Times"
                      type="number"
                      value={updateTimes}
                      onChange={(e) => setUpdateTimes(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                )}
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="post-type-label">Post Content</InputLabel>
                  <Select
                    labelId="post-type-label"
                    id="post-type"
                    value={contentType}
                    onChange={handlecontentTypeChange}
                  >
                    {isTimed ? 
                      [<MenuItem key="geolocation" value="geolocation">Geolocation</MenuItem>] : 
                      [
                        <MenuItem key="geolocation" value="geolocation">Geolocation</MenuItem>,
                        <MenuItem key="text" value="text">Text</MenuItem>,
                        <MenuItem key="image" value="image">Image</MenuItem>
                      ]
                    }
                  </Select>
                </FormControl>
              </Grid>

              {contentType === 'text' && (
                <Grid item xs={12}>
                  <MentionsInput 
                    value={postText} 
                    onChange={handlePostTextChange} 
                    placeholder="Squeal text" 
                    style={{ width: '100%', height: '100%', border: 'none', padding: '18.5px 14px' }}
                  >
                    <Mention
                      trigger="@"
                      data={(query, callback) => {
                        if (Array.isArray(users)) {
                          const matches = users
                            .filter(user => typeof user.u_name === 'string' && user.u_name.includes(query))
                            .map(user => ({ id: user.id, display: user.u_name, img: user.img }));
                          callback(matches);
                        } else {
                          console.error('Users is not an array:', users);
                        }
                      }}
                      renderSuggestion={(suggestion) => {
                        return (
                          <div className="user-suggestion" style={{ color:'#000', display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              src={suggestion.img ? `${import.meta.env.VITE_DEFAULT_URL}/media/image/${suggestion.img}` : undefined} 
                              alt="img" 
                              style={{ width: '20px', height: '20px' }}
                            >
                              {!suggestion.img && <FaceIcon />}
                            </Avatar>
                            {suggestion.display} 
                          </div>
                        );
                      }}
                      markup="@[__display__](__id__)"
                      displayTransform={(id, u_name) => `@${u_name}`}
                    />
                  </MentionsInput>
                </Grid>
              )}

              {contentType === 'image' && (
                <Grid item xs={12}>
                  {image && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <div>
                        <img src={preview} alt="preview" style={{maxHeight:"200px", width:"50%", objectFit:'cover'}}/>
                      </div>
                      <IconButton style={{ color: 'red' }} onClick={handleClearImage}>
                        <ClearIcon />
                      </IconButton>
                    </div>
                  )}
                  {!image && (
                    <Button variant="contained" fullWidth component="label">
                      <AddPhotoAlternateIcon />
                      Upload Image
                      <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                    </Button>
                  )}
                </Grid>
              )}

              {contentType === 'geolocation' && (
                <Grid item xs={12}>
                  <Button variant="contained" fullWidth onClick={handlePositionChange}>Get Current Position</Button>
                  {position && (
                    <Typography variant="body1">
                      Latitude: {position.latitude}, Longitude: {position.longitude}
                    </Typography>
                  )}
                </Grid>
              )}

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="channel-label">Channel</InputLabel>
                  <Select
                    labelId="channel-label"
                    id="channel"
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    disabled={postType === 'direct'}
                  >
                    {myChannels.filter(ch => !ch.name.startsWith('__direct__')).map((ch) => (
                      <MenuItem key={ch._id} value={ch._id}>{ch.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button variant="contained"  fullWidth onClick={handleOpen} style={{ marginTop: '10px' }}>
                  Add Channel
                </Button>
                <Channel isOpen={open} onClose={handleClose} />
              </Grid>

              <Grid item xs={12}>
                <TextField 
                  value={inputValue} 
                  onChange={(e) => {
                    const isValid = /^[a-zA-Z0-9]+$/.test(e.target.value);
                    if (isValid || e.target.value === '') {
                      setInputValue(e.target.value);
                    }
                  }} 
                  fullWidth
                  label="Add keyword"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleAddKeyword}>
                          <AddCircleIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Box mt={2}>
                  {keywords.map((keyword, index) => (
                    <Chip
                      key={index}
                      label={`#${keyword}`}
                      onDelete={handleDeleteKeyword(keyword)}
                      style={{ margin: '0 5px 5px 0' }}
                    />
                  ))}
                </Box>
              </Grid>
              
              {postType === 'normal' && charAvailability &&
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        <Box fontWeight="fontWeightBold">
                          Characters remaining daily:
                        </Box>
                      </TableCell>
                      <TableCell align="right">{charAvailability.dayly}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        <Box fontWeight="fontWeightBold">
                          Characters remaining weekly:
                        </Box>
                      </TableCell>
                      <TableCell align="right">{charAvailability.weekly}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        <Box fontWeight="fontWeightBold">
                          Characters remaining monthly:
                        </Box>
                      </TableCell>
                      <TableCell align="right">{charAvailability.monthly}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              }

              {alert.open && (
                  <Grid item xs={12}>
                    <Alert severity={alert.severity}>{alert.message}</Alert>
                  </Grid>
                )}
              <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" style={{ marginRight: '10px' }} onClick={() => navigate('/Homepage')}>
                  Cancel
                </Button>
                <Button variant="contained" color="primary" type="submit" onClick={handleSubmit}>
                  Submit
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Typography variant="body1" style={{ marginTop: '50px', textAlign: 'center' }}>
              Please <Link to="/login">login</Link> or <Link to="/register">create a new account</Link>.
            </Typography>     
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default NewPost;
