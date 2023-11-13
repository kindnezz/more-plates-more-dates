import { useContext, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';
import {Button, Container, Paper, TextField, Typography} from "@mui/material";
import {styled} from "@mui/material/styles";
import {grey} from "@mui/material/colors";

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

function Login(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const userContext = useContext(UserContext);

    async function Login(e){
        e.preventDefault();
        const res = await fetch("http://localhost:3001/users/login", {
            method: "POST",
            credentials: "include",
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        const data = await res.json();
        if(data._id !== undefined){
            userContext.setUserContext(data);
        } else {
            setUsername("");
            setPassword("");
            setError("Invalid username or password");
        }
    }

    return (
        <Container maxWidth="sm" style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {userContext.user ? <Navigate replace to="/" /> : ''}
            <Paper elevation={3} style={{ padding: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <form onSubmit={Login}>
                    <CustomTextField
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        label="Username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <CustomTextField
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        label="Password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <CustomButton fullWidth variant="contained" color="primary" type="submit">
                        Log in
                    </CustomButton>
                    <Typography color="error">{error}</Typography>
                </form>
            </Paper>
        </Container>
    );
}

export default Login;
