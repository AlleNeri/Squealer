import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Divider } from '@material-ui/core';
import { PostsContext } from '../../context/PostsContext/PostsContext';
import Post from '../../components/Post/Post'; 

const KeywordPosts = () => {
  const {posts, setPosts} = useContext(PostsContext);
  const { keyword } = useParams();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_DEFAULT_URL}/posts?keyword=${keyword}`, {
          headers: {
            'Authorization': token
          }
        });
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };

    fetchPosts();
  }, [posts]);

  return (
    <Container>

      <Typography variant="h2" component="h1" gutterBottom style={{ textAlign: 'center', marginTop:'20px', fontWeight:'bold' }}>
          KEYWORD #{keyword.toUpperCase()}
      </Typography>

      <Divider style={{ backgroundColor: 'black', width: '30%', margin: '0 auto' }} />

      {Array.isArray(posts) &&
        posts.map((post, index) => (
          <Post key={index} post={post} />
        ))}
    </Container>
  );
};

export default KeywordPosts;