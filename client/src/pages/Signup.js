import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import validateDate from "validate-date";
import { CirclePicker as ColorPicker } from "react-color";

import {
  PasswordField,
  TxtField,
  DateField,
} from "../components/styled-components/StyledTextField";
import AlertModal from "../components/modals/Alert";
import useResponsive from "../hooks/useResponsive";
import colorCollection from "../preset/themeColorCollections";

import { getBackURL } from "../fns/getURLPath";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "../store/user/features-slice";

import {firebaseStorage} from "../store/firebase"
import { ref, uploadBytes } from "firebase/storage";


const Signup = () => {
  const newAcc = {
    profile: {
      firstName: "",
      lastName: "",
      nickname: "",
      dob: "",
      pickedColor: "#3aafa9",
      bio: "",
    },
    account: {
      email: "",
      password: "",
    },
  };
  const err = (state, message) => ({ isErr: state, msg: message });

  const isTabletOrMobile = useResponsive("Tablet or Mobile");

  const blankAlert = {
    type: "",
    title: "",
    content: "",
    yesBtn: "",
    noBtn: "",
  };
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alert, setAlert] = useState({ ...blankAlert });

  const [account, setAccount] = useState({ ...newAcc });
  const [rePw, setRePw] = useState("");

  const [dobErr, setDobErr] = useState(err(false, ""));
  const [emailErr, setEmailErr] = useState(err(false, ""));
  const [pwErr, setPwErr] = useState(err(false, ""));
  const [rePwErr, setRePwErr] = useState(err(false, ""));

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleColorChangeComplete = (color, e) => {
    setAccount((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        pickedColor: color.hex,
      },
    }));
  };

  const handleSuccessYes = (e) => {
    e.preventDefault();
    navigate("/login");
    setIsAlertOpen(false);
    setAlert({ ...blankAlert });
  };

  const handleSuccessNo = (e) => {
    e.preventDefault();
    setAccount({ ...newAcc });
    setRePw("");
    setIsAlertOpen(false);
    setAlert({ ...blankAlert });
  };

  const handleFailure = (e) => {
    e.preventDefault();
    setAccount((prev) => ({
      ...prev,
      account: {
        ...prev.account,
        email: "",
        password: "",
      },
    }));
    setRePw("");
    setDobErr(err(false, ""));
    setEmailErr(err(false, ""));
    setPwErr(err(false, ""));
    setRePwErr(err(false, ""));
    setIsAlertOpen(false);
    setAlert({ ...blankAlert });
  };

  const handleSubmitSignup = async (e) => {
    e.preventDefault();
    const lettersAndNumsCheck = /^(?=.*[a-zA-Z])(?=.*[0-9])/;
    const isFailed =
      rePwErr.isErr ||
      pwErr.isErr ||
      emailErr.isErr ||
      lettersAndNumsCheck.test(newAcc.account.password);

    if (isFailed) {
      setIsAlertOpen(true);
      setAlert({
        type: "failure",
        title: "Invalid Input",
        content: "Please correct the information!",
        yesBtn: "Retry",
      });
    } else {
      dispatch(startLoading());
      try {
        const authRequest = await axios({
          method: "post",
          url: "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDt1BukIm408qBP5dRKlTbb1bxNcx1AXtw",
          data: {
            email: account.account.email,
            password: account.account.password,
            returnSecureToken: true,
          },
        });
        const userData = await authRequest.data;
        const unsetProfileImg = "https://firebasestorage.googleapis.com/v0/b/artoo-blogs.appspot.com/o/images%2Fusers%2Funset_profile.png?alt=media&token=8e48c7f1-6d08-4d13-b5f1-e67025a00dd4";

        const newUser = {
          newUser: {
            _id: userData.localId,
            idToken: userData.idToken,
            email: account.account.email,
            firstName: account.profile.firstName,
            lastName: account.profile.lastName,
            nickname: account.profile.nickname,
            bio: account.profile.bio,
            dob: account.profile.dob.toISOString(),
            pickedColor: account.profile.pickedColor,
            profileImg: unsetProfileImg
          },
        };
        await axios.post(getBackURL("/users?request=signup"), newUser);
        setAlert({
          type: "success",
          title: "Sign Up Successfully",
          content: "Please choose your option to continue!",
          yesBtn: "Back to Login",
          noBtn: "Signup More",
        });
        setIsAlertOpen(true);
      } catch (err) {
        const errMsg = err.response.data.error.message;
        setAlert({
          type: "failure",
          title: "Invalid Input",
          content: errMsg,
          yesBtn: "Retry",
        });
        setIsAlertOpen(true);
      }
      dispatch(stopLoading());
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

    //invalid pw
    if (e.target.value) {
      const errorMsg =
        "Must be more than 8 digits and contain (at least) a letter and a number";
      const lettersAndNumsCheck = /^(?=.*[a-zA-Z])(?=.*[0-9])/;

      if (
        e.target.value.length >= 8 &&
        lettersAndNumsCheck.test(e.target.value)
      ) {
        setPwErr(err(false, ""));
      } else {
        setPwErr(err(true, errorMsg));
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
      {alert.type === "failure" && (
        <AlertModal
          isOpen={isAlertOpen}
          setIsOpen={setIsAlertOpen}
          type={alert.type}
          title={alert.title}
          content={alert.content}
          yesBtn={alert.yesBtn}
          onYes={handleFailure}
        />
      )}
      {alert.type === "success" && (
        <AlertModal
          isTwoWays
          isOpen={isAlertOpen}
          setIsOpen={setIsAlertOpen}
          type={alert.type}
          title={alert.title}
          content={alert.content}
          yesBtn={alert.yesBtn}
          onYes={handleSuccessYes}
          noBtn={alert.noBtn}
          onNo={handleSuccessNo}
        />
      )}
    </div>
  );
};

export default Signup;
