import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { selectAuth, login } from "../store/user/auth-slice";
import { blankProfile } from "../store/user/myProfile-slice";
import { blankBlogs } from "../store/user/myBlogs-slice";

import axios from 'axios';

import {
  PasswordField,
  TxtField,
  DateField,
} from "../fragments/StyledTextField";

const Signup = () => {
  const newAcc = {
    profile: {
      firstName: "",
      lastName: "",
      dob: "",
    },
    account: {
      email: "",
      password: "",
    },
  };
  const err = (state, message) => ({ isErr: state, msg: message });

  const [isLoading, setIsLoading] = useState(false);

  const [account, setAccount] = useState(newAcc);
  const [rePw, setRePw] = useState("");

  const [dobErr, setDobErr] = useState(err(false, ""));
  const [emailErr, setEmailErr] = useState(err(false, ""));
  const [pwErr, setPwErr] = useState(err(false, ""));
  const [rePwErr, setRePwErr] = useState(err(false, ""));

  const handleSubmitSignup = async (e) => {
    e.preventDefault();
    const isFailed = rePwErr.isErr || pwErr.isErr || emailErr.isErr;

    if (isFailed) {
      alert("Please correct the registration form!");
    } else {
      try {
        setIsLoading(true);
        const request = await axios({
          method: 'post',
          url: 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDt1BukIm408qBP5dRKlTbb1bxNcx1AXtw',
          data: {
            email: account.account.email,
            password: account.account.password,
            returnSecureToken: true
          }
        });
        const data = request.data;
        localStorage.setItem(`AB(${data.localId})`, JSON.stringify({
          myProfile: {
            ...blankProfile,
            uid: data.localId,
            tokenId: data.tokenId,
            email: account.account.email,
            firstName: account.profile.firstName,
            lastName: account.profile.lastName,
            dob: account.profile.dob.toLocaleDateString('en-GB'),
          },
          myBlogs: [...blankBlogs]
        }))
        setIsLoading(false);
        alert(`${account.account.email} has been created successfully!`)
      } catch(err) {
        const errMsg = err.response.data.error.message
        alert(errMsg)
        setIsLoading(false)
      }
    }
  };

  const handleTFChange = (detail) => (e) => {
    e.preventDefault();
    setAccount((prev) => ({
      ...prev,
      [detail.type]: {
        ...prev[detail.type],
        [detail.prop]: e.target.value,
      },
    }));
  };

  const handleDobChange = (value) => {
    const now = new Date();

    setAccount((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        dob: value,
      },
    }));
    //throw error for future date
    if (value >= now) {
      setDobErr(err(true, "Date of birth must be in the past!"));
    } else {
      setDobErr(err(false, ""));
    }
  };

  const handleEmailChange = (e) => {
    e.preventDefault();
    setAccount((prev) => ({
      ...prev,
      account: {
        ...prev.account,
        email: e.target.value,
      },
    }));
    //Check email typo
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
  };

  const handlePwChange = (e) => {
    e.preventDefault();
    setAccount((prev) => ({
      ...prev,
      account: {
        ...prev.account,
        password: e.target.value,
      },
    }));
    //pw does not match rePw
    if (e.target.value !== rePw) {
      setRePwErr(err(true, "Two passwords have not matched each other!"));
    } else {
      setRePwErr(err(false, ""));
    }

    //invalid pw
    if (e.target.value) {
      const errorMsg = [
        "Password must contain 8 digits!",
        "Password must contain letters AND numbers!", //under developed
      ];

      // const noSpecialCase = /^[A-Za-z0-9_-]+$/i.test(e.target.value);
      // const onlyNums = /^[0-9]/.test(e.target.value);
      // const onlyLetters = /[A-Za-z]/.test(e.target.value);
      const eightOrMore = e.target.value.length >= 8;

      if (e.target.value.length < 8) {
        setPwErr(err(true, errorMsg[0]));
      } else {
        setPwErr(err(false, ""));
      }
    } else {
      setPwErr(err(false, ""));
    }
  };

  const handleRePwChange = (e) => {
    e.preventDefault();
    setRePw(e.target.value);
    //rePw does not match pw
    if (e.target.value !== account.account.password) {
      setRePwErr(err(true, "Two passwords have not matched each other!"));
    } else {
      setRePwErr(err(false, ""));
    }
  };

  return (
    <div className="Signup">
      <form className="SignupForm" onSubmit={handleSubmitSignup}>
        <h1>
          Sign up to <span className="pickedColor">Artoo</span> Blogs
        </h1>
        <div className="profile-detail">
          <div className="name">
            <TxtField
              onChange={handleTFChange({ type: "profile", prop: "firstName" })}
              value={account.profile.firstName}
              label="First Name"
              required
            />
            <TxtField
              onChange={handleTFChange({ type: "profile", prop: "lastName" })}
              value={account.profile.lastName}
              label="Last Name"
              required
            />
          </div>
          <DateField
            disableFuture
            label="Date of Birth"
            value={account.profile.dob}
            onChange={handleDobChange}
            error={dobErr}
            required
          />
        </div>
        <div className="account-detail">
          <TxtField
            error={emailErr}
            value={account.account.email}
            onChange={handleEmailChange}
            label="Email"
            required
          />
          <PasswordField
            error={pwErr}
            label="Password"
            value={account.account.password}
            onChange={handlePwChange}
            required
          />
          <PasswordField
            error={rePwErr}
            label="Re-enter Password"
            value={rePw}
            onChange={handleRePwChange}
            required
          />
        </div>
        <button className="submitBtn pickedColorBg-hover" autoFocus>
          Sign Up
        </button>
        {isLoading && <p>Loading...</p>}
      </form>
    </div>
  );
};

export default Signup;
