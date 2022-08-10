import { createSlice } from "@reduxjs/toolkit";

const auth = (isAth, refreshToken, uid) => ({
  isAuth: isAth,
  refreshToken: refreshToken,
  uid: uid,
  idToken: "",
});

const initialAuth = () => {
  const isLoggedIn = !!localStorage.getItem("ArtooBlogs-auth");
  if (isLoggedIn) {
    const { refreshToken, uid } = JSON.parse(
      localStorage.getItem("ArtooBlogs-auth")
    );
    return auth(true, refreshToken, uid);
  } else {
    return auth(false, "", "");
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuth(),
  reducers: {
    initiateToken: (state, action) => {
      return {
        ...state,
        idToken: action.payload.idToken,
        refreshToken: action.payload.refreshToken,
      };
    },
    login: (state, action) => {
      const authenticated = auth(
        true,
        action.payload.refreshToken,
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

export const { login, logout, initiateToken } = authSlice.actions;
export const selectAuth = (state) => state.auth;
export default authSlice.reducer;
