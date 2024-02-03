import React, { useState, useContext, useEffect } from 'react';
import { LoginContext } from '../../context/LoginContext/LoginContext';
import { PostsContext } from '../../context/PostsContext/PostsContext';
import { TextField, Button, InputLabel, FormControl, MenuItem, Select, Box, Typography, Avatar } from '@material-ui/core';
import FaceIcon from '@material-ui/icons/Face';
import { MentionsInput, Mention } from 'react-mentions';
import './newPost.css';

function NewPost({ modalOpen, setModalOpen }) {
  const { loggedIn } = useContext(LoginContext);
  const [subject, setSubject] = useState('');
  const [postText, setPostText] = useState('');
  const [users, setUsers] = useState([]);
  const [image, setImage] = useState('');
  const [preview, setPreview] = useState(null);
  const [video, setVideo] = useState(null);
  const [position, setPosition] = useState(undefined);
  const [keywords, setKeywords] = useState('');
  const [postType, setPostType] = useState('text'); // ['text', 'image', 'video', 'geo']
  const [isFormValid, setIsFormValid] = useState(false);
  const [channel, setChannel] = useState(''); // New state variable for the selected channel
  const [myChannels, setMyChannels] = useState([]); // New state variable for the user's channels
  const { posts, setPosts } = useContext(PostsContext);
  const token = localStorage.getItem('token');

  useEffect(() => {
    setIsFormValid(subject !== '' && (postText !== '' || image !== null || video !== null || position ) && keywords !== '');
  }, [subject, postText, image, video, position, keywords]);

  useEffect(() => {
    // This function runs whenever postType changes
    setImage(null);
    setVideo(null);
    setPostText('');
    setPosition(null);
  }, [postType]);

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

  const handleSubjectChange = (event) => {
    setSubject(event.target.value);
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

  const handlePostTypeChange = (event) => {
    setPostType(event.target.value);
  };

  const handlePostTextChange = (event) => {
    setPostText(event.target.value);
  };

  const handlePositionChange = () => {
    if(postType==='geolocation'){
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (latitude !== null && longitude !== null) {
            setPosition({latitude, longitude});
          } else {
            console.error('Could not get current position');
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
  
    // Saves the image file in lcoal state
    setImage(file);
  };

  const handleVideoChange = (event) => {
    setVideo(event.target.files[0]);
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
    

    if (!channel) {
      alert('Please select a channel.');
      setModalOpen(true);
    }else{
      // First, create the post without the image ID
      const data = {
        title: subject || 'Default title',
        content: {
          text: postText || null,
          img: null,
          video: video || null,
          position: position || undefined,
        },
        keywords: validKeywords || [],
        posted_on: channel || null,
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
      imageData.append('postId', newPost._id); // Assuming the post ID is available as _id
  
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
      newPost.content.img = imageResponseData.imgId; // Assuming the image ID is available as imgId
    }
    
    // Updated the posts list
    setPosts(prevPosts => [...prevPosts, newPost]);

    // Reset form fields
    setSubject('');
    setImage(null);
    setVideo(null);
    setPostText('');
    setPosition(null);
    setKeywords('');
    setPostType('text');
  };
}

  return (
    <div className="new-post">
      {loggedIn ? (
        <div>
          <div className="modal" style={{ display: modalOpen ? 'block' : 'none' }}>      
            <div className="modal-content">
              <form onSubmit={handleSubmit} >
              <Typography variant="h4" component="h2" gutterBottom>
                NEW SQUEAL
              </Typography>

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
                    value={postType}
                    onChange={handlePostTypeChange}
                  >
                    <MenuItem value="text">Text</MenuItem>
                    <MenuItem value="image">Image</MenuItem>
                    <MenuItem value="video">Video</MenuItem>
                    <MenuItem value="geolocation">Geolocation</MenuItem>
                  </Select>
                </FormControl>

                {postType === 'text' && (
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

                {postType === 'image' && (
                  <>
                    <Button variant="contained" component="label">
                      Upload Image
                      <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                    </Button>
                    {image && <img src={preview} alt="preview" style={{height:"100px", width:"100px"}}/>}
                  </>
                )}

                {postType === 'video' && (
                  <Button variant="contained" component="label">
                    Upload Video
                    <input type="file" hidden accept="video/*" onChange={handleVideoChange} />
                  </Button>
                )}

                {postType === 'geolocation' && (
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
                >
                  {myChannels.map((channel) => (
                    <MenuItem key={channel._id} value={channel._id}>{channel.name}</MenuItem>
                  ))}
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
                
              <Box marginBottom={2}>
                <Button type="submit" variant="contained" color="primary" disabled={!isFormValid} onClick={
                  () => setModalOpen(false)
                }>Submit</Button>
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