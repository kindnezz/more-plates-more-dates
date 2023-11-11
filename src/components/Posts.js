import React, { useState, useEffect } from 'react';
import Post from './Post';
import {FormControl, Grid, InputLabel, List, ListItem, ListItemText, MenuItem, Select, TextField} from "@mui/material";



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
        let option = filterOption;
        console.log("option")
        if (filterOption === 'sort_by_distance') {
            offset += 1;
            const getPosts = async function(){
                const res = await fetch(`http://localhost:3001/posts/listByLocation/${position.latitude}/${position.longitude}/${offset}`);
                const data = await res.json();
                setPosts((oldPosts) => [...oldPosts, ...data]);
                console.log(data)
            }
            getPosts();
        }
        else if (filterOption === 'sort_by_date') {/**/
            offset += 1;
            const getPosts = async function(){
                const res = await fetch(`http://localhost:3001/posts/1/${offset}`);
                const data = await res.json();
                setPosts((oldPosts) => [...oldPosts, ...data]);
            }
            getPosts();
        }
    }

    const handleScroll = (e) => {
         // This will log the updated value of filterOption
        if(window.innerHeight + e.target.documentElement.scrollTop + 1 >= e.target.documentElement.scrollHeight){
            loadMorePosts()
        }

    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [filterOption]);



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
            const res = await fetch(`http://localhost:3001/posts/within/${event.target.value}/${position.latitude}/${position.longitude}`);
            const data = await res.json();
            setPosts(data)
            console.log(data)
        }
        getPosts();
    }
    const handleFilterChange = (event) => {
        console.log(event.target.value)
        const selectedOption = event.target.value;
        setFilterOption(selectedOption);


        if (selectedOption === 'nearest') {
            const getPosts = async function(){
                const res = await fetch(`http://localhost:3001/posts/oneNear/${position.latitude}/${position.longitude}`);
                const data = await res.json();
                setPosts(data)
                console.log(data)
            }
            getPosts();
        }
        else if (selectedOption === 'within_radius') {
            const getPosts = async function(){
                const res = await fetch(`http://localhost:3001/posts/within/${radius}/${position.latitude}/${position.longitude}`);
                const data = await res.json();
                setPosts(data)
                console.log(data)
            }
            getPosts();
        }
        else if (selectedOption === 'sort_by_distance') {
            const getPosts = async function(){
                const res = await fetch(`http://localhost:3001/posts/listByLocation/${position.latitude}/${position.longitude}/${0}`);
                offset = 0;
                const data = await res.json();
                setPosts(data)
                console.log(data)
            }
            getPosts();
        }
        else if (selectedOption === 'sort_by_date') {
            const getPosts = async function(){
                const res = await fetch(`http://localhost:3001/posts/1/${0}`);
                const data = await res.json();
                offset = 0;
                setPosts(data)

            }
            getPosts();
        }
    };

    return(
        <div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <Grid container justifyContent="flex-start" alignItems="center" spacing={2}>
                    <Grid item>
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
                    </Grid>
                    {filterOption === 'within_radius' && (
                        <Grid item>
                            <TextField
                                type="number"
                                label="Radius (km)"
                                value={radius}
                                onChange={handleRadiusChange}
                            />
                        </Grid>
                    )}
                </Grid>
            </div>
            <br/>
            {posts.length > 0 ? (
                <ul>
                    {posts?.map(post=>(<Post post={post} location={position} key={post._id}></Post>))}
                </ul>
            ) : (
                <p>No posts available.</p>
            )}

        </div>
    );
}

export default Posts;
