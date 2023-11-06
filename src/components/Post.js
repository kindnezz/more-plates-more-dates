import { useNavigate } from "react-router-dom";
import YouTube from 'react-youtube';
import {Card, CardActionArea, CardContent, Typography} from "@mui/material";
import React from "react";
import {
    FacebookIcon,
    FacebookShareButton,
    RedditIcon,
    RedditShareButton,
    TwitterIcon,
    TwitterShareButton
} from "react-share";

function Post(props){
    const navigate = useNavigate()

    const cardStyle = {
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        padding: '10px',
        justifyContent: 'center'
    };

    return (
        <div style={cardStyle}>
            <Card onClick={() => navigate('/view/' + props.post._id)}>
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

                        <FacebookShareButton
                            url={'http://localhost:3000/view/' + props.post._id}
                            quote={'Dummy text!'}
                            hashtag="#muo">
                            <FacebookIcon size={32} round />
                        </FacebookShareButton>

                        <TwitterShareButton
                            url={'http://localhost:3000/view/' + props.post._id}
                            quote={'Dummy text!'}
                            hashtag="#muo">
                            <TwitterIcon size={32} round />
                        </TwitterShareButton>

                        <RedditShareButton
                            url={'http://localhost:3000/view/' + props.post._id}
                            quote={'Dummy text!'}
                            hashtag="#muo">
                            <RedditIcon size={32} round />
                        </RedditShareButton>
                    </CardContent>
                </CardActionArea>
            </Card>
        </div>
    );
}

export default Post;
