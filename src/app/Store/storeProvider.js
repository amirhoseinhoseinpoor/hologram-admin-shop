// src/app/Store/storeProvider.js

"use client";
import { Provider } from "react-redux";
import store from "./store"; // Import the exported store instance
import AuthBootstrap from "../Components/AuthBootstrap";

export default function StoreProvider({ children }) {
  return (
    <Provider store={store}>
      <AuthBootstrap />
      {children}
    </Provider>
  );
}
