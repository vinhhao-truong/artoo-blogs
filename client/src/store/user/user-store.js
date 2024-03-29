import { configureStore } from '@reduxjs/toolkit';
import myProfileReducer from "./myProfile-slice";
import authReducer from "./auth-slice";
import featuresReducer from "./features-slice";

const userStore = configureStore({
  reducer: {
    auth: authReducer,
    myProfile: myProfileReducer,
    features: featuresReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['your/action/type'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
    }),
})

export default userStore;