import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography } from '@material-ui/core';
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
      <Typography variant="h4" align="center" style={{ fontWeight: 'bold' }}>
        Posts with keyword: {keyword}
      </Typography>
      {Array.isArray(posts) &&
        posts.map((post, index) => (
          <Post key={index} post={post} />
        ))}
    </Container>
  );
};

export default KeywordPosts;