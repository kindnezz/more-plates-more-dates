import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';
import { Container, Typography, Card, Avatar, Box } from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

function Profile() {
    const userContext = useContext(UserContext);
    const [profile, setProfile] = useState({});

    useEffect(function () {
        const getProfile = async function () {
            const res = await fetch("http://localhost:3001/users/profile", { credentials: "include" });
            const data = await res.json();
            setProfile(data);
        }
        getProfile();
    }, []);

    return (
        <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '20px' }}>
            {!userContext.user ? <Navigate replace to="/login" /> : ''}
            <Avatar sx={{ width: 80, height: 80, margin: '0 auto', backgroundColor: 'grey' }}>
                <FontAwesomeIcon size="3x" icon={faUser} className="icon" />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 'bold', margin: '20px 0' }}>
                User Profile
            </Typography>
            <Card sx={{ padding: '20px', marginBottom: '20px' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                    {profile.username}
                </Typography>
                <Typography variant="body1">{profile.email}</Typography>
                <Box sx={{ marginTop: '10px' }}>
                    <Typography variant="body1">Num. of posts: {profile.posts}</Typography>
                    <Typography variant="body1">Rating: {profile.rating}</Typography>
                    <Typography variant="body1">Reports: {profile.reports}</Typography>
                </Box>
            </Card>
        </Container>
    );
}

export default Profile;
