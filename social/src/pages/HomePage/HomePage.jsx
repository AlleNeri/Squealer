import React, { useEffect, useContext } from 'react';
import Post from '../../components/Post/Post';
import { PostsContext } from '../../context/PostsContext/PostsContext';
import { Typography, Divider,  createTheme, ThemeProvider, responsiveFontSizes } from '@material-ui/core';

function HomePage() {
    const { posts, setPosts } = useContext(PostsContext);
    const token = localStorage.getItem('token');
    let theme = createTheme();
    theme = responsiveFontSizes(theme);
   useEffect(() => {
    const fetchPosts = async () => {
      try {
        const options = {
          headers: {
            'Authorization': token
          }
        };
        
        // Get my channels
        const myChannelsResponse = await fetch(`${import.meta.env.VITE_DEFAULT_URL}/channels/all`);
        const myChannels = await myChannelsResponse.json();

        // Get all posts of my channels
        const channelsPosts = await Promise.all(myChannels.map(async (channel) => {
            const response = await fetch(`${import.meta.env.VITE_DEFAULT_URL}/channels/${channel._id}/posts`, options);
            return response.json();
        }));
        
        // Flatten the array of arrays into a single array
        const allChannelsPosts = channelsPosts.flat();
        
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
  }, [posts.length]);

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Typography variant="h2" component="h1" gutterBottom style={{ textAlign: 'center', padding: '20px 0' }}>
          HOMEPAGE
        </Typography>
      <Divider style={{ backgroundColor: 'black', width: '30%', margin: '0 auto' }} />
      {Array.isArray(posts) && 
        posts.map((post, index) => (
          <div key={index}>
            <Post post={post} />
          </div>
        ))
      }
      </ThemeProvider>
    </div>
  );
}

export default HomePage;