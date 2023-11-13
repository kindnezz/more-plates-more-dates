import {useContext, useState} from "react";
import { UserContext } from "../userContext";
import {Link, useLocation} from "react-router-dom";
import {
    AppBar,
    Button,
    ButtonGroup,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Toolbar,
    Typography
} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import PublishIcon from '@mui/icons-material/Publish';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import ViewListIcon from '@mui/icons-material/ViewList';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

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
        <AppBar position="fixed" style={{ backgroundColor: 'gray' }}>
            <Toolbar style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Typography variant="h4" component="div" style={{ fontWeight: 'bold', color: 'white' }}>
                        {props.title}
                    </Typography>
                </div>
                <ButtonGroup color="primary" aria-label="navigation">
                    <IconButton
                        component={Link}
                        to="/"
                        style={{ color: 'white'}}
                        variant={location.pathname === '/' ? 'contained' : 'outlined'}>
                        <HomeIcon />
                    </IconButton>

                    <IconButton
                        component={Link}
                        to="/leaderboard"
                        style={{ color: 'white' }}
                        disableElevation
                        variant={location.pathname === '/leaderboard' ? 'contained' : 'outlined'}>
                        <LeaderboardIcon/>
                    </IconButton>
                    <UserContext.Consumer>
                        {context => (
                            context.user ?
                                <>
                                    <IconButton
                                        component={Link}
                                        to="/my-posts"
                                        style={{ color: 'white' }}
                                        disableElevation
                                        variant={location.pathname === '/my-posts' ? 'contained' : 'outlined'}>
                                        <ViewListIcon/>
                                    </IconButton>

                                    <IconButton
                                        component={Link}
                                        to="/publish"
                                        style={{ color: 'white' }}
                                        disableElevation
                                        variant={location.pathname === '/publish' ? 'contained' : 'outlined'}>
                                        <PublishIcon/>
                                    </IconButton>

                                    <IconButton
                                        component={Link}
                                        to="/profile"
                                        style={{ color: 'white' }}
                                        disableElevation
                                        variant={location.pathname === '/profile' ? 'contained' : 'outlined'}>
                                        <AccountCircleIcon/>
                                    </IconButton>

                                    <IconButton
                                        style={{ color: 'white' }}
                                        disableElevation
                                        onClick={handleOpen}>
                                        <LogoutIcon/>
                                    </IconButton>

                                    <Dialog open={open} onClose={handleClose} >
                                        <DialogTitle>Logout Confirmation</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText>
                                                Are you sure you want to logout?
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleClose} style={{ color: 'gray' }}>
                                                No
                                            </Button>
                                            <Button onClick={handleLogout} style={{ color: 'gray' }}  to="/">
                                                Logout
                                            </Button>
                                        </DialogActions>
                                    </Dialog>

                                </>
                                :
                                <>
                                    <IconButton
                                        component={Link}
                                        to="/login"
                                        style={{ color: 'white' }}
                                        disableElevation
                                        variant={location.pathname === '/login' ? 'contained' : 'outlined'}>
                                        <LoginIcon/>
                                    </IconButton>

                                    <IconButton
                                        component={Link}
                                        to="/register"
                                        style={{ color: 'white' }}
                                        disableElevation
                                        variant={location.pathname === '/register' ? 'contained' : 'outlined'}>
                                        <PersonAddIcon/>
                                    </IconButton>
                                </>
                        )}
                    </UserContext.Consumer>
                </ButtonGroup>
            </Toolbar>
        </AppBar>
    );
}

export default HeaderTop;
