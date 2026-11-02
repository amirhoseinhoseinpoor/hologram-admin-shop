// src/app/Store/store.js

import { configureStore } from "@reduxjs/toolkit";
import { authSliceV, HonorsSliceV, productSliceV, homePageV } from "./slice";
import { saveSession, clearSession } from "../utils/authStorage";
import { useDispatch, useSelector, useStore } from "react-redux";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authSliceV,
      product: productSliceV,
      homePage: homePageV,
      honors: HonorsSliceV,
    },
  });
};

// Create and export the store instance
const store = makeStore();

// Use throughout your app instead of plain `useDispatch` and `useSelector`
// Persist the auth slice (client only). Nothing is written before the saved
// session has been restored, so a refresh can never wipe it.
if (typeof window !== "undefined") {
  let lastAuth;
  store.subscribe(() => {
    const auth = store.getState().auth;
    if (auth === lastAuth || !auth.authReady) return;
    lastAuth = auth;
    if (auth.token) saveSession(auth);
    else clearSession();
  });
}

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
export const useAppStore = () => useStore();

export default store;
