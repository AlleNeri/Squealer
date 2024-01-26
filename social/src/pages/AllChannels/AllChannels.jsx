import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Box, Avatar, Typography } from '@material-ui/core';
import Post from '../../components/Post/Post';

const AllChannels = () => {
  const { id } = useParams();
  const [channel, setChannel] = useState(null);
  const [posts, setPosts] = useState([]);
  let reversedPosts = [...posts].reverse();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_DEFAULT_URL}/channels/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setChannel(data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, [id]);

  useEffect(() => {
    // Fetch posts
    fetch(`${import.meta.env.VITE_DEFAULT_URL}/channels/${id}/posts`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setPosts(data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, [id, posts.length]); // Add posts.length as a dependency

  if (!channel) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <Card style={{ backgroundColor: '#f5f5f5', width:'100%' }}>
        <CardContent>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Typography variant="h5" component="h2" style={{ fontWeight: 'bold' }}>
                {channel.name.toUpperCase()}
            </Typography>
            <Typography variant="body2" component="p" style={{ textAlign: 'center' }}>
                {channel.description}
            </Typography>
            </Box>
        </CardContent>
    </Card>
    <div className="posts">
        {reversedPosts.map((post) => (
            <Post key={post.id} post={post} />
        ))}
    </div>
    </>
  );
};

export default AllChannels;