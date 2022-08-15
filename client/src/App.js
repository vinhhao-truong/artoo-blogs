import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { io } from "socket.io-client";

import "./App.scss";
import "antd/dist/antd.min.css";

//Import fns
import { getBackURL } from "./fns/getURLPath";

//Import Layout
import MobileSubNav from "./components/layout/MobileSubNav";

//Import Components
import Navigation from "./components/layout/Navigation";
import StyledApp from "./components/styled-components/StyledApp";
import TopLoadingBar from "./components/fragments/TopLoadingBar";
import { BiCopyright } from "react-icons/bi";

//Import Pages
import Landing from "./pages/Landing";
import MyBlogs from "./pages/MyBlogs";
import NewsFeed from "./pages/NewsFeed";
import BlogDetail from "./pages/BlogDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import Account, {
  AccountInfo,
  ChangeEmail,
  ChangePassword,
  VerifyEmail,
} from "./pages/Account";

//Import Store
import { useSelector, useDispatch } from "react-redux";
import { initiateProfile, selectMyProfile } from "./store/user/myProfile-slice";
import { selectAuth, initiateToken } from "./store/user/auth-slice";

//Import modals
import PopupModal from "./components/modals/Popup";
import LoadingModal from "./components/modals/Loading";
import AlertModal from "./components/modals/Alert";
import ImgPreviewModal from "./components/modals/ImgPreview";

function App() {
  const auth = useSelector(selectAuth);
  const dispatch = useDispatch();
  const [isRefreshed, setIsRefreshed] = useState(false);

  //initiate the app if user refreshes but keep logging in
  const initiateMyProfile = async () => {
    try {
      const profileRes = await axios.get(getBackURL(`/users/${auth.uid}`));
      const myBlogsRes = await axios.get(
        getBackURL(`/users/${auth.uid}?q=myBlogs`)
      );
      const profileData = await profileRes.data.data;
      const myBlogsData = await myBlogsRes.data.data;
      await dispatch(
        initiateProfile({ ...profileData, myBlogs: [...myBlogsData] })
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    //check if localstorage has auth data
    if (auth.isAuth) {
      initiateMyProfile();
    }
  }, [auth.isAuth]);

  const exchangeIdTokenAndVerificationReq = async (refreshToken) => {
    try {
      const exchangeRes = await axios.post(
        "https://securetoken.googleapis.com/v1/token?key=AIzaSyDt1BukIm408qBP5dRKlTbb1bxNcx1AXtw",
        {
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }
      );
      const newRefreshToken = exchangeRes.data.refresh_token;
      const newIdToken = exchangeRes.data.id_token;
      dispatch(
        initiateToken({ idToken: newIdToken, refreshToken: newRefreshToken })
      );

      //Ask user to verify (if they haven't)
      const profileFirebaseRes = await axios.post(
        "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyDt1BukIm408qBP5dRKlTbb1bxNcx1AXtw",
        {
          idToken: newIdToken,
        }
      );
      if (profileFirebaseRes.data.users[0]) {
        if (!profileFirebaseRes.data.users[0].emailVerified) {
          alert('Please verify your email in "Account Settings"!');
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  //Prevent idToken expires (typically 1hr)
  useEffect(() => {
    //for first time start the session
    if (auth.idToken.length === 0 && auth.refreshToken.length > 0) {
      exchangeIdTokenAndVerificationReq(auth.refreshToken);
    }
    //Exchange every 20mins when user remain the session
    const requestIdToken = setInterval(() => {
      if (auth.refreshToken.length > 0) {
        exchangeIdTokenAndVerificationReq(auth.refreshToken);
      }
    }, 1200000);
    return () => {
      clearInterval(requestIdToken);
    };
  }, [auth]);

  useEffect(() => {
    if (isRefreshed) {
      setIsRefreshed(!isRefreshed);
    }
  }, [isRefreshed]);

  return (
    <BrowserRouter>
      <StyledApp uid={auth.uid}>
        <Navigation isLoggedIn={auth.isAuth} setIsRefreshed={setIsRefreshed} />
        <PopupModal />
        <TopLoadingBar />
        <LoadingModal />
        <ImgPreviewModal />
        {auth.isAuth ? (
          <Routes>
            {/* Authenticated */}
            <Route
              path="/"
              element={<NewsFeed isHomeRefreshed={isRefreshed} />}
            />
            <Route
              path="/my-blogs"
              element={<MyBlogs uid={auth.uid} />}
              exact
            />
            <Route path="/blog/:detail" element={<BlogDetail />} />
            <Route path="/profile/:uid" element={<Profile />} />
            <Route path="/account" element={<Account />}>
              <Route path="/account/info" element={<AccountInfo />} />
              <Route path="/account/verify" element={<VerifyEmail />} />
              <Route path="/account/change-email" element={<ChangeEmail />} />
              <Route
                path="/account/change-password"
                element={<ChangePassword />}
              />
            </Route>
          </Routes>
        ) : (
          <>
            <Routes>
              {/* Unauthenticated */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            
          </>
        )}

        <MobileSubNav isLoggedIn={auth.isAuth} />
      </StyledApp>
    </BrowserRouter>
  );
}

export default App;
