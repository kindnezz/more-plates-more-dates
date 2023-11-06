import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {UserContext} from "../userContext";
import Comment from "./Comment";
import {Button, Card, CardContent, Container, Grid, List, ListItem, MenuItem, Select, TextField, Typography} from "@mui/material";

function ViewPost() {
    const {id} = useParams();

    const [post, setPost] = useState([]);
    const [comments, setComments] = useState([]);
    const [contents, setContents] = useState([]);
    const [error, setError] = useState([]);
    const [rating, setRating] = useState(1);


    useEffect(function () {
        const getPhoto = async function () {
            const res = await fetch("http://localhost:3001/posts/" + id);
            setPost(await res.json());
        }
        getPhoto();

        const getComments = async function () {
            const res = await fetch("http://localhost:3001/comments/photo/" + id);
            const data = await res.json();
            setComments(data);
        }
        getComments();
    }, [])

    const ratePost = async (event) => {
        setRating(event.target.value);

        const res = await fetch("http://localhost:3001/posts/rate/" + id, {
            method: "PUT",
            credentials: "include",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: id,
                rating: event.target.value
            })
        });
        setPost(await res.json());
    };
    async function likePhoto() {
        const res = await fetch("http://localhost:3001/posts/like/" + id, {
            method: "PUT",
            credentials: "include",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: id,
            })
        });
        setPost(await res.json());
    }

    async function reportPhoto() {
        const res = await fetch("http://localhost:3001/posts/report/" + id, {
            method: "PUT",
            credentials: "include",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: id,
            })
        });
        setPost(await res.json());
    }

    async function createComment(e) {
        e.preventDefault();
        if (contents.toString() === "") {
            setError("Empty field");
        } else {
            setError("");
            setContents("");
            const res = await fetch("http://localhost:3001/comments", {
                method: 'POST',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    contents: contents,
                    postedOn: id
                })
            });

            const getComments = async function () {
                const res = await fetch("http://localhost:3001/comments/photo/" + id);
                const data = await res.json();
                setComments(data);
            }
            getComments();
        }
    }

    return (
        <Container maxWidth="ld" style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Card>
                <CardContent>
                    <Typography variant="h2">{post.name}</Typography>
                    {post.postedBy && <Typography variant="h6">{post.postedBy.username}</Typography>}

                    {post.link && <video controls>
                        <source src={post.link} type="video/mp4" />
                    </video> }

                    <Typography variant="h4" component="div">
                        {new Date(post.date).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                    <Typography variant="h4">{post.description}</Typography>
                    <Typography variant="h4">Likes: {post.likes}</Typography>
                    <Typography variant="h4">Views: {post.views}</Typography>
                    <Typography variant="h4">Rating: {post.rating}</Typography>
                </CardContent>
            </Card>

            <div>
                <label>Select a Rating:</label>
                <Select
                    label="Rating"
                    value={rating}
                    onChange={ratePost}
                >
                    {[...Array(10)].map((_, index) => (
                        <MenuItem key={index} value={index + 1}>
                            {index + 1}
                        </MenuItem>
                    ))}
                </Select>
                <p>Selected Rating: {rating}</p>
            </div>


            <Card style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                <CardContent>
                    <Typography variant="h5">Comments:</Typography>
                    <List>
                        {comments.map((comment) => (
                            <ListItem key={comment._id}>
                                <Comment comment={comment} />
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            </Card>

            <UserContext.Consumer>
                {context => (
                    context.user ? (
                        <form onSubmit={createComment}>
                            <TextField
                                type="text"
                                name="contents"
                                label="Comment"
                                value={contents}
                                onChange={(e) => setContents(e.target.value)}
                            />
                            <Typography variant="body2" style={{ color: 'red' }}>{error}</Typography>
                        </form>
                    ) : (
                        <Typography variant="h5" style={{ color: 'red' }}>Log in to comment</Typography>
                    )
                )}
            </UserContext.Consumer>

            <UserContext.Consumer>
                {context => (
                    context.user ? (
                        <>
                            <Button style={{ marginTop: '2rem', marginBottom: '2rem' }} variant="contained" color="secondary" onClick={() => reportPhoto()}>Report</Button>
                        </>
                    ) : (
                        <Typography variant="h5" style={{ color: 'red' }}>Log in to report</Typography>
                    )
                )}
            </UserContext.Consumer>
        </Container>
    );
}

export default ViewPost;
