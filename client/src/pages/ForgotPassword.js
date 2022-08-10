import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertModal from "../components/modals/Alert";
import { TxtField } from "../components/styled-components/StyledTextField";

const ForgotPassword = () => {
  const err = (state, message) => ({ isErr: state, msg: message });
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState(err(false, ""));
  
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const initialAlert = {
    type: "",
    title: "",
    content: "",
    yesBtn: "",
    noBtn: ""
  }
  const [alert, setAlert] = useState({...initialAlert});

  const navigate = useNavigate();

  const handleYesAlertClick = (e) => {
    e.preventDefault();
    if (alert.type === "success") {
      setAlert({ ...initialAlert });
      navigate("/login");
    }
    if (alert.type === "failure") {
      setEmail("");
      setAlert({ ...initialAlert });
    }
    setIsAlertOpen(false);
  };

  const handleNoAlertClick = (e) => {
    e.preventDefault();
    if (alert.type === "failure") {
      setAlert({ ...initialAlert });
      navigate("/login")
      setIsAlertOpen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDt1BukIm408qBP5dRKlTbb1bxNcx1AXtw",
        {
          requestType: "PASSWORD_RESET",
          email: email,
        }
      );
      setAlert({
        type: "success",
        title: "Pasword Reset Sent!",
        content: "Please check your email inbox (or spam) folder!",
        yesBtn: "Back to Login"
      });
    } catch (err) {
      const errMsg = err.response.data.error.message;
      if (errMsg) {
        switch (errMsg) {
          case "INVALID_EMAIL":
            console.log("invalid");
            setAlert({
              type: "failure",
              title: "Invalid Email!",
              content: "Please try again!",
              yesBtn: "Retry",
              noBtn: "Back to Login"
            });
            break;
          case "EMAIL_NOT_FOUND":
            console.log("not found");
            setAlert({
              type: "failure",
              title: "Email Not Found!",
              content: "Please try again!",
              yesBtn: "Retry",
              noBtn: "Back to Login"
            });
            break;
          default:
        }
      }
    }
    setIsAlertOpen(true);
  };

  const handleEmailChange = (e) => {
    e.preventDefault();
    setEmail(e.target.value);

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

  return (
    <div className="ForgotPassword">
      <form className="ForgotPasswordForm" onSubmit={handleSubmit}>
        <h1>Type Your Email for Password Reset</h1>
        <TxtField
          error={emailErr}
          onChange={handleEmailChange}
          value={email}
          label="Email"
          required
          autoFocus
        />
        <button className="submitBtn pickedColorBg-hover" autoFocus>
          Reset
        </button>
      </form>
      <AlertModal
        isTwoWays={alert.type === "success" ? false : true}
        isOpen={isAlertOpen}
        setIsOpen={setIsAlertOpen}
        type={alert.type}
        title={alert.title}
        content={alert.content}
        onYes={handleYesAlertClick}
        onNo={handleNoAlertClick}
        yesBtn={alert.yesBtn}
        noBtn={alert.noBtn}
      />

    </div>
  );
};

export default ForgotPassword;
