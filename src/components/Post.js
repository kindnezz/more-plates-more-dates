import { useNavigate } from "react-router-dom";
import YouTube from 'react-youtube';
import {Card, CardActionArea, CardContent, Typography} from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarker } from '@fortawesome/free-solid-svg-icons'
import React, {useState} from "react";
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
    const [city, setCity] = useState('');

    const getCity = async () => {
        try {
            const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${props.location.latitude}+${props.location.longitude}&key=a6658bbdff04469a973ce9b663b0d27a`);
            const data = await response.json();
            console.log(data.results[0].components)
            const city = data.results[0].components.city || data.results[0].components.town || data.results[0].components.village;
            setCity(city);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    getCity();

    const cardStyle = {
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        padding: '10px',
        justifyContent: 'center'
    };
    const locationStyle = {
        fontWeight: 'bold',
        justifyContent: 'left',
        margin: '0',
    };

    const iconStyle = {
        marginRight: '5px',
        color: '#007bff'
    }

    return (
        <div style={cardStyle}>
            <Card onClick={() => navigate('/view/' + props.post._id)}>
                <CardActionArea>
                    <CardContent>

                        <Typography variant="h4" component="div">
                            {props.post.name}
                        </Typography>
                        <span style={locationStyle}>
                            <p>
                                <FontAwesomeIcon  style={iconStyle} icon={faMapMarker} className="icon" />
                                {city}
                            </p>
                        </span>
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
