import {useEffect, useState} from "react";
import {List, ListItem, ListItemText, Typography} from "@mui/material";

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
                                <div>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        {user.username}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary">
                                        Rating: {user.rating ? user.rating.toFixed(2) : "N/A"}
                                    </Typography>
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
