import React, { useEffect, useState, useContext } from 'react';
import Post from '../../../components/Post/Post';
import { PostsContext } from '../../../context/PostsContext/PostsContext';
import { Typography, Divider, createTheme, ThemeProvider, responsiveFontSizes, Card, CardContent, Box } from '@material-ui/core';

function Controversial() {
    const { posts, setPosts } = useContext(PostsContext);
    const token = localStorage.getItem('token');
    const [channels, setChannels] = useState({});
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
                setChannels(myChannels);

                // Get all posts of my channels
                const channelsPosts = await Promise.all(myChannels.map(async (channel) => {
                    const response = await fetch(`${import.meta.env.VITE_DEFAULT_URL}/channels/${channel._id}/posts`, options);
                    return response.json();
                }));

                // Flatten the array of arrays into a single array
                const allChannelsPosts = channelsPosts.flat();

                // Filter posts to only include those where popular and unpopular are both true
                const filteredPosts = allChannelsPosts.filter(post => post.popular && post.unpopular);

                // Sort by date (most recent first)
                filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

                setPosts(filteredPosts);
            } catch (error) {
                console.error(error);
            }
        };

        fetchPosts();
    }, [posts.length]);

    return (
        <div>
            <ThemeProvider theme={theme}>
                <Card style={{ backgroundColor: '#f5f5f5', width: '100%' }}>
                                <CardContent>
                                    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                                        <Typography variant="h5" component="h2" style={{ fontWeight: 'bold', marginTop:'20px' }}>
                                            CONTROVERSIAL
                                        </Typography>
                                        <Typography variant="body2" component="p" style={{ textAlign: 'center' }}>
                                            This is CONTROVERSIAL channel
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                {Array.isArray(posts) &&
                    posts.map((post, index) => (
                        <div key={index}>
                            
                            <div className="posts">
                                <Post key={post.id} post={post} />
                            </div>
                        </div>
                    ))
                }
            </ThemeProvider>
        </div>
    );
}

export default Controversial;