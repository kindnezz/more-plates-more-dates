import React, {useEffect, useState} from "react";
import {Card, CardActionArea, CardContent, List, ListItem, ListItemText, Typography} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMapMarker} from "@fortawesome/free-solid-svg-icons";
import {
    FacebookIcon,
    FacebookShareButton,
    RedditIcon,
    RedditShareButton,
    TwitterIcon,
    TwitterShareButton
} from "react-share";

function Leaderboard(){
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(function(){
        const getUsers = async function(){
            const res = await fetch("http://localhost:3001/users/leaderboard");
            const data = await res.json();
            setLeaderboard(data);
        }
        getUsers();
    }, []);

    const cardStyle = {
        alignItems: 'center',
        gap: '20px',
        padding: '10px',
        margin: 'auto',
        width: '75%',
        height: '100px',
        justifyContent: 'center',
        borderColor: 'black',
        borderWidth: '20px',
    };


    return(
        <div style={{ textAlign: 'center' }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                Leaderboard:
            </Typography>
            <List>
                {leaderboard.map((user, index) => (
                    <ListItem key={user._id} style={{ textAlign: 'center' }}>
                        <ListItemText
                            primary={
                                <div style={cardStyle}>
                                    <Card >
                                            <CardContent>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                    {user.username}
                                                </Typography>
                                                <Typography variant="body1" color="textSecondary">
                                                    Rating: {user.rating ? user.rating.toFixed(2) : "N/A"}
                                                </Typography>
                                            </CardContent>
                                    </Card>
                                </div>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </div>
    );
}

export default Leaderboard;
