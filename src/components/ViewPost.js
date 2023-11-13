import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {UserContext} from "../userContext";
import Comment from "./Comment";
import {Button, Card, CardContent, Container, Grid, List, ListItem, MenuItem, Select, TextField, Typography} from "@mui/material";
import {styled} from "@mui/material/styles";
import {grey} from "@mui/material/colors";
import {
    FacebookIcon,
    FacebookShareButton,
    RedditIcon,
    RedditShareButton,
    TwitterIcon,
    TwitterShareButton
} from "react-share";

const CustomButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(grey[900]),
    backgroundColor: grey[900],
    '&:hover': {
        backgroundColor: grey[700],
    },
}));

const CustomTextField = styled(TextField)(({}) => ({
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            borderColor: 'black',
        },
    },
    '& .MuiInputLabel-root': {
        color: 'grey',
    },
    '& .MuiInputLabel-shrink': {
        color: 'grey',
    },
}));

const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: '50% 50%',
    gap: '16px',
};

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
            console.log(data)
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
        <Container maxWidth="xl" style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Card style={{ marginBottom: '16px' }}>
                <CardContent style={gridContainerStyle}>
                    <Typography variant="h2">{post.name}</Typography>

                    {post.postedBy && <Typography variant="h6">Posted by: {post.postedBy.username} on {new Date(post.date).toLocaleString('sl-SI', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}</Typography>}

                    <div>
                        {post.link && <video controls style={{ maxWidth: '100%', maxHeight: 'auto' }}>
                            <source src={post.link} type="video/mp4" />
                        </video>}
                    </div>

                    <div>
                        <Typography variant="h5" component="div">
                            {new Date(post.date).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                        <hr/>
                        <Typography variant="h5">{post.description}</Typography>
                        <hr/>
                        <Typography variant="h5">Views: {post.views}</Typography>
                        <hr/>
                        <Typography variant="h5">Rating: {post.rating}</Typography>

                        <FacebookShareButton
                            url={'http://localhost:3000/view/' + post._id}
                            title={'Check this lift out!'}
                            hashtag="#MPMD"
                            style={{marginTop: '10%'}}>
                            <FacebookIcon size={45} round />

                        </FacebookShareButton>

                        <TwitterShareButton
                            url={'http://localhost:3000/view/' + post._id}
                            title={'Check this lift out!'}
                            hashtag="#MPMD"
                            style={{marginLeft: '8px'}}>
                            <TwitterIcon size={45} round />
                        </TwitterShareButton>

                        <RedditShareButton
                            url={'http://localhost:3000/view/' + post._id}
                            title={'Check this lift out!'}
                            hashtag="#MPMD"
                            style={{marginLeft: '8px'}}>
                            <RedditIcon size={45} round />
                        </RedditShareButton>
                    </div>

                </CardContent>

            </Card>

            <div style={{ textAlign: 'center' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Select a Rating:</label>
                <select
                    style={{
                        width: '10%',
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        boxSizing: 'border-box',
                        fontSize: '16px',
                        textAlign: 'center'
                    }}
                    value={rating}
                    onChange={ratePost}
                >
                    {[...Array(10)].map((_, index) => (
                        <option key={index} value={index + 1}>
                            {index + 1}
                        </option>
                    ))}
                </select>
            </div>

            <hr/>
            <Typography variant="h3">Comments:</Typography>
            <List>
                {comments.map((comment) => (
                    <ListItem key={comment._id} style={{justifyContent: 'center'}}>
                        <Comment comment={comment} />
                    </ListItem>
                ))}
            </List>

            <UserContext.Consumer>
                {context => (
                    context.user ? (
                        <form onSubmit={createComment}>
                            <CustomTextField
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
                            <CustomButton style={{ marginTop: '2rem', marginBottom: '2rem' }} variant="contained" color="secondary" onClick={() => reportPhoto()}>Report</CustomButton>
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
