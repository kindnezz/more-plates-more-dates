import { useState, useEffect } from 'react';
import Post from './Post';


function Posts(){
    let offset = 0;
    const [posts, setPosts] = useState([])

    useEffect(function(){
        const getPosts = async function(){
            const res = await fetch(`http://localhost:3001/posts/1/${offset}`);
            const data = await res.json();
            setPosts(data)
        }
        getPosts();

    }, []);

    const loadMorePosts = () => {
        offset += 1;

        const getPosts = async function(){
            const res = await fetch(`http://localhost:3001/posts/1/${offset}`);
            const data = await res.json();
            setPosts((oldPosts) => [...oldPosts, ...data]);
        }
        getPosts()
    }

    const handleScroll = (e) => {
        if(window.innerHeight + e.target.documentElement.scrollTop + 1 >= e.target.documentElement.scrollHeight)
            loadMorePosts()
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
    }, [])


    return(
        <div>
            <br/>

            <ul>
                {posts.map(post=>(<Post post={post} key={post._id}></Post>))}
            </ul>
        </div>
    );
}

export default Posts;
