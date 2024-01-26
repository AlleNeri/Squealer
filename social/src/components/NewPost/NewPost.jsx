import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../../context/LoginContext/LoginContext';
import { PostsContext } from '../../context/PostsContext/PostsContext';
import { TextField, Button, InputLabel, FormControl, MenuItem, Select, Box, Typography } from '@material-ui/core';
import './newPost.css';

function NewPost({ modalOpen, setModalOpen }) {
  const { loggedIn } = useContext(LoginContext);
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [preview, setPreview] = useState(null);
  const [video, setVideo] = useState(null);
  const [position, setPosition] = useState(undefined);
  const [keywords, setKeywords] = useState('');
  const [postType, setPostType] = useState('text'); // ['text', 'image', 'video', 'geo']
  const [isFormValid, setIsFormValid] = useState(false);
  const [channel, setChannel] = useState(''); // New state variable for the selected channel
  const [myChannels, setMyChannels] = useState([]); // New state variable for the user's channels
  const navigate = useNavigate();
  const { posts, setPosts } = useContext(PostsContext);
  const token = localStorage.getItem('token');

  useEffect(() => {
    setIsFormValid(subject !== '' && (text !== '' || image !== null || video !== null || position ) && keywords !== '');
  }, [subject, text, image, video, position, keywords]);

  useEffect(() => {
    // This function runs whenever postType changes
    setImage(null);
    setVideo(null);
    setText('');
    setPosition(null);
  }, [postType]);

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
        console.log(channels);
      };

      fetchMyChannels();
    }
  }, [loggedIn, token]);

  const handleSubjectChange = (event) => {
    setSubject(event.target.value);
  };

  const handleKeywordsChange = (event) => {
    setKeywords(event.target.value);
  };

  const handlePostTypeChange = (event) => {
    setPostType(event.target.value);
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

  const handleTextChange = (event) => {
    setText(event.target.value);
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
    
    if (!channel) {
      alert('Please select a channel.');
      return;
    }
    // First, create the post without the image ID
    const data = {
      title: subject || 'Default title',
      content: {
        text: text || null,
        img: null,
        video: video || null,
        position: position || undefined,
      },
      keywords: keywords || ['Default keyword'],
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
      console.log(postResponse);
      console.error('Error creating post');
      return;
    }
  
    const newPost = await postResponse.json();
    console.log('Server response:', newPost);
  
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
    setText('');
    setPosition(null);
    setKeywords('');
    setPostType('text');
  };

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
                  <TextField
                    label="Text"
                    value={text}
                    onChange={(e) => handleTextChange(e)}
                    multiline
                    minRows={4}
                    variant="outlined"
                    fullWidth
                  />
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