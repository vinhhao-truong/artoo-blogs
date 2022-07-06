import { createSlice } from "@reduxjs/toolkit";

const initialState = []

const updateBlogs = (updatedData, uid) => {
  const LOCAL_DATA = JSON.parse(localStorage.getItem(`AB(${uid})`));
  localStorage.setItem(`AB(${uid})`, JSON.stringify({
    ...LOCAL_DATA,
    myBlogs: [...updatedData]
  }))
}

const myBlogsSlice = createSlice({
  name: "myBlogs",
  initialState: initialState,
  reducers: {
    initiateMyBlogs: (state, action) => {
      return [...action.payload]
    },
    addNewBlog: (state, action) => {
      state.push(action.payload.newBlog);
      updateBlogs(state, action.payload.uid);
    },
    deleteBlog: (state, action) => {
      updateBlogs(state.filter(blog => blog.blogId !== action.payload.id), action.payload.uid)
      return state.filter(blog => blog.blogId !== action.payload.id)
    },
  },
});

export const { addNewBlog, deleteBlog, initiateMyBlogs } = myBlogsSlice.actions;
export { initialState as blankBlogs };
export const selectMyBlogs = (state) => state.myBlogs;
export default myBlogsSlice.reducer;
