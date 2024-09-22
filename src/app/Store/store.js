import { configureStore } from '@reduxjs/toolkit';
import {authSliceV , adminsliceV , HonorsSliceV , productSliceV , homePageV , bannerSliceV} from './slice';
import { useDispatch, useSelector, useStore } from 'react-redux'
export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authSliceV,
      product : productSliceV,
      banner : bannerSliceV,
      homePage : homePageV,
      admin: adminsliceV,
      honors : HonorsSliceV,
    }
  })
}

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes()
export const useAppSelector = useSelector.withTypes()
export const useAppStore = useStore.withTypes()