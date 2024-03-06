import React, { useState, useContext, useEffect, useRef } from 'react';
import { LoginContext } from '../../context/LoginContext/LoginContext';
import { PostsContext } from '../../context/PostsContext/PostsContext';
import { TimeContext } from '../../context/TimeContext/TimeContext';
import Channel from '../../components/Channel/Channel';
import { TextField, Button, InputLabel, FormControl, MenuItem, Select, Box, Link, Popover, List, ListItem, Card, CardContent,
    Typography, Avatar, Checkbox, FormControlLabel, Chip, InputAdornment, Dialog, DialogTitle, makeStyles, ListItemText,
    Container, Grid, Paper, Table, TableBody, TableCell, TableRow, Divider, IconButton, DialogActions, DialogContent } from '@material-ui/core';
import { Autocomplete } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ClearIcon from '@mui/icons-material/Clear';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RoomIcon from '@mui/icons-material/Room';
import { Alert } from '@mui/material';
import './newPost.css';
import { useNavigate } from 'react-router-dom';

function NewPost() {
  const { loggedIn } = useContext(LoginContext);
  const [charAvailability, setCharAvailability] = useState({ dayly: 0, weekly: 0, monthly: 0 });
  const [initialCharAvailability, setInitialCharAvailability] = useState({ dayly: 0, weekly: 0, monthly: 0 });
  const [openPurchase, setOpenPurchase] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [period, setPeriod] = useState('day');
  const [quantity, setQuantity] = useState(0);
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
  const [firstContent, setFirstContent] = useState(true);
  const [keywords, setKeywords] = useState([]);
  const [contentType, setcontentType] = useState('geolocation'); // ['text', 'image', 'geo']
  const [previousPostType, setPreviousPostType] = useState('geolocation'); // ['text', 'image', 'geo']
  const [postType, setPostType] = useState('normal');
  const [anchorEl, setAnchorEl] = useState(null);
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
  const [mentionFilter, setMentionFilter] = useState('');
  const openMention = Boolean(anchorEl);
  const id = openMention ? 'simple-popover' : undefined;
  const navigate = useNavigate();

  const useStyles = makeStyles((theme) => ({
    listItem: {
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
    },
    avatar: {
      marginRight: theme.spacing(1),
    },
    card: {
      backgroundColor: '#f5f5f5',
      borderRadius: '15px',
    },
    button: {
      backgroundColor: '#3f51b5',
      color: 'white',
      '&:hover': {
        backgroundColor: '#303f9f',
      },
    },
    iconButton: {
      '&:hover': {
        backgroundColor: 'transparent', // Remove hover color
      },
    },
  }));

  const classes = useStyles();

  const textFieldRef = useRef(null); // add this line
  
  useEffect(() => {
    if (anchorEl) {
      textFieldRef.current.focus();
    }
  }, [anchorEl]);

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
        setCharAvailability(prevState => ({
          dayly: prevState?.dayly - lessChar,
          weekly: prevState?.weekly - lessChar,
          monthly: prevState?.monthly - lessChar,
        }));
      })
      .catch(error => {
        console.error('Error fetching user data', error);
      });
  }, [purchased]);

  useEffect(() => {
    // This function runs whenever contentType changes
    setImage(null);
    setPostText('');
    setPosition(null);
  }, [contentType]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_DEFAULT_URL}/users/mention`)
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
    if(lessChar > 0){
      setCharAvailability(prevState => ({
        ...prevState,
        dayly: prevState?.dayly + lessChar,
        weekly: prevState?.weekly + lessChar,
        monthly: prevState?.monthly + lessChar,
      }));

      setLessChar(0);
    }

    setHasImage(false);
    setHasPosition(false);
    setPostType(event.target.value);
  };

  const handleClearImage = () => {
    setCharAvailability(prevState => ({
      ...prevState,
      dayly: prevState?.dayly + 125,
      weekly: prevState?.weekly + 125,
      monthly: prevState?.monthly + 125,
    }));

    if(lessChar - 125 >= 0){
      setLessChar(lessChar - 125);
    }
    setImage(null);
    setHasImage(false);
  };

  const handlePostTextChange = event => {
    const newPostText = event.target.value;
    const words = newPostText.split(' ');
    const lastWord = words[words.length - 1];

    if (lastWord.startsWith('@')) {
      setAnchorEl(event.currentTarget);
      setMentionFilter(lastWord.slice(1));
    } else if (anchorEl && newPostText.includes('@')) {
      setMentionFilter(lastWord);
    } else {
      setPostText(newPostText);
      setAnchorEl(null);
    }

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
      setLessChar(lessChar - diff);
    }
    setPreviousPostType('text');
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
      setLessChar(lessChar + (subject.length - newSubject.length));
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
          monthly: prevAvailability.monthly - (inputValue.length),
        }));

      }
      setLessChar(lessChar + inputValue.length);
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
    setLessChar(lessChar - keywordToDelete.length);
    setKeywords(keywords.filter((keyword) => keyword !== keywordToDelete));
  };

  const [charsUsed, setCharsUsed] = useState(0);

  // Update charsUsed whenever postText changes
  useEffect(() => {
    setCharsUsed(postText.length);
  }, [postText]);

  const handlecontentTypeChange = (event) => {
    if (lessChar > 0) {
      let charsToReturn = 0;

      // Check if the post was in "geolocation" or "image"
      if ((previousPostType === 'geolocation' && !firstContent)  || previousPostType === 'image') {
        if(previousPostType === 'geolocation'){
          setHasPosition(false);
        }else if(previousPostType === 'image'){
          setHasImage(false);
        }
        charsToReturn = 125;
      } else {
        charsToReturn = charsUsed; // Use charsUsed instead of postText.length
      }

      setCharAvailability(prevState => ({
        ...prevState,
        dayly: prevState?.dayly + lessChar,
        weekly: prevState?.weekly + lessChar,
        monthly: prevState?.monthly + lessChar,
      }));

      // Always update lessChar, regardless of the value of lessChar - charsToReturn
      setLessChar(Math.max(0, lessChar - charsToReturn));
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
            setHasPosition(true); // Set hasPosition to true after getting the position
            setLessChar(lessChar + 125);
          }

          if (latitude !== null && longitude !== null) {
            setFirstContent(false);
            setPreviousPostType('geolocation');
            setPosition({latitude, longitude});
            setHasPosition(true); // Set hasPosition to true after getting the position
          } else {
            setAlert('Could not get current position');
          }
          
        },
        (error) => {
          setAlert('Error getting current position', error);
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
      setLessChar(lessChar + 125);
      setPreviousPostType('image');
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
      localStorage.setItem('addedChannel', data._id);
      return data;
  };
      
      const getUsers = async () => {
        const response = await fetch(`${import.meta.env.VITE_DEFAULT_URL}/users/mention`, {
          method: 'GET',
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
          setAlert({ open: true, message: 'Please select a recipient', severity: 'error' });
          return;
        }

        if(!subject){
          setAlert({ open: true, message: 'Please enter a subject', severity: 'error' });
          return;
        }

        if(isTimed && (updateInterval === 0 || updateTimes === 0)){
          setAlert({open: true, message: 'Please enter an update interval and update times', severity: 'error'});
          return;
        }
        
        if(contentType === 'text' && !postText){
          setAlert({ open: true, message: 'Please enter a post text', severity: 'error' });
          return;
        }

        if(contentType === 'image' && !image){
          setAlert({ open: true, message: 'Please upload an image', severity: 'error' });
          return;
        }

        if(contentType === 'geolocation' && !position){
          setAlert({ open: true, message: 'Please get the current position', severity: 'error' });
          return;
        }

        if(!channel && postType !== 'direct'){
          setAlert({ open: true, message: 'Please select a channel or add a new one', severity: 'error' });
          return;
        }

        if (charAvailability?.dayly <= 0 && postType === 'normal') {
          setAlert({ open: true, message: 'You have reached your daily character limit', severity: 'error' });
          return; // return early to prevent further execution
        } else if (charAvailability?.weekly <= 0 && postType === 'normal') {
          setAlert({ open: true, message: 'You have reached your weekly character limit', severity: 'error' });
          return; // return early to prevent further execution
        } else if (charAvailability?.monthly <= 0 && postType === 'normal') {
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
      setAnchorEl(null);
    };

    const handleTimedChange = (event) => {
      setIsTimed(event.target.checked);
      setcontentType('geolocation');
    };

    const handleClickOpenPurchase = () => {
      setOpenPurchase(true);
    };

    const handleClosePurchase = () => {
      setOpenPurchase(false);
    };

    const handleSubmitPurchase = async () => {
      const parsedQuantity = parseInt(quantity, 10);

      try {
        const response = await fetch(`${import.meta.env.VITE_DEFAULT_URL}/users/${localStorage.getItem('userId')}/char`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
          },
          body: JSON.stringify({
            period: period,
            quantity: parsedQuantity,
          }),
        });
    
        if (response.ok) {
          setPurchased(!purchased);
        } else {
          console.log('Failed to add char availability');
        }
      } catch (error) {
        console.error('An error occurred while adding char availability:', error);
      }
    
      handleClosePurchase();
    }

    const handleListItemClick = (userName) => {
      const words = postText.split(' ');
      const lastWord = words[words.length - 1];

      if (lastWord.startsWith('@')) {
        words[words.length - 1] = `@${userName}`;
      } else {
        words.push(`@${userName}`);
      }

      setPostText(words.join(' ') + ' ');
      handleClose();
    };

    return (
    <Container maxWidth="sm">
      <Paper elevation={3}>
        <Box p={3}>
          {loggedIn ? (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h4" gutterBottom style={{ textAlign: 'center', marginTop:'20px', fontWeight:'bold' }}>
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
                      onChange={handleTimedChange}
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

              {contentType === 'text' && !isTimed && (
                <Grid item xs={12}>
                  <TextField
                    value={postText}
                    onChange={handlePostTextChange}
                    inputRef={textFieldRef}
                    variant="standard"
                    fullWidth
                    label="Squeal Text"
                  />
                  <Popover
                    id={id}
                    open={openMention}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                  >
                  <List style={{ maxHeight: '200px', overflow: 'auto' }}>
                    {users.filter(user => user.u_name.startsWith(mentionFilter)).map((user, index) => (
                      <React.Fragment key={user.id}>
                        <ListItem
                          button
                          className={classes.listItem}
                          onClick={() => handleListItemClick(user.u_name)}
                        >
                          <Avatar className={classes.avatar} src={`${import.meta.env.VITE_DEFAULT_URL}/media/image/${user.img}`}>
                            {!user.img && user.u_name[0].toUpperCase()}
                          </Avatar>
                          <ListItemText primary={user.u_name} />
                        </ListItem>
                        {index < users.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                  </Popover>
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
                <Card variant="outlined" className={classes.card} >
                  <CardContent>
                    <Grid container justifyContent ="space-between" alignItems="center">
                      <Grid item container alignItems="center" justifyContent="center">
                        <div onClick={handlePositionChange} className={classes.iconButton} style={{cursor: 'pointer'}}>
                          <RoomIcon />
                          Get current position
                        </div>
                      </Grid>
                      <Grid item container direction="column" justifyContent="center" alignItems="center">
                          {position && (
                              <>
                                  <Typography variant="body1" align="center">
                                      Latitude: {position.latitude}
                                  </Typography>
                                  <Typography variant="body1" align="center">
                                      Longitude: {position.longitude}
                                  </Typography>
                              </>
                          )}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              )}

              {postType === 'normal' && (
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
                      {myChannels.filter(ch => !ch.name.startsWith('__direct__')).length > 0 ? (
                        myChannels.filter(ch => !ch.name.startsWith('__direct__')).map((ch) => (
                          <MenuItem key={ch._id} value={ch._id}>{ch.name}</MenuItem>
                        ))
                      ) : (
                        <Typography variant="body1" align="center">
                          No channels available.
                        </Typography>
                      )}
                    </Select>
                  </FormControl>
                  <Button variant="contained"  fullWidth onClick={handleOpen} style={{ marginTop: '10px' }}>
                    Add Channel
                  </Button>
                  <Channel isOpen={open} onClose={handleClose} />
                </Grid>
              )}

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
                {postType === 'normal' && (
                <Button onClick={handleClickOpenPurchase} startIcon={<AttachMoneyIcon />} color="primary" variant="contained" style={{ marginRight: '10px' }}>
                  Buy Chars
                </Button>
                )}
                <Dialog open={openPurchase} onClose={handleClosePurchase}>
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
                          onChange={(e) => setQuantity(e.target.value)}
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                  <Button onClick={handleClosePurchase} variant="contained" color="secondary">
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmitPurchase} 
                    style={{ backgroundColor: 'green', color: 'white' }}
                  >
                    Buy
                  </Button>
                </DialogActions>
              </Dialog>
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
