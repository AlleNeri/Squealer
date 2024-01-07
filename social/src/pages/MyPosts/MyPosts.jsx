import React, { useContext } from 'react';
import Post from '../../components/Post/Post';
import { PostsContext } from '../../context/PostsContext/PostsContext';

const Posts = () => {
    const {posts} = useContext(PostsContext);
    const reversedPosts = [...posts].reverse();
    return (
        <div className="posts">
            {reversedPosts.map((post) => (
                <Post key={post.id} post={post} />
            ))}
        </div>
    );
};

export default Posts;