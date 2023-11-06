import YouTube from 'react-youtube';
import {Button, Card, CardActionArea, CardContent, Typography} from "@mui/material";
import React from "react";

function MyPost(props){
    const cardStyle = {
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        padding: '10px',
        justifyContent: 'center'
    };

    const handleDeletePost = async () => {
        try {
            const postId = props.post._id;
            await fetch(`http://localhost:3001/posts/${postId}`, {
                method: 'DELETE',
            });
            window.location.reload();
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    return (
        <div style={cardStyle}>
            <Card>
                <CardActionArea>
                    <CardContent>
                        <Typography variant="h4" component="div">
                            {props.post.name}
                        </Typography>
                        <video controls>
                            <source src={props.post.link} type="video/mp4" />
                        </video>
                        <Typography variant="h4" component="div">
                            {new Date(props.post.date).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                        <Typography variant="h4" component="div">
                            Rating: {props.post.rating}
                        </Typography>
                        <Typography variant="h4" component="div">
                            Views: {props.post.views}
                        </Typography>
                        <Button variant="contained" color="error" onClick={handleDeletePost}>
                            DELETE
                        </Button>
                    </CardContent>
                </CardActionArea>
            </Card>
        </div>
    );
}

export default MyPost;
