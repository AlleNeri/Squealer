import React, { useState, useContext } from 'react';
import { LoginContext } from './LoginContext';
import { TextField, Button, InputLabel, Grid } from '@material-ui/core';
import './newPost.css';
import Post from './Post';

function NewPost({ modalOpen, setModalOpen }) {
  const { loggedIn } = useContext(LoginContext);
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [charCount, setCharCount] = useState(50);
  const [position, setPosition] = useState('');
  const [keywords, setKeywords] = useState('');
  const [posts, setPosts] = useState([]);
  const handleSubjectChange = (event) => {
    setSubject(event.target.value);
  };

  const handleKeywordsChange = (event) => {
    setKeywords(event.target.value);
  };

  const handlePositionChange = (event) => {
    setPosition(event.target.value);
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
    setCharCount(50 - event.target.value.length);
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleVideoChange = (event) => {
    setVideo(event.target.files[0]);
  };

const handleSubmit = async (event) => {
  event.preventDefault();
  const token = localStorage.getItem('token');
  const data = {
    title: subject || 'Default title',
    content: {
      text: text || 'Default text',
      img: image || 'Default image',
      video: video || 'Default video',
      position: position || 'Default position',
    },
    keywords: keywords || ['Default keyword'],
    popular: false,
    unpopular: false,
  };
  console.log(JSON.stringify({ post: data }));
  if (!data.title || !data.content) {
    console.error('Invalid data format: title and content are required');
  } 
  const response = await fetch('http://localhost:8080/posts/', {
  method: 'POST',
  headers: {
    'Authorization': token,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ post: data }),
})

  const newPost = await response.json();
  setPosts(prevPosts => [...prevPosts, newPost]);
}

  return (
    
    <div className="new-post">
    
      {console.log('logged in:' + modalOpen)}
      {loggedIn ? (
        <div>
          {console.log('open modal:' + modalOpen)}
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
                  <TextField
                    id="image"
                    type="file"
                    onChange={handleImageChange}
                    fullWidth
                  />
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
              {posts.map(post => (
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