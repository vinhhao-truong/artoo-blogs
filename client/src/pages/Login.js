import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { selectAuth, login } from "../store/user/auth-slice";
import { initiateProfile } from "../store/user/myProfile-slice";

import axios from "axios";

import {
  TxtField,
  PasswordField,
} from "../components/styled-components/StyledTextField";
import AlertModal from "../components/modals/Alert";
import useResponsive from "../hooks/useResponsive";

import { startLoading, stopLoading } from "../store/user/features-slice";
import { ChildHelmet } from "../components/fragments/Helmet";

const Login = () => {
  const err = (state, message) => ({ isErr: state, msg: message });
  const isTabletOrMobile = useResponsive("Tablet or Mobile");
  const location = useLocation();

  const [loginDetail, setLoginDetail] = useState({
    email: "",
    password: "",
  });

  const [emailErr, setEmailErr] = useState(err(false, ""));
  const [pwErr, setPwErr] = useState(err(false, ""));

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alert, setAlert] = useState({
    title: "",
    content: "",
  });

  const navigate = useNavigate();

  const auth = useSelector(selectAuth);
  const dispatch = useDispatch();

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    // https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=AIzaSyDt1BukIm408qBP5dRKlTbb1bxNcx1AXtw
    dispatch(startLoading());
    try {
      const authReq = await axios({
        method: "post",
        url: "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDt1BukIm408qBP5dRKlTbb1bxNcx1AXtw",
        data: {
          email: loginDetail.email,
          password: loginDetail.password,
          returnSecureToken: true,
        },
      });
      const authData = await authReq.data;
      const profileReq = await axios.get(
        `/users/${authData.localId}`
      );
      const profileData = await profileReq.data.data;
      dispatch(
        login({ refreshToken: authData.refreshToken, uid: authData.localId })
      );
      dispatch(initiateProfile(profileData));
      navigate("/");
    } catch (err) {
      const resErr = err.response.data.error.message
        ? err.response.data.error.message
        : err;
      console.log(resErr);
      switch (resErr) {
        case "INVALID_EMAIL":
          setAlert({ title: "Invalid email!", content: "Please try again!" });
          setLoginDetail((prev) => ({ ...prev, email: "" }));
          break;
        case "INVALID_PASSWORD":
          setAlert({
            title: "Invalid password!",
            content: "Please try again!",
          });
          setLoginDetail((prev) => ({ ...prev, password: "" }));
          break;
        case "EMAIL_NOT_FOUND":
          setAlert({ title: "Email not found!", content: "Please try again!" });
          setLoginDetail({ email: "", password: "" });
          break;
        case "TOO_MANY_ATTEMPTS_TRY_LATER":
          setAlert({
            title: "Too many attempts",
            content: "Please try again later!",
          });
          setLoginDetail({ email: "", password: "" });
          break;
        default:
      }
      setIsAlertOpen(true);
    }
    dispatch(stopLoading());
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
    <div
      style={
        isTabletOrMobile
          ? { width: "95%", margin: `${0.5} rem ${0.5} rem` }
          : {}
      }
      className="Login"
    >
      {location.pathname === "/login" && <ChildHelmet title="Login" />}
      <form className="LoginForm" onSubmit={handleSubmitLogin}>
        <h1>
          Login to <span className="pickedColor">Artoo</span> Blogs
        </h1>
        <TxtField
          error={emailErr}
          onChange={handleChange("email")}
          value={loginDetail.email}
          label="Email"
          required
          autoFocus
        />
        <PasswordField
          error={pwErr}
          label="Password *"
          value={loginDetail.password}
          onChange={handleChange("password")}
          required
        />
        <button className="submitBtn pickedColorBg-hover" autoFocus>
          Login
        </button>
        <Link className="pickedColor" to="/forgot-password">
          Forgot Password?
        </Link>
      </form>
      <AlertModal
        isOpen={isAlertOpen}
        setIsOpen={setIsAlertOpen}
        type="failure"
        title={alert.title}
        content={alert.content}
        onYes={() => {
          setIsAlertOpen(false);
        }}
        yesBtn="Retry"
      />
    </div>
  );
};

export default Login;
