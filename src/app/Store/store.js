import { configureStore } from '@reduxjs/toolkit';
import {authSliceV , adminsliceV , HonorsSliceV , productSliceV} from './slice';
import { useDispatch, useSelector, useStore } from 'react-redux'
export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authSliceV,
      product : productSliceV,
      admin: adminsliceV,
      honors : HonorsSliceV,
    }
  })
}

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes()
export const useAppSelector = useSelector.withTypes()
export const useAppStore = useStore.withTypes()