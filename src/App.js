import './App.css';
import React, {useEffect, useState} from "react";
import axios from "axios";
import { UserContext } from "./userContext";
import {ThreeDots} from "react-loader-spinner";
import {
    FacebookIcon,
    FacebookShareButton,
    RedditIcon,
    RedditShareButton,
    TwitterIcon,
    TwitterShareButton
} from 'react-share';

import {BrowserRouter, Route, Routes} from "react-router-dom";
import Profile from "./components/Profile";
import Register from "./components/Register";
import AddPost from "./components/AddPost";
import Login from "./components/Login";
import Leaderboard from "./components/Leaderboard";
import HeaderTop from "./components/HeaderTop";

function App() {
    const [user, setUser] = useState(localStorage.user ? JSON.parse(localStorage.user) : null);
    const updateUserData = (userInfo) => {
        localStorage.setItem("user", JSON.stringify(userInfo));
        setUser(userInfo);
    }

    return (
        <BrowserRouter>
            <UserContext.Provider value={{
                user: user,
                setUserContext: updateUserData
            }}>
                <div className="App">
                    <HeaderTop title="FormFitback" />
                    <div style={{ paddingTop: '70px' }}>
                        <Routes>
                            <Route path="/" exact element={<Posts />} />
                            <Route path="/my-posts" exact element={<MyPosts />} />
                            {/*<Route path="/votes" exact element={<PostsByVotes />} />*/}
                            <Route path="/leaderboard" exact element={<Leaderboard />} />
                            <Route path="/login" exact element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/publish" element={<AddPost />} />
                            <Route path="/view/:id" element={<ViewPost />} />
                            <Route path="/profile" element={<Profile />} />
                        </Routes>
                    </div>
                </div>
            </UserContext.Provider>
        </BrowserRouter>
    )
}

export default App;
