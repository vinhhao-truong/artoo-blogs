import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";

import { logout, selectAuth } from "../store/user/auth-slice";
import { selectMyProfile } from "../store/user/myProfile-slice";

import {
  TxtField,
  PasswordField,
} from "../components/styled-components/StyledTextField";
import axios from "axios";
import {
  setLoadingBar,
  startLoading,
  stopLoading,
  triggerPopup,
} from "../store/user/features-slice";
import presetColor from "../preset/presetColor";
import AlertModal from "../components/modals/Alert";
import ReactLoading from "react-loading";

const StyledAccountSettings = styled.div`
  .Account__nav {
    a {
      color: ${(props) => props.pickedColor};
      &:active,
      &.active {
        background-color: ${(props) => props.pickedColor};
        color: #f8f9fa;
      }
    }
  }
`;

const StyledBtn = styled.button`
  background-color: ${(props) => props.pickedColor};
  color: #f8f9fa;
`;

const AccountInfo = () => {
  const auth = useSelector(selectAuth);
  const myProfile = useSelector(selectMyProfile);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [info, setInfo] = useState({
    displayName: "",
    email: "",
    isVerified: null,
  });

  useEffect(() => {
    (async () => {
      dispatch(setLoadingBar(0));
      setIsLoading(true);
      try {
        if (auth.idToken) {
          const accountRes = await axios.post(
            "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyDt1BukIm408qBP5dRKlTbb1bxNcx1AXtw",
            {
              idToken: auth.idToken,
            }
          );
          dispatch(setLoadingBar(50));
          const resData = accountRes.data.users[0];
          setInfo({
            displayName: resData.displayName,
            email: resData.email,
            isVerified: resData.emailVerified,
          });
        }
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
      dispatch(setLoadingBar(100));
    })();
  }, [auth]);

  return (
    <div className="Account__main AccountInfo">
      <h1>Account Info</h1>
      {isLoading && (
        <ReactLoading
          width="2.5rem"
          height="2.5rem"
          className="loading"
          color={myProfile.pickedColor}
          type="cubes"
        />
      )}
      {!isLoading && (
        <>
          <p>
            <b>Display Name: </b>
            {info.displayName}
          </p>
          <p>
            <b>Email: </b>
            {info.email}
          </p>
          <p>
            <b>Verified: </b>
            {typeof info.isVerified === "boolean" && info.isVerified && (
              <span style={{ color: presetColor.green }}>
                <TiTick />
              </span>
            )}
            {typeof info.isVerified === "boolean" && !info.isVerified && (
              <span style={{ color: presetColor.red }}>
                <ImCross />
              </span>
            )}
          </p>
          <p style={{ color: "red" }}>
            <i>*Display name based on nickname (if provided) or first name.</i>
          </p>
        </>
      )}
    </div>
  );
};

const VerifyEmail = () => {
  const auth = useSelector(selectAuth);
  const myProfile = useSelector(selectMyProfile);
  const dispatch = useDispatch();

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alert, setAlert] = useState({
    title: "",
    content: "",
  });

  const [isVerified, setIsVerified] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    dispatch(startLoading());
    try {
      await axios.post(
        "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDt1BukIm408qBP5dRKlTbb1bxNcx1AXtw",
        {
          requestType: "VERIFY_EMAIL",
          idToken: auth.idToken,
        }
      );
      dispatch(
        triggerPopup({
          action: "email sent",
          msg: "Verification email sent, please check inbox or spam folder!",
        })
      );
    } catch (err) {
      const errMsg = err.response.data.error.message;
      console.log(errMsg);

      setAlert({
        title: "Error",
        content: errMsg,
      });
      setIsAlertOpen(true);
    }
    dispatch(stopLoading());
  };

  useEffect(() => {
    (async () => {
      dispatch(setLoadingBar(0));
      setIsLoading(true);
      try {
        if (auth.idToken) {
          const accountRes = await axios.post(
            "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyDt1BukIm408qBP5dRKlTbb1bxNcx1AXtw",
            {
              idToken: auth.idToken,
            }
          );
          dispatch(setLoadingBar(50));

          setIsVerified(accountRes.data.users[0].emailVerified);
        }
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
      dispatch(setLoadingBar(100));
    })();
  }, [isVerified, auth]);

  return (
    <div className="Account__main VerifyEmail">
      <h1>Verify Email</h1>
      {isLoading && (
        <ReactLoading
          width="2.5rem"
          height="2.5rem"
          className="loading"
          color={myProfile.pickedColor}
          type="cubes"
        />
      )}
      {!isLoading && typeof isVerified === "boolean" && isVerified && (
        <p style={{ color: presetColor.green }}>
          Your email address has been verified!{" "}
          <span>
            <TiTick />
          </span>
        </p>
      )}
      {!isLoading && typeof isVerified === "boolean" && !isVerified && (
        <>
          <p style={{ color: presetColor.red }}>
            You have not verified your email address!{" "}
            <span>
              <ImCross />
            </span>
          </p>
          <StyledBtn onClick={handleVerify} pickedColor={myProfile.pickedColor}>
            Verify Now
          </StyledBtn>
        </>
      )}
      {isAlertOpen && (
        <AlertModal
          isOpen={isAlertOpen}
          setIsOpen={setIsAlertOpen}
          type="failure"
          title={alert.title}
          content={alert.content}
          yesBtn="OK"
          onYes={() => {
            setIsAlertOpen(false);
          }}
        />
      )}
    </div>
  );
};

const ChangeEmail = () => {
  const err = (state, message) => ({ isErr: state, msg: message });

  const myProfile = useSelector(selectMyProfile);
  const auth = useSelector(selectAuth);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const blankAlert = {
    type: "",
    title: "",
    content: "",
    yesBtn: "",
    noBtn: "",
  };
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alert, setAlert] = useState({ ...blankAlert });

  const [oldEmailErr, setOldEmailErr] = useState(err(false, ""));
  const [oldEmail, setOldEmail] = useState("");

  const [newEmailErr, setNewEmailErr] = useState(err(false, ""));
  const [newEmail, setNewEmail] = useState("");

  const [repeatErr, setRepeatErr] = useState(err(false, ""));
  const [repeat, setRepeat] = useState("");

  const handleSuccess = (e) => {
    dispatch(logout());
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(startLoading());
    try {
      //Check current email validation
      const accountInfoRes = await axios.post(
        "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyDt1BukIm408qBP5dRKlTbb1bxNcx1AXtw",
        {
          idToken: auth.idToken,
        }
      );
      const currentEmail = accountInfoRes.data.users[0].email;
      if (oldEmail === currentEmail) {
        //Check 2 new email fields
        if (newEmail === repeat) {
          try {
            await axios.post(
              "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDt1BukIm408qBP5dRKlTbb1bxNcx1AXtw",
              {
                email: newEmail,
                idToken: auth.idToken,
                returnSecureToken: true,
              }
            );
            // const resData = changeRes.data;
            setAlert({
              type: "success",
              title: "Email Changed",
              content: "Please verify your new email and log in again!",
              yesBtn: "Logout",
            });
            setIsAlertOpen(true);
          } catch (err) {
            const errMsg = err.response.data.error.message;
            setAlert({
              type: "failure",
              title: "Error",
              content: errMsg,
              yesBtn: "Retry",
            });
            setIsAlertOpen(true);
          }
        } else {
          //2 new emails not match
          setAlert({
            type: "failure",
            title: "New Emails Not Match",
            content: "Please try again!",
            yesBtn: "OK",
          });
          setNewEmail("");
          setRepeat("");
          setNewEmailErr(err(false, ""));
          setRepeatErr(err(false, ""));
          setIsAlertOpen(true);
        }
      } else {
        //Incorrect current email
        setAlert({
          type: "failure",
          title: "Invalid Current Email",
          content: "Please try again!",
          yesBtn: "OK",
        });
        setOldEmail("");
        setOldEmailErr(err(false, ""));
        setIsAlertOpen(true);
      }
    } catch (err) {
      const errMsg = err.response.data.error.message;
      setAlert({
        type: "failure",
        title: "Error",
        content: errMsg,
        yesBtn: "Retry",
      });
      setIsAlertOpen(true);
    }

    dispatch(stopLoading());
  };

  const setEmailErr = (value, setErr) => {
    if (value) {
      if (!value.includes("@")) {
        setErr(err(true, "Invalid Email"));
      } else {
        if (/^[^@]+@[^@]+$/.test(value)) {
          setErr(err(false, ""));
        } else {
          setErr(err(true, "Invalid Email"));
        }
      }
    } else {
      setErr(err(false, ""));
    }
  };

  const handleOldEmailChange = (e) => {
    setOldEmail(e.target.value);
    setEmailErr(e.target.value, setOldEmailErr);
  };

  const handleNewEmailChange = (e) => {
    setNewEmail(e.target.value);
    setEmailErr(e.target.value, setNewEmailErr);
  };

  const handleRepeatChange = (e) => {
    setRepeat(e.target.value);
    if (e.target.value) {
      if (e.target.value !== newEmail) {
        setRepeatErr(err(true, "Emails not match!"));
      } else {
        setRepeatErr(err(false, ""));
      }
    } else {
      setRepeatErr(err(false, ""));
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="Account__main ChangeEmailForm">
        <h1>Change Your Account Email</h1>
        <TxtField
          error={oldEmailErr}
          onChange={handleOldEmailChange}
          value={oldEmail}
          label="Current Email"
          required
          autoFocus
          size="small"
        />
        <TxtField
          error={newEmailErr}
          onChange={handleNewEmailChange}
          value={newEmail}
          label="New Email"
          required
          size="small"
        />
        <TxtField
          error={repeatErr}
          onChange={handleRepeatChange}
          value={repeat}
          label="Repeat New Email"
          required
          size="small"
        />
        <StyledBtn pickedColor={myProfile.pickedColor}>Change</StyledBtn>
      </form>

      <AlertModal
        isOpen={isAlertOpen}
        setIsOpen={setIsAlertOpen}
        type={alert.type}
        title={alert.title}
        content={alert.content}
        yesBtn={alert.yesBtn}
        onYes={
          alert.type === "success"
            ? handleSuccess
            : () => {
                setIsAlertOpen(false);
              }
        }
        disableClose={alert.type === "success"}
      />
    </>
  );
};

const ChangePassword = () => {
  const dispatch = useDispatch();
  const myProfile = useSelector(selectMyProfile);
  const auth = useSelector(selectAuth);

  const navigate = useNavigate();

  const blankAlert = {
    type: "",
    title: "",
    content: "",
    yesBtn: "",
    noBtn: "",
  };
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alert, setAlert] = useState({ ...blankAlert });

  const err = (state, message) => ({ isErr: state, msg: message });

  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState(err(false, ""));

  const [confirmPw, setConfirmPw] = useState("");
  const [confirmPwErr, setConfirmPwErr] = useState(err(false, ""));

  const isPWValid = (pw) => {
    const lettersAndNumsCheck = /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(pw);
    const moreThanEight = pw.length >= 8;
    return lettersAndNumsCheck && moreThanEight;
  };

  const handleSuccess = (e) => {
    dispatch(logout());
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(startLoading());
    if (isPWValid(pw)) {
      if (pw === confirmPw) {
        try {
          await axios.post(
            "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDt1BukIm408qBP5dRKlTbb1bxNcx1AXtw",
            {
              idToken: auth.idToken,
              password: pw,
            }
          );
          setAlert({
            type: "success",
            title: "Password Changed",
            content: "Please log in again!",
            yesBtn: "Logout",
          });
          setIsAlertOpen(true);
        } catch (err) {
          const errMsg = err.response.data.error.message;
          setAlert({
            type: "failure",
            title: "Error",
            content: errMsg,
            yesBtn: "Retry",
          });
          setIsAlertOpen(true);
        }
      } else {
        setAlert({
          type: "failure",
          title: "Passwords Not Match",
          content: "Please try again!",
          yesBtn: "OK",
        });
        setPw("");
        setConfirmPw("");
        setPwErr(err(false, ""));
        setConfirmPwErr(err(false, ""));
        setIsAlertOpen(true);
      }
    } else {
      setAlert({
        type: "failure",
        title: "New Password Invalid",
        content:
          "Password must be more than 8 digits and contain (at least) a letter and a number!",
        yesBtn: "OK",
      });
      setPw("");
      setConfirmPw("");
      setPwErr(err(false, ""));
      setConfirmPwErr(err(false, ""));
      setIsAlertOpen(true);
    }

    dispatch(stopLoading());
  };

  const handlePwChange = (e) => {
    setPw(e.target.value);
    if (e.target.value) {
      const errorMsg =
        "Must be more than 8 digits and contain (at least) a letter and a number";

      if (isPWValid(e.target.value)) {
        setPwErr(err(false, ""));
      } else {
        setPwErr(err(true, errorMsg));
      }
    } else {
      setPwErr(err(false, ""));
    }
  };

  const handleConfirmChange = (e) => {
    e.preventDefault();
    setConfirmPw(e.target.value);
    //rePw does not match pw
    if (e.target.value !== pw) {
      setConfirmPwErr(err(true, "Passwords not match!"));
    } else {
      setConfirmPwErr(err(false, ""));
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="Account__main ChangePasswordForm"
      >
        <h1>Change Your Account Password</h1>
        <PasswordField
          error={pwErr}
          label="New Password *"
          value={pw}
          onChange={handlePwChange}
          required
          size="small"
          autoFocus
        />
        <PasswordField
          error={confirmPwErr}
          label="Confirm New Password *"
          value={confirmPw}
          onChange={handleConfirmChange}
          required
          size="small"
        />
        <StyledBtn pickedColor={myProfile.pickedColor}>Change</StyledBtn>
      </form>
      <AlertModal
        isOpen={isAlertOpen}
        setIsOpen={setIsAlertOpen}
        type={alert.type}
        title={alert.title}
        content={alert.content}
        yesBtn={alert.yesBtn}
        onYes={
          alert.type === "success"
            ? handleSuccess
            : () => {
                setIsAlertOpen(false);
              }
        }
        disableClose={alert.type === "success"}
      />
    </>
  );
};

const Account = () => {
  const auth = useSelector(selectAuth);
  const myProfile = useSelector(selectMyProfile);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    //Redirect
    if (location.pathname === "/account") {
      navigate("/account/info");
    }
  }, [location, navigate]);

  return (
    <StyledAccountSettings
      pickedColor={myProfile.pickedColor}
      className="Account"
    >
      <div className="Account__nav">
        <NavLink to="/account/info">Account Info</NavLink>
        <NavLink to="/account/verify">Verify Email</NavLink>
        <NavLink to="/account/change-email">Change Email</NavLink>
        <NavLink to="/account/change-password">Change Password</NavLink>
      </div>
      <Outlet />
    </StyledAccountSettings>
  );
};

export { ChangeEmail, ChangePassword, AccountInfo, VerifyEmail };
export default Account;
