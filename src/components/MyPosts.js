import React, { useState, useEffect } from 'react';
import MyPost from "./MyPost";

function MyPosts(){
    const [posts, setPosts] = useState([]);

    useEffect(function(){
        const getPhotos = async function(){
            const res = await fetch("http://localhost:3001/posts/user/" + JSON.parse(localStorage.getItem('user'))._id );
            const data = await res.json();
            setPosts(data);
        }
        getPhotos();
    }, []);

    return(
        <div>
            <ul>
                {posts.map((post) => (
                    <div key={post._id}>
                        <MyPost post={post} />
                    </div>
                ))}
            </ul>
        </div>
    );
}

export default MyPosts;
