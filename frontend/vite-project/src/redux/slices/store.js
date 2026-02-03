import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice1.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
