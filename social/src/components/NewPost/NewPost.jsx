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
    if (token) {
      fetch('http://localhost:8080/posts/my', {
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
        navigate('/Home');
      })
      .catch((error) => {
        console.error('Error:', error);
        navigate('/login');
      });
    } else {
      navigate('/login');
    }
  }, [token]);

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

  const handleImageChange = async (event) => {
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    const imageData = new FormData();
    imageData.append('image', file);

    const imageResponse = await fetch('http://localhost:8080/media/image', {
      method: 'PUT',
      headers: {
        'Authorization': token,
      },
      body: imageData
    }).catch(error => {
      console.error('Error:', error);
      return null;
    });

    if (!imageResponse) {
      console.error('Fetch request failed');
      return;
    } else {
      const imageResponseData = await imageResponse.json();
      console.log(imageResponseData);
      setImage(imageResponseData.imgId);
    }
  };
  
  const handleVideoChange = (event) => {
    setVideo(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();  

    const data = {
      title: subject || 'Default title',
      content: {
        text: text || null,
        img: image || null,
        video: video || null,
        position: position || undefined,
      },
      keywords: keywords || ['Default keyword'],
      posted_on: "658d915b3bf3108a9e5af06b",
      popular: false,
      unpopular: false,
    };

    const postResponse = await fetch('http://localhost:8080/posts/', {
    method: 'POST',
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json',
    },
      body: JSON.stringify({ post: data }),
    }).catch(error => {
      console.error('Error:', error);
      return null;
    });

    let newPost = null;

    if (!postResponse) {
      console.error('Fetch request failed');
    } else if (!postResponse.ok) {
      const text = await postResponse.text();
      console.error('Server response:', text);
    } else {
      newPost = await postResponse.json();
      console.log('Server response:', newPost);
    }

    if (newPost) {
      setPosts(prevPosts => [...prevPosts, newPost]);
  }

    
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