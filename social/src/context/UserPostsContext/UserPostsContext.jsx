// UserPostsContext.js
import React, { createContext, useState } from 'react';

export const UserPostsContext = createContext();

export const UserPostsProvider = ({ children }) => {
    const [userPosts, setUserPosts] = useState([]);

    return (
        <UserPostsContext.Provider value={{ userPosts, setUserPosts }}>
            {children}
        </UserPostsContext.Provider>
    );
};