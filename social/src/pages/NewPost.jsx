import React, { useState, useContext, useEffect } from 'react';
import { LoginContext } from './LoginContext';
import { TextField, Button, InputLabel, Grid } from '@material-ui/core';
import './newPost.css';
import Post from './Post';
import { v4 as uuidv4 } from 'uuid';

function NewPost({ modalOpen, setModalOpen }) {
  const { loggedIn } = useContext(LoginContext);
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [imageId, setImageId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [video, setVideo] = useState(null);
  const [charCount, setCharCount] = useState(50);
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [keywords, setKeywords] = useState('');
  const [posts, setPosts] = useState([]);
  const generateFileId = () => uuidv4();
  
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
    })
    .catch((error) => console.error('Error:', error));
  }, []);
  
  useEffect(() => {
    console.log(posts);
  }, [posts]);

  useEffect(() => {
    handlePositionChange();
  }, []);
  const handleSubjectChange = (event) => {
    setSubject(event.target.value);
  };

  const handleKeywordsChange = (event) => {
    setKeywords(event.target.value);
  };

  const handlePositionChange = () => {
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
        text: text || 'Default text',
        img: imageId || 'Default image',
        video: video || 'Default video',
        position: position || 'Default position',
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
                <h2>New Squeal</h2>
                <div>
                <TextField
                  label="Subject"
                  value={subject}
                  onChange={handleSubjectChange}
                  required
                  fullWidth
                />
                </div>
                <div> 
                <TextField
                  label="Text"
                  value={text}
                  onChange={handleTextChange}
                  required
                  multiline
                  minRows={4}
                  inputProps={{ maxLength: 50 }}
                  fullWidth
                  />
                </div>
                
                <div><p>Characters remaining: {charCount}</p></div>
                <div>
                </div>
                <div>
                  <InputLabel id="image-label">Image</InputLabel>
                  <div>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                    {preview && (
                      <img src={preview} alt="Preview" style={{maxWidth: '100%', maxHeight: '400px'}} />
                    )}
                  </div>
                </div>
                <div>
                  <InputLabel id="video-label">Video</InputLabel>
                  <TextField
                    id="video"
                    type="file"
                    onChange={handleVideoChange}
                    fullWidth
                  />
                </div>
                <div>
                <div>
                <TextField
                    label="Position"
                    value={position}
                    onChange={handlePositionChange}
                    required
                    fullWidth
                  />
                </div>
                <div>
                  <TextField
                    label="Keywords"
                    value={keywords}
                    onChange={handleKeywordsChange}
                    required
                    fullWidth
                  />
                </div>
                <Grid container direction="row" justify-content="center" alignItems="center" style={{ marginTop: '20px' }}>
                  <Button variant="contained" color="primary" type="submit">
                    Publish
                  </Button>
                </Grid>
                </div>
              </form>
            </div>
            <div className="modal-background" onClick={() => setModalOpen(false)}></div>
          </div>
            <div className="posts">
              {posts.map((post) => (
                <Post key={post.id} post={post} />
              ))}
            </div>
        </div>
      
      ) : (
        <p></p>
      )}
    
    </div>
  );
}
  

export default NewPost;