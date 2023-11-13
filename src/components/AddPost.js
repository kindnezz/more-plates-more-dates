import {useContext, useEffect, useState} from 'react'
import { Navigate } from 'react-router';
import { UserContext } from '../userContext';
import {Button, Container, TextareaAutosize, TextField} from "@mui/material";
import axios from "axios";
import {ThreeDots} from "react-loader-spinner";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { styled } from '@mui/material/styles';
import { grey} from '@mui/material/colors';

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

function AddPost(props) {
    const userContext = useContext(UserContext);
    const[name, setName] = useState('');
    const[description, setDescription] = useState('');
    const[tags, setTags] = useState('');
    const[uploaded, setUploaded] = useState(false);
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [position, setPosition] = useState(null);

    const uploadFile = async (type) => {
        const data = new FormData();
        data.append("file", video);
        data.append("upload_preset",  'videos_preset');

        try {
            let api = `https://api.cloudinary.com/v1_1/duxwkkiwn/video/upload`;

            const res = await axios.post(api, data);
            const { secure_url } = res.data;
            return secure_url;
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if ("geolocation" in navigator) {
            // Get the current geolocation
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setPosition(position.coords);
                    console.log(position.coords)
                },
                (error) => {
                }
            );
        } else {
        }
    }, []);

    async function onSubmit(e){
        e.preventDefault();

        if(!name){
            alert("Insert video title!");
            return;
        }
        else if (!description){
            alert("Insert video description!");
            return;
        }

        try {
            setLoading(true);

            const videoUrl = await uploadFile('video');
            console.log(videoUrl)

            const formData = new FormData();
            formData.append('name', name);
            formData.append('link', videoUrl);
            formData.append('description', description);
            formData.append('tags', tags);
            formData.append('latitude', position.latitude);
            formData.append('longitude', position.longitude);

            await fetch('http://localhost:3001/posts', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            setVideo(null);

            console.log("File upload success!");
            setLoading(false);
        } catch (error) {
            console.error(error);
        }

        setUploaded(true);
    }

    return (
        <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '20px' }}>
            {!userContext.user ? <Navigate replace to="/login" /> : ''}
            {uploaded ? <Navigate replace to="/" /> : ''}
            <form className="form-group" onSubmit={onSubmit}>
                <CustomTextField
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    label="Post title"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <CustomTextField
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    label="Post description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ width: '100%' }}
                />

                <CustomButton
                    variant="contained"
                    startIcon={<UploadFileIcon />}
                    style={{ marginTop: '20px', marginBottom: '20px' }}
                    component="label">
                    Choose Video File
                    <input
                        type="file"
                        accept="video/*"
                        id="video"
                        style={{ display: 'none' }}
                        onChange={(e) => setVideo((prev) => e.target.files[0])}
                    />
                </CustomButton>

                <CustomTextField
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    label="Post tags"
                    name="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />

                {
                    loading && <ThreeDots
                        height="80"
                        width="80"
                        radius="9"
                        color="#4fa94d"
                        ariaLabel="three-dots-loading"
                        wrapperStyle={{}}
                        wrapperClassName=""
                        visible={true}
                    />
                }

                <CustomButton fullWidth variant="contained" color="primary" type="submit">
                    Publish
                </CustomButton>
            </form>
        </Container>
    )
}

export default AddPost;