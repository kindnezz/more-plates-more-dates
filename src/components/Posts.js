import React, { useState, useEffect } from 'react';
import Post from './Post';
import FilterComponent from "./FIlterComponent";
import {FormControl, InputLabel, List, ListItem, ListItemText, MenuItem, Select, TextField} from "@mui/material";



function Posts(){
    let offset = 0;
    const [posts, setPosts] = useState([])
    const [position, setPosition] = useState(null);
    const [filterOption, setFilterOption] = useState('sort_by_date');
    const [radius, setRadius] = useState(10); // Radius for "within radius" filter



    useEffect(() => {
        if ("geolocation" in navigator) {
            // Get the current geolocation
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setPosition(position.coords);
                    console.log(position.coords)
                },
                (error) => {
                }
            );
        } else {
        }
    }, []);

    const loadMorePosts = () => {
        /*let option = filterOption;
        console.log("modif9ied", option)

        if (filterOption === 'sort_by_distance') {
            offset += 1;
            console.log("here1")
            const getPosts = async function(){
                const res = await fetch(`http://localhost:3001/posts/listByLocation/${position.latitude}/${position.longitude}/${offset}`);
                const data = await res.json();
                setPosts((oldPosts) => [...oldPosts, ...data]);
                console.log(data)
            }
            getPosts();
        }
        else if (filterOption === 'sort_by_date') {*/
            offset += 1;
            const getPosts = async function(){
                const res = await fetch(`http://localhost:3001/posts/1/${offset}`);
                const data = await res.json();
                setPosts((oldPosts) => [...oldPosts, ...data]);
            }
            getPosts();
        //}
    }

    const handleScroll = (e) => {
         // This will log the updated value of filterOption
        if(window.innerHeight + e.target.documentElement.scrollTop + 1 >= e.target.documentElement.scrollHeight){
            loadMorePosts()
        }

    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
    }, [])



    // Fetch and update posts based on the selected filter option
    useEffect(function(){
        const getPosts = async function(){
            const res = await fetch(`http://localhost:3001/posts/1/${offset}`);
            const data = await res.json();
            setPosts(data)
        }
        getPosts();

    }, []);

    // Helper function to calculate distance between two coordinates {(e) => setFilterOption(e.target.value)}

    //{(e) => setFilterOption(e.target.value)}

    const handleRadiusChange = (event) => {
        setRadius(event.target.value);
        const getPosts = async function(){
            const res = await fetch(`http://localhost:3001/posts/within/${radius}/${position.latitude}/${position.longitude}`);
            const data = await res.json();
            setPosts(data)
            console.log(data)
        }
        getPosts();
    }
    const handleFilterChange = (event) => {
        console.log(event.target.value)
        const selectedOption = event.target.value;
        console.log(selectedOption)
        setFilterOption(selectedOption);


        if (selectedOption === 'nearest') {
            const getPosts = async function(){
                const res = await fetch(`http://localhost:3001/posts/oneNear/${position.latitude}/${position.longitude}`);
                const data = await res.json();
                setPosts(data)
                console.log(data)
                window.removeEventListener('scroll', handleScroll)
            }
            getPosts();
        }
        else if (selectedOption === 'within_radius') {
            const getPosts = async function(){
                const res = await fetch(`http://localhost:3001/posts/within/${radius}/${position.latitude}/${position.longitude}`);
                const data = await res.json();
                setPosts(data)
                window.removeEventListener('scroll', handleScroll)
                console.log(data)
            }
            getPosts();
        }
        else if (selectedOption === 'sort_by_date') {
            const getPosts = async function(){
                const res = await fetch(`http://localhost:3001/posts/listByLocation/${position.latitude}/${position.longitude}/${offset}`);
                const data = await res.json();
                setPosts(data)
                window.addEventListener('scroll', handleScroll)
                console.log(data)
            }
            getPosts();
        }
        else if (selectedOption === 'sort_by_distance') {
            const getPosts = async function(){
                const res = await fetch(`http://localhost:3001/posts/1/${offset}`);
                const data = await res.json();
                setPosts(data)
                window.removeEventListener('scroll', handleScroll)

            }
            getPosts();
        }
    };

    return(
        <div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <FormControl>

                        <Select
                            value={filterOption}
                            onChange={handleFilterChange}
                        >
                            <MenuItem value="sort_by_distance">Sort by Distance</MenuItem>
                            <MenuItem value="sort_by_date">Sort by Date</MenuItem>

                            <MenuItem value="nearest">Nearest</MenuItem>
                            <MenuItem value="within_radius">Within Radius</MenuItem>


                        </Select>
                    </FormControl>
                    {filterOption === 'within_radius' && (
                        <TextField
                            type="number"
                            label="Radius (km)"
                            value={radius}
                            onChange={handleRadiusChange}
                        />
                    )}
                </div>
            </div>
            <br/>

            <ul>
                {posts?.map(post=>(<Post post={post} key={post._id}></Post>))}
            </ul>
        </div>
    );
}

export default Posts;
