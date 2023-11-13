import React, { useEffect, useState } from "react";
import { Card, CardContent, List, ListItem, ListItemText, Typography } from "@mui/material";

const cardStyle = {
    width: '100%',
    maxWidth: '400px',
    margin: 'auto',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const leaderboardStyle = {
    textAlign: 'center',
    marginTop: '20px',
};

const listItemStyle = {
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
};

const counterStyle = {
    marginRight: '10px',
    width: '50px',
    textAlign: 'center',
    borderRadius: '5px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
};

function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(function () {
        const getUsers = async function () {
            const res = await fetch("http://localhost:3001/users/leaderboard");
            const data = await res.json();
            setLeaderboard(data);
        };
        getUsers();
    }, []);

    return (
        <div style={leaderboardStyle}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
                Leaderboard:
            </Typography>
            <List>
                {leaderboard.map((user, index) => (
                    <ListItem key={user._id} style={listItemStyle}>
                        <ListItemText
                            primary={
                                <>

                                    <Card style={cardStyle}>
                                        <div style={counterStyle}>
                                            <Typography variant="body1" color="textSecondary">
                                                {index + 1}
                                            </Typography>
                                        </div>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                                                {user.username}
                                            </Typography>
                                            <Typography variant="body1" color="textSecondary">
                                                Rating: {user.rating ? user.rating.toFixed(2) : "N/A"}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </div>
    );
}

export default Leaderboard;
