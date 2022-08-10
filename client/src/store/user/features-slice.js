import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  popup: {
    isOpen: false,
    msg: "",
    action: "",
  },
  loadingBar: {
    progress: 0,
  },
  loading: false,
  imgPreview: {
    isOpen: false,
    title: "",
    imgUrl: ""
  }
};

const featuresSlice = createSlice({
  name: "features",
  initialState: initialState,
  reducers: {
    triggerPopup: (state, action) => {
      return {
        ...state,
        popup: { ...action.payload, isOpen: !state.popup.isOpen },
      };
    },
    setLoadingBar: (state, action) => {
      return { ...state, loadingBar: { progress: action.payload } };
    },
    startLoading: (state) => {
      return { ...state, loading: true };
    },
    stopLoading: (state) => {
      return { ...state, loading: false };
    },
    setImgPreview: (state, action) => {
      return {...state, imgPreview: {...action.payload}}
    }
  },
});

export const {
  triggerPopup,
  setLoadingBar,
  startLoading,
  stopLoading,
  setImgPreview
} = featuresSlice.actions;
export const selectFeatures = (state) => state.features;
export default featuresSlice.reducer;
