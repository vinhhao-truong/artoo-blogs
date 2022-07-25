import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { selectAuth, login } from "../store/user/auth-slice";
import { initiateProfile } from "../store/user/myProfile-slice";

import axios from "axios";

import { TxtField, PasswordField } from "../styled-components/StyledTextField";
import LoadingModal from "../modals/Loading";
import AlertModal from "../modals/Alert";
import useResponsive from "../hooks/useResponsive";

const Login = () => {
  const err = (state, message) => ({ isErr: state, msg: message });
  const isTabletOrMobile = useResponsive("Tablet or Mobile");

  const [loginDetail, setLoginDetail] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const [emailErr, setEmailErr] = useState(err(false, ""));
  const [pwErr, setPwErr] = useState(err(false, ""));

  const [alert, setAlert] = useState("");

  const navigate = useNavigate();

  const auth = useSelector(selectAuth);
  const dispatch = useDispatch();

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    // https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=AIzaSyDt1BukIm408qBP5dRKlTbb1bxNcx1AXtw
    setIsLoading(true);
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
        `http://localhost:3001/users/${authData.localId}`
      );
      const profileData = await profileReq.data.data;
      dispatch(login({ idToken: authData.idToken, uid: authData.localId }));
      dispatch(initiateProfile(profileData));
      navigate("/");
    } catch (err) {
      const resErr = err.response.data.error.message ? err.response.data.error.message : err;
      console.log(resErr);
      switch (resErr) {
        case "INVALID_EMAIL":
          setAlert("Invalid email!");
          setLoginDetail((prev) => ({ ...prev, email: "" }));
          break;
        case "INVALID_PASSWORD":
          setAlert("Invalid password!");
          setLoginDetail((prev) => ({ ...prev, password: "" }));
          break;
        case "EMAIL_NOT_FOUND":
          setAlert("Email not found!");
          setLoginDetail({ email: "", password: "" });
          break;
        case "TOO_MANY_ATTEMPTS_TRY_LATER":
          setAlert("Too many attempts, please try later!");
          setLoginDetail({ email: "", password: "" });
          break;
        default:
      }
    }
    setIsLoading(false);
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
          label="Password"
          value={loginDetail.password}
          onChange={handleChange("password")}
          required
        />
        <button className="submitBtn pickedColorBg-hover" autoFocus>
          Login
        </button>
      </form>
      <LoadingModal isLoading={isLoading} />
      <AlertModal
        type="wrong"
        isOpen={alert.length > 0}
        onOKClick={() => {
          setAlert("");
        }}
        okContent="Retry"
        msg={alert}
      />
    </div>
  );
};

export default Login;
