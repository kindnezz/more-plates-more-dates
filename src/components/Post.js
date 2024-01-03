import { useNavigate } from "react-router-dom";
import {Card, CardActionArea, CardContent, Typography} from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarker } from '@fortawesome/free-solid-svg-icons'
import React, {useState} from "react";

const cardStyle = {
    height: '100%',
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
    marginTop: '10%'
};

const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: '50% 50%',
    gap: '16px',
};

const iconStyle = {
    marginRight: '5px',
    color: '#007bff'
}

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

    return (
        <div style={cardStyle}>
            <Card onClick={() => navigate('/view/' + props.post._id)} style={{width: "50%"}}>
                <CardActionArea>
                    <CardContent>
                        <Typography variant="h2" component="div">
                            {props.post.name}
                        </Typography>

                        <div style={gridContainerStyle}>
                            <div>
                                <video controls style={{ maxWidth: '80%', maxHeight: '80%' }}>
                                    <source src={props.post.link} type="video/mp4" />
                                </video>
                            </div>

                            <div>

                                <Typography variant="h5" component="div">
                                    {props.post.description.split(' ').slice(0, 25).join(' ')}{props.post.description.split(' ').length > 15 ? ' ...' : ''}
                                </Typography>
                                <hr />


                                <Typography variant="h5" component="div" style={{marginTop: '10%'}}>
                                    {new Date(props.post.date).toLocaleString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </Typography>
                                <hr/>

                                <Typography variant="h5" component="div" style={{marginTop: '10%'}}>
                                    Rating: {props.post.rating}
                                </Typography>
                                <hr/>

                                <Typography variant="h5" component="div" style={{marginTop: '10%'}}>
                                    Views: {props.post.views}
                                </Typography>
                                <hr/>

                                <span style={locationStyle}>
                                  <p>
                                       <FontAwesomeIcon  style={iconStyle} icon={faMapMarker} className="icon" />
                                      {city}
                                  </p>
                                </span>

                            </div>
                        </div>
                    </CardContent>
                </CardActionArea>
            </Card>
        </div>
    );
}

export default Post;
