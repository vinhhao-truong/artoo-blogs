import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "../store/user/auth-slice";

const useConfirmAuth = (authCallback, unAuthCallback) => {
  const auth = useSelector(selectAuth);

  useEffect(() => {
    if (auth.isAuth) {
      authCallback();
    } else {
      unAuthCallback();
    }
  }, [auth, authCallback, unAuthCallback]);
};

export default useConfirmAuth;
