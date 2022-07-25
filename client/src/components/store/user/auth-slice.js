import { createSlice } from "@reduxjs/toolkit";

const auth = (isAth, token, uid) => ({
  isAuth: isAth,
  idToken: token,
  uid: uid,
});

const initialAuth = () => {
  const isLoggedIn = !!localStorage.getItem("ArtooBlogs-auth");
  if (isLoggedIn) {
    const { idToken, uid } = JSON.parse(
      localStorage.getItem("ArtooBlogs-auth")
    );
    return auth(true, idToken, uid);
  } else {
    return auth(false, "", "");
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuth(),
  reducers: {
    login: (state, action) => {
      const authenticated = auth(
        true,
        action.payload.idToken,
        action.payload.uid
      );
      localStorage.setItem("ArtooBlogs-auth", JSON.stringify(authenticated));
      return authenticated;
    },
    logout: (state) => {
      localStorage.removeItem("ArtooBlogs-auth");
      return auth(false, "", "");
    },
  },
});

export const { login, logout } = authSlice.actions;
export const selectAuth = (state) => state.auth;
export default authSlice.reducer;
