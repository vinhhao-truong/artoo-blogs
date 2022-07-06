import React, { useState, useEffect, useContext } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useParams,
} from "react-router-dom";
import styled from "styled-components";

import "./App.scss";
import MobileSubNav from "./components/layout/MobileSubNav";

//Import Components
import Navigation from "./components/layout/Navigation";

//Import Pages
import Landing from "./components/pages/Landing";
import MyBlogs from "./components/pages/MyBlogs";
import NewsFeed from "./components/pages/NewsFeed";
import BlogDetail from "./components/pages/BlogDetail";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";

//Import Services
import { useSelector } from "react-redux";
import { selectMyProfile } from "./components/store/user/myProfile-slice";
import { selectAuth } from "./components/store/user/auth-slice";

const StyledApp = styled.div`
    .pickedColor {
      color: ${props => props.pickedcolor ? props.pickedcolor : "#3aafa9"};
    }
    .pickedColor-hover {
      color: ${props => props.pickedcolor ? props.pickedcolor : "#3aafa9"};
      &:hover {
        color: ${props => props.pickedcolor ? props.pickedcolor : "#3aafa9"};
        filter: brightness(80%);
      }
    }
    .pickedColor-hoverOnly {
      color: black;
      &:hover {
        color: ${props => props.pickedcolor ? props.pickedcolor : "#3aafa9"};
      }
    }
    .pickedColorBg {
      background-color: ${props => props.pickedcolor ? props.pickedcolor : "#3aafa9"};
      color: #f8f9fa; 
    }
    .pickedColorBg-hover {
      background-color: ${props => props.pickedcolor ? props.pickedcolor : "#3aafa9"};
      color: #f8f9fa; 
      &:hover {
        background-color: ${props => props.pickedcolor ? props.pickedcolor : "#3aafa9"};
        filter: brightness(80%);
      }
    }
  `; 

function App() {
  const myProfile = useSelector(selectMyProfile);
  const auth = useSelector(selectAuth);  

  return (
    <StyledApp pickedcolor={myProfile.pickedColor}>
      <BrowserRouter>
        <Navigation isLoggedIn={auth.isAuth} />
        <Routes>
          {auth.isAuth ? (
            <>
              {/* Authenticated */}
              <Route path="/" element={<NewsFeed />} />
              <Route path="/my-blogs" element={<MyBlogs />} exact />
              <Route path="/blog/:detail" element={<BlogDetail />} />
            </>
          ) : (
            <>
              {/* Unauthenticated */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </>
          )}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <MobileSubNav isLoggedIn={auth.isAuth} />
      </BrowserRouter>
    </StyledApp>
  );
}

export default App;
