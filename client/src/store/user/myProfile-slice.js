import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  email: "",
  firstName: "",
  lastName: "",
  nickname: "",
  bio: "",
  dob: "",
  profileImg: "",
  pickedColor: "",
  myBlogs: [], //to handle front end rendering
};

const myProfileSlice = createSlice({
  name: "myProfile",
  initialState: initialState,
  reducers: {
    initiateProfile: (state, action) => {
      return { ...initialState, ...action.payload };
    },
    updateProfile: (state, action) => {
      console.log({ ...action.payload.newProfile });

      return { ...action.payload.newProfile };
    },
    addBlog: (state, action) => {
      state.myBlogs.push(action.payload.newBlog);
    },
    deleteBlog: (state, action) => {
      return {
        ...state,
        myBlogs: state.myBlogs.filter(
          (blog) => blog._id !== action.payload.blogId
        ),
      };
    },
    updateBlog: (state, action) => {
      const myBlogsRemovedById = state.myBlogs.filter(
        (blog) => blog._id !== action.payload.updatedBlog._id
      );
      return {
        ...state,
        myBlogs: [...myBlogsRemovedById, action.payload.updatedBlog],
      };
    },
  },
});

export const {
  initiateProfile,
  updateProfile,
  addBlog,
  deleteBlog,
  updateBlog,
} = myProfileSlice.actions;
export { initialState as blankProfile };
export const selectMyProfile = (state) => state.myProfile;
export default myProfileSlice.reducer;
