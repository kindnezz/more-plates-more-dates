import './App.css';
import React, {useState} from "react";
import { UserContext } from "./userContext";

import {BrowserRouter, Route, Routes} from "react-router-dom";
import Profile from "./components/Profile";
import ViewPost from "./components/ViewPost";
import Register from "./components/Register";
import AddPost from "./components/AddPost";
import Login from "./components/Login";
import Leaderboard from "./components/Leaderboard";
import Posts from "./components/Posts";
import MyPosts from "./components/MyPosts";
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
                    <HeaderTop title="More Plates More Dates" />
                    <div style={{ paddingTop: '70px' }}>
                        <Routes>
                            <Route path="/" exact element={<Posts />} />
                            <Route path="/my-posts" exact element={<MyPosts />} />
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
