import {useContext, useState} from "react";
import { UserContext } from "../userContext";
import {Link, useLocation} from "react-router-dom";
import {AppBar, Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Toolbar, Typography} from "@mui/material";

function HeaderTop(props) {
    const [open, setOpen] = useState(false);
    const userContext = useContext(UserContext);
    const location = useLocation();

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleLogout = async () => {
        userContext.setUserContext(null);
        await fetch("http://localhost:3001/users/logout");
        setOpen(false);
    };

    return (
        <AppBar position="fixed">
            <Toolbar style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Typography variant="h3" component="div" style={{ fontWeight: 'bold', color: 'white' }}>
                        {props.title}
                    </Typography>
                </div>
                <ButtonGroup color="primary" aria-label="navigation">
                    <Button
                        component={Link}
                        to="/"
                        style={{ color: 'white' }}
                        disableElevation
                        variant={location.pathname === '/' ? 'contained' : 'outlined'}>
                        Home
                    </Button>

                    <Button
                        component={Link}
                        to="/leaderboard"
                        style={{ color: 'white' }}
                        disableElevation
                        variant={location.pathname === '/leaderboard' ? 'contained' : 'outlined'}>
                        Leaderboard
                    </Button>
                    <UserContext.Consumer>
                        {context => (
                            context.user ?
                                <>
                                    <Button
                                        component={Link}
                                        to="/my-posts"
                                        style={{ color: 'white' }}
                                        disableElevation
                                        variant={location.pathname === '/my-posts' ? 'contained' : 'outlined'}>
                                        My Posts
                                    </Button>

                                    <Button
                                        component={Link}
                                        to="/publish"
                                        style={{ color: 'white' }}
                                        disableElevation
                                        variant={location.pathname === '/publish' ? 'contained' : 'outlined'}>
                                        Publish
                                    </Button>

                                    <Button
                                        component={Link}
                                        to="/profile"
                                        style={{ color: 'white' }}
                                        disableElevation
                                        variant={location.pathname === '/profile' ? 'contained' : 'outlined'}>
                                        Profile
                                    </Button>

                                    <Button
                                        style={{ color: 'white' }}
                                        disableElevation
                                        onClick={handleOpen}>
                                        Logout
                                    </Button>

                                    <Dialog open={open} onClose={handleClose} >
                                        <DialogTitle>Logout Confirmation</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText>
                                                Are you sure you want to logout?
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleClose} color="primary">
                                                No
                                            </Button>
                                            <Button onClick={handleLogout} color="primary"  to="/">
                                                Logout
                                            </Button>
                                        </DialogActions>
                                    </Dialog>

                                </>
                                :
                                <>
                                    <Button
                                        component={Link}
                                        to="/login"
                                        style={{ color: 'white' }}
                                        disableElevation
                                        variant={location.pathname === '/login' ? 'contained' : 'outlined'}>
                                        Login
                                    </Button>

                                    <Button
                                        component={Link}
                                        to="/register"
                                        style={{ color: 'white' }}
                                        disableElevation
                                        variant={location.pathname === '/register' ? 'contained' : 'outlined'}>
                                        Register
                                    </Button>
                                </>
                        )}
                    </UserContext.Consumer>
                </ButtonGroup>
            </Toolbar>
        </AppBar>
    );
}

export default HeaderTop;
