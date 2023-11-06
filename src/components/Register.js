import { useState } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import {Box, Button, Container, Paper, TextField, Typography} from "@mui/material";

function Register() {
    const [username, setUsername] = useState([]);
    const [password, setPassword] = useState([]);
    const [email, setEmail] = useState([]);
    const [error, setError] = useState([]);
    const [verified, setVerified] = useState(false);

    async function Register(e){
        if(username.toString() === "" || password.toString() === "" || email.toString() === "")
        {
            setError("Missing fields.");
        }
        else if (verified)
        {
            e.preventDefault();
            const res = await fetch("http://localhost:3001/users", {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    username: username,
                    password: password
                })
            });
            const data = await res.json();
            if(data._id !== undefined){
                window.location.href="/";
            }
            else{
                setUsername("");
                setPassword("");
                setEmail("");
                setError("Registration failed");
            }
        }
        else
        {
            setError("Solve reCAPTCHA");
        }
    }

    function reCaptchaOnChange()
    {
        setVerified(true);
    }

    return(
        <Container maxWidth="xs">
            <Paper elevation={3} style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <form onSubmit={Register}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        label="Email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        label="Username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        label="Password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Box display="flex" justifyContent="center" marginBottom="16px">
                        <ReCAPTCHA
                            sitekey="6LcrdqwfAAAAADjLVS6PzxhjsLNcpQY0ADBf4FQm"
                            onChange={reCaptchaOnChange}
                        />
                    </Box>
                    <Button fullWidth variant="contained" color="primary" type="submit">
                        Register
                    </Button>
                    <Typography color="error">{error}</Typography>
                </form>
            </Paper>
        </Container>
    );
}

export default Register;
