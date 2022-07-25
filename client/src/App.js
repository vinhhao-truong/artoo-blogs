import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {io} from "socket.io-client";

import "./App.scss";
import MobileSubNav from "./components/layout/MobileSubNav";

//Import Components
import Navigation from "./components/layout/Navigation";
import StyledApp from "./components/styled-components/StyledApp";

//Import Pages
import Landing from "./components/pages/Landing";
import MyBlogs from "./components/pages/MyBlogs";
import NewsFeed from "./components/pages/NewsFeed";
import BlogDetail from "./components/pages/BlogDetail";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";

//Import Services
import { useSelector, useDispatch } from "react-redux";
import { initiateProfile } from "./components/store/user/myProfile-slice";
import { selectAuth } from "./components/store/user/auth-slice";
import Profile from "./components/pages/Profile";

const socket = io("http://localhost:3001");

function App() {
  const auth = useSelector(selectAuth);
  const dispatch = useDispatch();

  const [ioIsConnected, setIoIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState(null);

  //initiate the app if user refreshes but keep logging in
  const initiateMyProfile = async () => {
    const profileReq = await axios.get(
      `http://localhost:3001/users/${auth.uid}`
    );
    const profileData = await profileReq.data.data;
    await dispatch(initiateProfile(profileData));
  };

  useEffect(() => {
    //check if localstorage has auth data
    if (auth.isAuth) {
      initiateMyProfile();
      socket.on("connect", () => {
        setIoIsConnected(true);
        console.log(socket.id)
      });

      socket.on("disconnect", () => {
        setIoIsConnected(false);
      });
      return () => {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('pong');
      };
    }
  }, []);

  return (
    <BrowserRouter>
      <StyledApp uid={auth.uid}>
        <Navigation isLoggedIn={auth.isAuth} />
        {auth.isAuth ? (
          <Routes>
            {/* Authenticated */}
            <Route path="/" element={<NewsFeed />} />
            <Route
              path="/my-blogs"
              element={<MyBlogs uid={auth.uid} />}
              exact
            />
            <Route path="/blog/:detail" element={<BlogDetail />} />
            <Route path="/profile/:uid" element={<Profile />} />
            <Route />
          </Routes>
        ) : (
          <Routes>
            {/* Unauthenticated */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}

        <MobileSubNav isLoggedIn={auth.isAuth} />
      </StyledApp>
    </BrowserRouter>
  );
}

export default App;
