import {Button, Card, CardContent, Typography, Container} from "@mui/material";
import React from "react";

const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: '50% 50%',
    gap: '16px',
};

function MyPost(props){
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
        <Container maxWidth="lg" style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Card style={{ marginBottom: '16px' }}>
                <CardContent style={gridContainerStyle}>
                    <Typography variant="h2">{props.post.name}</Typography>
                    {props.post.postedBy && (
                        <Typography variant="h6">
                            Posted by: {props.post.postedBy.username} on {new Date(props.post.date).toLocaleString('sl-SI', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                        </Typography>
                    )}
                    <div>
                        {props.post.link && (
                            <video controls style={{ maxWidth: '100%', maxHeight: 'auto' }}>
                                <source src={props.post.link} type="video/mp4" />
                            </video>
                        )}
                    </div>
                    <div >
                        <Typography variant="h5" component="div">
                            {new Date(props.post.date).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                        <hr />
                        <Typography variant="h5">{props.post.description}</Typography>
                        <hr />
                        <Typography variant="h5">Views: {props.post.views}</Typography>
                        <hr />
                        <Typography variant="h5">Rating: {props.post.rating}</Typography>
                        <hr/>
                        <Button variant="contained" color="error" onClick={handleDeletePost}>
                            DELETE
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </Container>
    );
}

export default MyPost;
