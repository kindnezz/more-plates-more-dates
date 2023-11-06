import { useContext, useState } from 'react'
import { Navigate } from 'react-router';
import { UserContext } from '../userContext';
import {Button, Container, TextareaAutosize, TextField} from "@mui/material";
import axios from "axios";
import {ThreeDots} from "react-loader-spinner";

function AddPost(props) {
    const userContext = useContext(UserContext);
    const[name, setName] = useState('');
    const[description, setDescription] = useState('');
    const[tags, setTags] = useState('');
    const[uploaded, setUploaded] = useState(false);
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(false);

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

    async function onSubmit(e){
        e.preventDefault();

        if(!name){
            alert("Insert picture title!");
            return;
        }
        else if (!description){
            alert("Insert picture description!");
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
                <TextField
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    label="Post title"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <TextareaAutosize
                    minRows={3}  // Set the minimum number of rows
                    maxRows={10} // Set the maximum number of rows
                    placeholder="Post description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ width: '100%' }}
                />

                <label htmlFor="video">Video:</label>
                <br />
                <input
                    type="file"
                    accept="video/*"
                    id="video"
                    onChange={(e) => setVideo((prev) => e.target.files[0])}
                />

                <TextField
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

                <Button fullWidth variant="contained" color="primary" type="submit">
                    Publish
                </Button>
            </form>
        </Container>
    )
}

export default AddPost;