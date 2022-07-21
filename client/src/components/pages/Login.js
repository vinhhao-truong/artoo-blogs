import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { selectAuth, login } from "../store/user/auth-slice";
import { selectMyProfile, initiateProfile } from "../store/user/myProfile-slice";
import { selectMyBlogs, initiateMyBlogs } from "../store/user/myBlogs-slice";

import axios from 'axios';

import {
  TxtField,
  PasswordField,
} from "../fragments/StyledTextField";

const Login = () => {
  const err = (state, message) => ({ isErr: state, msg: message });

  const [loginDetail, setLoginDetail] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const [emailErr, setEmailErr] = useState(err(false, ""));
  const [pwErr, setPwErr] = useState(err(false, ""));

  const navigate = useNavigate();
  
  const auth = useSelector(selectAuth);
  const dispatch = useDispatch();

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    // https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=AIzaSyDt1BukIm408qBP5dRKlTbb1bxNcx1AXtw
    try{
      setIsLoading(true);
      const authReq = await axios({
        method: 'post',
        url: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDt1BukIm408qBP5dRKlTbb1bxNcx1AXtw',
        data: {
          email: loginDetail.email,
          password: loginDetail.password,
          returnSecureToken: true
        }
      });
      const authData = await authReq.data;
      const profileReq = await axios.get(`http://localhost:3001/users/${authData.localId}`);
      const profileData = await profileReq.data.data;
      console.log(profileData)
      dispatch(login({idToken: authData.idToken, uid: authData.localId}));
      dispatch(initiateProfile(profileData));
      dispatch(initiateMyBlogs(profileData.myBlogs));
      navigate("/");
      
    } catch(err) {
      console.log(err)
      setIsLoading(false);
    }
  };

  const handleChange = (prop) => (e) => {
    e.preventDefault();
    setLoginDetail((prev) => ({ ...prev, [prop]: e.target.value }));

    if (prop === "email") {
      if (e.target.value) {
        if (!e.target.value.includes("@")) {
          setEmailErr(err(true, "Invalid Email"));
        } else {
          if (/^[^@]+@[^@]+$/.test(e.target.value)) {
            setEmailErr(err(false, ""));
          } else {
            setEmailErr(err(true, "Invalid Email"));
          }
        }
      } else {
        setEmailErr(err(false, ""));
      }
    }

    if (prop === "password") {
      if (!e.target.value) {
        setPwErr(err(false, ""));
      }
    }
  };
  
  return (
    <div className="Login">
      <form className="LoginForm" onSubmit={handleSubmitLogin}>
        <h1>
          Login to <span className="pickedColor">Artoo</span> Blogs
        </h1>
        <TxtField
          error={emailErr}
          onChange={handleChange("email")}
          value={loginDetail.email}
          label="Email"
        />
        <PasswordField
            error={pwErr}
            label="Password"
            value={loginDetail.password}
            onChange={handleChange("password")}
          />
        <button className="submitBtn pickedColorBg-hover" autoFocus>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
