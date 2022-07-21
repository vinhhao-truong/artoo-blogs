import { createSlice } from "@reduxjs/toolkit";

const initialState = []

const updateBlogs = (updatedData, uid) => {
  
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
    },
    deleteBlog: (state, action) => {
      return state.filter(blog => blog.blogId !== action.payload.id)
    },
  },
});

export const { addNewBlog, deleteBlog, initiateMyBlogs } = myBlogsSlice.actions;
export { initialState as blankBlogs };
export const selectMyBlogs = (state) => state.myBlogs;
export default myBlogsSlice.reducer;
