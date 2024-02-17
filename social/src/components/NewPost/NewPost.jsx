import React, { useState, useContext, useEffect } from 'react';
import { LoginContext } from '../../context/LoginContext/LoginContext';
import { PostsContext } from '../../context/PostsContext/PostsContext';
import { TimeContext } from '../../context/TimeContext/TimeContext';
import { TextField, Button, InputLabel, FormControl, MenuItem, Select, Box, Typography, Avatar, Checkbox } from '@material-ui/core';
import FaceIcon from '@material-ui/icons/Face';
import { useMediaQuery, useTheme } from '@material-ui/core';
import { MentionsInput, Mention } from 'react-mentions';
import './newPost.css';

function NewPost({ modalOpen, setModalOpen }) {
  const { loggedIn } = useContext(LoginContext);
  const [charAvailability, setCharAvailability] = useState({ dayly: 0, weekly: 0, monthly: 0 });
  const [initialCharAvailability, setInitialCharAvailability] = useState({ dayly: 0, weekly: 0, monthly: 0 });
  const { updateInterval, setUpdateInterval, updateTimes, setUpdateTimes } = useContext(TimeContext);
  const [isTimed, setIsTimed] = useState(false);
  const [subject, setSubject] = useState('');
  const [postText, setPostText] = useState('');
  const [users, setUsers] = useState([]);
  const [image, setImage] = useState('');
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [position, setPosition] = useState(undefined);
  const [keywords, setKeywords] = useState('');
  const [contentType, setcontentType] = useState('text'); // ['text', 'image', 'geo']
  const [postType, setPostType] = useState('normal');
  const [directRecipient, setDirectRecipient] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [channel, setChannel] = useState(''); // New state variable for the selected channel
  const [myChannels, setMyChannels] = useState([]); // New state variable for the user's channels
  const { posts, setPosts } = useContext(PostsContext);
  const [lessChar, setLessChar] = useState(0);
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

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
    setError(null);
  }, [contentType]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_DEFAULT_URL}/users/mention`, {
      headers: {
        'Authorization': token,
      },
    })
      .then(response => response.json())
      .then(data => {
        setUsers(data);
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
  }, [loggedIn, token]);

  const handlePostTypeChange = (event) => {
    setPostType(event.target.value);
  };

  const handleDirectRecipientChange = (event) => {
    setDirectRecipient(event.target.value);
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
        setError('You have reached your daily, weekly, or monthly character limit');
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
        setError('You have reached your daily, weekly, or monthly character limit');
        return;
      }
    }
    setSubject(newSubject);
  };

  const handleKeywordsChange = (e) => {
    const value = e.target.value;
    const lastChar = value.charAt(value.length - 1);
  
    // Se l'utente sta cercando di inserire '#' dopo '#', non permetterlo
    if (value.length > 1 && lastChar === '#' && value.charAt(value.length - 2) === '#') {
      alert('Ogni keyword deve avere un solo cancelletto!')
      return;
    }
  
    // Se l'utente sta cercando di inserire un carattere non valido dopo '#', non permetterlo
    if (value.startsWith('#') && !lastChar.match(/[a-zA-Z0-9#]/)) {
      alert('Non puoi scrivere simboli nella keyword, ma solo lettere e numeri!')
      return;
    }
  
    // Se l'utente sta cercando di inserire un carattere prima di '#', non permetterlo
    if (!value.startsWith('#') && value.length > 0) {
      alert('Inizia la keyword con #!')
      return;
    }
  
    // Aggiorna lo stato con il nuovo valore
    setKeywords(value);
  }

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
          if (latitude !== null && longitude !== null) {
            setPosition({latitude, longitude});
          } else {
            console.error('Could not get current position');
          }
          // Update character availability
          if(postType === 'normal'){
            setCharAvailability(prevState => ({
              ...prevState,
              dayly: prevState?.dayly - 125,
              weekly: prevState?.weekly - 125,
              monthly: prevState?.monthly - 125,
            }));
            setLessChar(125);
          }
        },
        (error) => {
          console.error('Error getting current position', error);
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

    if(postType === 'normal'){
      // Update character availability
      setCharAvailability(prevState => ({
        ...prevState,
        dayly: prevState?.dayly - 125,
        weekly: prevState?.weekly - 125,
        monthly: prevState?.monthly - 125,
      }));
      setLessChar(125);
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
      console.log(response);
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

    // Dividi la stringa di input in base al carattere '#'
    const splitKeywords = keywords.split('#');

    // Rimuovi la stringa vuota all'inizio dell'array, se presente
    if (splitKeywords[0] === '') {
      splitKeywords.shift();
    }

    // Rimuovi qualsiasi keyword che sia solo '#'
    const validKeywords = splitKeywords.filter(keyword => keyword.length > 1);
    

    if (!channel && postType !== 'direct') {
      alert('Please select a channel.');
      setModalOpen(true);
    }else if(charAvailability?.dayly <= 0) {
      setError('You have reached your daily character limit');
    }else if(charAvailability?.weekly <= 0) {
      setError('You have reached your weekly character limit');
    }else if(charAvailability?.monthly <= 0) {
      setError('You have reached your monthly character limit');
    }else{
      let channelId = channel;
      if (postType === 'direct') {
        const channelName = `__direct__${username}${directRecipient}`;
        const channelNameReverse = `__direct__${directRecipient}${username}`;

        const channelsResponse = await fetch(`${import.meta.env.VITE_DEFAULT_URL}/channels/my`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
          },
        });
        const channels = await channelsResponse.json();
        let directChannel = channels.find(ch => ch.name === channelName || ch.name === channelNameReverse);
        const users = await getUsers();

        const recipientUser = users.find(user => user.u_name === directRecipient);
        
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
        keywords: validKeywords || [],
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
    setError(null);
    setPosition(null);
    setKeywords('');
    setcontentType('text');
  };
}

  return (
    <div className="new-post">
      {loggedIn ? (
        <div>
          <div className="modal" style={{ display: modalOpen ? 'block' : 'none' }}>      
            <div className="modal-content" >
              <form onSubmit={handleSubmit} >
                <Typography variant="h4" component="h2" gutterBottom>
                  NEW SQUEAL
                </Typography>

                <FormControl>
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

                {postType === 'direct' && (
                  <TextField
                    id="direct-recipient"
                    label="Recipient Username"
                    value={directRecipient}
                    onChange={handleDirectRecipientChange}
                  />
                )}

                <Box marginBottom={2}>
                  <TextField
                    label="Subject"
                    value={subject}
                    onChange={(e) => handleSubjectChange(e)}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    className='modal-form input'
                  />
                </Box>

              <Box marginBottom={2}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="post-type-label">Post Type</InputLabel>
                  <Select
                    labelId="post-type-label"
                    id="post-type"
                    value={contentType}
                    onChange={handlecontentTypeChange}
                  >
                    <MenuItem value="text" disabled={isTimed}>Text</MenuItem>
                    <MenuItem value="image" disabled={isTimed}>Image</MenuItem>
                    <MenuItem value="geolocation">Geolocation</MenuItem>
                  </Select>
                </FormControl>

                {contentType === 'text' && (
                  <Box position="relative" width="100%">
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
                              { suggestion.img && 
                                <Avatar 
                                src={`${import.meta.env.VITE_DEFAULT_URL}/media/image/${suggestion.img}`} 
                                alt="img" 
                                style={{ width: '20px', height: '20px' }}
                              >
                                <FaceIcon />
                              </Avatar>
                              }
                              {suggestion.display} 
                            </div>
                          );
                        }}
                        markup="@[__display__](__id__)"
                        displayTransform={(id, u_name) => `@${u_name}`}
                      />
                    </MentionsInput>
                  </Box>
                )}

                {contentType === 'image' && (
                  <>
                    <Button variant="contained" component="label">
                      Upload Image
                      <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                    </Button>
                    {image && <img src={preview} alt="preview" style={{height:"100px", width:"100px"}}/>}
                  </>
                )}

                {contentType === 'geolocation' && (
                  <Box marginBottom={2}>
                    <Button variant="contained" onClick={handlePositionChange}>Get Current Position</Button>
                    {position && (
                      <Typography variant="body1">
                        Latitude: {position.latitude}, Longitude: {position.longitude}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
              
              <FormControl variant="outlined" className="form-control">
                <InputLabel id="channel-label">Channel</InputLabel>
                <Select
                  labelId="channel-label"
                  id="channel"
                  value={channel}
                  onChange={(event) => setChannel(event.target.value)}
                  label="Channel"
                  disabled={postType === 'direct'} // Disabilita la selezione del canale se postType è 'direct'
                >
                  {myChannels.map((channel) => {
                    // Skip channels that start with "__direct__"
                    if (channel.name.startsWith('__direct__')) {
                      return null;
                    }

                    return (
                      <MenuItem key={channel._id} value={channel._id}>{channel.name}</MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              
              <Box marginBottom={2}>
                <TextField
                  label="Keywords"
                  value={keywords}
                  onChange={(e) => handleKeywordsChange(e)}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />    
              </Box>

              <Checkbox
                checked={isTimed}
                name="isTimed"
                color="primary"
                inputProps={{ 'aria-label': 'Timed squeal' }}
                onChange={() => setIsTimed(!isTimed)}
              />
              {isTimed && (
                <>
                  <TextField
                    label="Update Interval (minutes)"
                    type="number"
                    value={updateInterval}
                    onChange={(e) => setUpdateInterval(e.target.value)}
                  />
                  <Select
                    value={updateTimes}
                    onChange={(e) => setUpdateTimes(e.target.value)}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    {/* Add more options as needed */}
                  </Select>
                </>
              )}
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <Box marginBottom={2}>
                <div style={{display:"flex", justifyContent:"space-between"}}>
                    <div>
                      <Button type="submit" variant="contained" color="primary" disabled={!isFormValid} onClick={
                        () => setModalOpen(false)
                      }>Submit</Button>
                    </div>
                    {postType === 'normal' &&
                      <div>
                      <Box fontWeight="fontWeightBold">
                        Characters remaining daily: {charAvailability?.dayly}
                      </Box>
                      <Box fontWeight="fontWeightBold">
                        Characters remaining weekly: {charAvailability?.weekly}
                      </Box>
                      <Box fontWeight="fontWeightBold">
                        Characters remaining monthly: {charAvailability?.monthly}
                      </Box>
                      </div>
                    }
                </div>
              </Box>
              </form>
            </div>
            <div className="modal-background" onClick={() => setModalOpen(false)}></div>
          </div>
        </div>
      ) : (
        <p></p>
      )}
    
    </div>
  );
}
  

export default NewPost;