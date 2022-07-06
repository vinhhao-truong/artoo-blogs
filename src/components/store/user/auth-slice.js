import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuth: false,
  idToken: "",
  uid: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    login: (state, action) => {
      return { ...state, isAuth: true, idToken: action.payload.idToken, uid: action.payload.uid };
    },
    logout: (state) => {
      return { ...state, isAuth: false, idToken: '', uid: '' };
    },
  },
});

export const { login, logout } = authSlice.actions;
export const selectAuth = (state) => state.auth;
export default authSlice.reducer;
