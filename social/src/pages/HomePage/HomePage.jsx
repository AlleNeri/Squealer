import React, { useEffect, useContext, useState, useRef } from 'react';
import Post from '../../components/Post/Post';
import { PostsContext } from '../../context/PostsContext/PostsContext';
import { SearchContext } from '../../context/SearchContext/SearchContext';
import { LoginContext } from '../../context/LoginContext/LoginContext';
import { Typography, Divider,  createTheme, ThemeProvider, responsiveFontSizes, Snackbar } from '@material-ui/core';
import Alert from '@mui/material/Alert';

function HomePage() {
    const { posts, setPosts } = useContext(PostsContext);
    const { isSearching } = useContext(SearchContext);
    const { loggedIn, justRegistered, setJustRegistered } = useContext(LoginContext);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const prevTokenRef = useRef();
    const token = localStorage.getItem('token');
    let theme = createTheme();
    theme = responsiveFontSizes(theme);
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    useEffect(() => {
      // Quando il componente viene montato, leggi il token precedente da localStorage
      const savedPrevToken = localStorage.getItem('prevToken');
      if (savedPrevToken) {
        prevTokenRef.current = savedPrevToken;
      }
    }, []);

    useEffect(() => {
      if (justRegistered) {
        setAlertMessage('Registration successful!');
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000); // hide the alert after 3 seconds
        setJustRegistered(false);
      } else if (loggedIn && token !== prevTokenRef.current) {
        setAlertMessage('Login successful!');
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000); // hide the alert after 3 seconds
        if (isFirstLoad) {
          setIsFirstLoad(false); // set isFirstLoad to false after the first login
        }
      }

      // Ogni volta che il token cambia, salvalo in localStorage e aggiorna il riferimento
      localStorage.setItem('prevToken', token);
      prevTokenRef.current = token;
    }, [token, loggedIn, justRegistered]);
    
    useEffect(() => {
      if (isSearching) return;
      const fetchPosts = async () => {
        try {
          const options = {
            headers: {
              'Authorization': token
            }
          };
          
          // Get my channels
          const myChannelsResponse = await fetch(`${import.meta.env.VITE_DEFAULT_URL}/channels/all`);
          const myChannels = myChannelsResponse ? await myChannelsResponse.json() : [];
  
          // Get all posts of my channels
          const channelsPosts = await Promise.all(myChannels.map(async (channel) => {
              const response = await fetch(`${import.meta.env.VITE_DEFAULT_URL}/channels/${channel._id}/posts`, options);
              return response ? await response.json() : [];
          }));
          
          // Flatten the array of arrays into a single array
          const allChannelsPosts = Array.isArray(channelsPosts) ? channelsPosts.flat() : [];
          
          // Combine my posts and channel posts
          let allPosts = [...allChannelsPosts];
          
          // Sort by date (most recent first)
          allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
          
          setPosts(allPosts);
        } catch (error) {
          console.error(error);
        }
      };

      fetchPosts();
  }, [posts.length, isSearching]);

    return (
      <ThemeProvider theme={theme}>
        <Typography variant="h2" component="h1" gutterBottom style={{ textAlign: 'center', marginTop:'20px', fontWeight:'bold' }}>
          EXPLORE
        </Typography>
        <Divider style={{ backgroundColor: 'black', width: '30%', margin: '0 auto' }} />
        {Array.isArray(posts) && 
          posts.map((post, index) => (
            <div key={index}>
              <Post post={post} />
            </div>
          ))
        }

        {showAlert && (
          <Snackbar open={showAlert} autoHideDuration={6000} onClose={() => setShowAlert(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
            <Alert onClose={() => setShowAlert(false)} severity="success">
              {alertMessage}
            </Alert>
          </Snackbar>
        )}
      </ThemeProvider>
    );
  }

export default HomePage;
