import { configureStore } from '@reduxjs/toolkit';
import myBlogsReducer from "./myBlogs-slice";
import myProfileReducer from "./myProfile-slice";
import authReducer from "./auth-slice";

const userStore = configureStore({
  reducer: {
    auth: authReducer,
    myBlogs: myBlogsReducer,
    myProfile: myProfileReducer
  }
})

export default userStore;