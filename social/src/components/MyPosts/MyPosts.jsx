import React, { useContext } from 'react';
import Post from '../../pages/Post/Post';
import { PostsContext } from '../../context/PostsContext/PostsContext';

const Posts = () => {
    const {posts} = useContext(PostsContext);
    return (
        <div className="posts">
            {posts.map((post) => (
                <Post key={post.id} post={post} />
            ))}
        </div>
    );
};

export default Posts;