import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../../context/LoginContext/LoginContext';
import { PostsContext } from '../../context/PostsContext/PostsContext';
import { TextField, Button, InputLabel, FormControl, MenuItem, Select, Box, Typography } from '@material-ui/core';
import './newPost.css';
import { v4 as uuidv4 } from 'uuid';

function NewPost({ modalOpen, setModalOpen }) {
  const { loggedIn } = useContext(LoginContext);
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [imageId, setImageId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [video, setVideo] = useState(null);
  const [position, setPosition] = useState(undefined);
  const [keywords, setKeywords] = useState('');
  const [postType, setPostType] = useState('text'); // ['text', 'image', 'video', 'geo']
  const [isFormValid, setIsFormValid] = useState(false);
  const generateFileId = () => uuidv4();
  const navigate = useNavigate();
  const { posts, setPosts } = useContext(PostsContext);

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
    fetch('http://localhost:8080/posts/my', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
      },
    })
    .then(response => response.json())
    .then(data => {
      setPosts(data);
      console.log(data);
      navigate('/MyPosts');
    })
    .catch((error) => console.error('Error:', error));
    
  }, []);
  
  useEffect(() => {
    console.log(posts);
  }, [posts]);

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
    setCharCount(50 - event.target.value.length);
  };

  const handleImageChange = (event) => {
    setImageId(generateFileId());
    const file = event.target.files[0];
    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  const handleVideoChange = (event) => {
    setVideo(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();  
    
    const imageData = new FormData();
    imageData.append('image', image);
    imageData.append('id', imageId); 

    const imageResponse = await fetch('http://localhost:8080/upload', {
      method: 'POST',
      body: imageData
    }).catch(error => {
      console.error('Error:', error);
      return null;
    });

    if (!imageResponse) {
      console.error('Fetch request failed');
      return;
    }else{
      console.log(imageResponse);
    }

    const data = {
      title: subject || 'Default title',
      content: {
        text: text || null,
        img: imageId || null,
        video: video || null,
        position: position || undefined,
      },
      keywords: keywords || ['Default keyword'],
      popular: false,
      unpopular: false,
    };
    console.log(data);
    console.log(data);
    const postResponse = await fetch('http://localhost:8080/posts/', {
      method: 'POST',
      headers: {
        'Authorization': localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: data }),
    }).catch(error => {
      console.error('Error:', error);
      return null;
    });
    
    if (!postResponse) {
      console.error('Fetch request failed');
    }
    console.log(postResponse);
  };

  return (
    
    <div className="new-post">
      {loggedIn ? (
        <div>
          <div className="modal" style={{ display: modalOpen ? 'block' : 'none' }}>      
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
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