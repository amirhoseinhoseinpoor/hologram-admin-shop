// src/app/Store/store.js

import { configureStore } from '@reduxjs/toolkit';
import { authSliceV, adminsliceV, HonorsSliceV, productSliceV, homePageV } from './slice';
import { useDispatch, useSelector, useStore } from 'react-redux';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authSliceV,
      product: productSliceV,
      // banner: bannerSliceV,
      homePage: homePageV,
      // admin: adminsliceV,
      honors: HonorsSliceV,
    },
  });
};

// Create and export the store instance
const store = makeStore();

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
export const useAppStore = () => useStore();

export default store;
