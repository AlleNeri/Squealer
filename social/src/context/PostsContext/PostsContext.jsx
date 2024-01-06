import  React from 'react';

export const PostsContext = React.createContext({
    posts: [],
    setPosts: () => {},
  });