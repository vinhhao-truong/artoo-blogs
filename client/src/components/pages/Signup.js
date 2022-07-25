import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import validateDate from "validate-date";
import { CirclePicker as ColorPicker } from "react-color";

import {
  PasswordField,
  TxtField,
  DateField,
} from "../styled-components/StyledTextField";
import LoadingModal from "../modals/Loading";
import AlertModal from "../modals/Alert";
import useResponsive from "../hooks/useResponsive";

const Signup = () => {
  const newAcc = {
    profile: {
      firstName: "",
      lastName: "",
      nickname: "",
      dob: "",
      pickedColor: "#3aafa9",
    },
    account: {
      email: "",
      password: "",
    },
  };
  const err = (state, message) => ({ isErr: state, msg: message });

  const isTabletOrMobile = useResponsive("Tablet or Mobile");

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  const [account, setAccount] = useState({ ...newAcc });
  const [rePw, setRePw] = useState("");

  const [dobErr, setDobErr] = useState(err(false, ""));
  const [emailErr, setEmailErr] = useState(err(false, ""));
  const [pwErr, setPwErr] = useState(err(false, ""));
  const [rePwErr, setRePwErr] = useState(err(false, ""));

  const navigate = useNavigate();

  const colorCollection = [
    "#70e000",
    "#3aafa9",
    "#fec89a",
    "#e5989b",
    "#ff0000",
    "#e63946",
    "#8b8c89",
    "#505050",
    "#a68a64",
    "#7f4f24",
    "#ff8fab",
    "#bdb2ff",
    "#ffba08",
    "#e85d04",
    "#00bbf9",
    "#3a86ff",
  ];

  const handleColorChangeComplete = (color, e) => {
    setAccount((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        pickedColor: color.hex,
      },
    }));
  };

  const handleSuccessModal = (e) => {
    e.preventDefault();
    setIsSuccess(false);
    navigate("/login");
  };

  const handleSignupAgain = (e) => {
    e.preventDefault();
    setIsSuccess(false);
    setAccount({ ...newAcc });
    setRePw("");
  };

  const handleFailedModal = (e) => {
    e.preventDefault();
    setIsFailed(false);
    setAccount((prev) => ({
      ...prev,
      account: {
        ...prev.account,
        password: "",
      },
    }));
    setRePw("");
  };

  const handleSubmitSignup = async (e) => {
    e.preventDefault();
    const isFailed = rePwErr.isErr || pwErr.isErr || emailErr.isErr;

    if (isFailed) {
      setIsFailed(true);
    } else {
      try {
        setIsLoading(true);
        const authRequest = await axios({
          method: "post",
          url: "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDt1BukIm408qBP5dRKlTbb1bxNcx1AXtw",
          data: {
            email: account.account.email,
            password: account.account.password,
            returnSecureToken: true,
          },
        });
        const userData = authRequest.data;
        const newUser = {
          newUser: {
            _id: userData.localId,
            email: account.account.email,
            firstName: account.profile.firstName,
            lastName: account.profile.lastName,
            nickname: account.profile.nickname,
            dob: account.profile.dob.toISOString(),
            pickedColor: account.profile.pickedColor
          },
        };
        await axios.post("http://localhost:3001/users/", newUser);
        setIsLoading(false);
        setIsSuccess(true);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
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
    if (value) {
      //throw error for future date
      if (value >= now) {
        setDobErr(err(true, "Date of birth must be in the past!"));
      } else {
        setDobErr(err(false, ""));
      }
      //validate date input
      if (
        !validateDate(value.toLocaleString("en-GB"), "boolean", "dd/mm/yyyy")
      ) {
        setDobErr(err(true, "Please enter valid date!"));
      }
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
      // const eightOrMore = e.target.value.length >= 8;

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
    <div
      style={
        isTabletOrMobile
          ? { width: "95%", margin: `${0.5} rem ${0.5} rem` }
          : {}
      }
      className="Signup"
    >
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
          <TxtField
            onChange={handleTFChange({ type: "profile", prop: "nickname" })}
            value={account.profile.nickname}
            label="Nickname (optional)"
            error={false}
          />
          <div className="color-field">
            <p>Set your profile color: </p>
            <ColorPicker
              className="color-picker"
              width={225}
              circleSize={20}
              circleSpacing={8}
              onChangeComplete={handleColorChangeComplete}
              colors={colorCollection}
            />
          </div>

          <DateField
            disableFuture
            label="Date of Birth *"
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
            label="Password *"
            value={account.account.password}
            onChange={handlePwChange}
            required
          />
          <PasswordField
            error={rePwErr}
            label="Confirm Password *"
            value={rePw}
            onChange={handleRePwChange}
            required
          />
        </div>
        <button className="submitBtn pickedColorBg-hover" autoFocus>
          Sign Up
        </button>
      </form>
      <LoadingModal isLoading={isLoading} />
      <AlertModal
        type="right"
        isOpen={isSuccess}
        onOKClick={handleSuccessModal}
        onCancelClick={handleSignupAgain}
        msg={`${account.account.email} has been created successfully!`}
        okContent="Back to Login"
        cancelContent="Register more?"
      />
      <AlertModal
        type="wrong"
        isOpen={isFailed}
        onOKClick={handleFailedModal}
        msg="Please enter information correctly!"
      />
    </div>
  );
};

export default Signup;
