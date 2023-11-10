import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';
import {Container, Typography, Card} from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser  } from '@fortawesome/free-solid-svg-icons'

function Profile(){
    const userContext = useContext(UserContext);
    const [profile, setProfile] = useState({});

    useEffect(function(){
        const getProfile = async function(){
            const res = await fetch("http://localhost:3001/users/profile", {credentials: "include"});
            const data = await res.json();
            setProfile(data);
        }
        getProfile();
    }, []);

    return (
        <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '20px' }}>
            {!userContext.user ? <Navigate replace to="/login" /> : ''}
            <FontAwesomeIcon  size="3x" style={{ marginBottom: '10px' }} icon={faUser} className="icon" />
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                User Profile
            </Typography>
            <br/>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {profile.username}
            </Typography>
            <br/>
            <Typography variant="body1">{profile.email}</Typography>
            <Typography variant="body1">Num. of posts: {profile.posts}</Typography>
            <Typography variant="body1">Rating: {profile.likes}</Typography>
            <Typography variant="body1">Reports: {profile.reports}</Typography>
        </Container>
    );
}

export default Profile;
