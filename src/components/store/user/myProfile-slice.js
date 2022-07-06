import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  uid: "",
  tokenId: "",
  email: "",
  firstName: "Arnold",
  lastName: "",
  dob: "",
  profilePic:
    "https://images.pexels.com/photos/8652888/pexels-photo-8652888.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
  pickedColor: "#3aafa9"
}

const myProfileSlice = createSlice({
  name: "myProfile",
  initialState: initialState,
  reducers: {
    initiateProfile: (state, action) => {
      return {...action.payload}
    }
  }

})

export const { initiateProfile } = myProfileSlice.actions;
export {initialState as blankProfile}
export const selectMyProfile = state => state.myProfile;
export default myProfileSlice.reducer