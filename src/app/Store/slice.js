import { createSlice } from "@reduxjs/toolkit";
import {
  logout,
  sendAdminLoginOtp,
  verifyAdminLoginOtp,
  list,
  homePageVideo,
  refreshSession,
} from "./thunks";

// start auth slice

const authInitialState = {
  // false until the persisted session has been read from storage (client only)
  authReady: false,
  token: null,
  firstName: null,
  lastName: null,
  phoneNumber: null,
  code: null,
  email: null,
  gender: null,
  permissions: null,

  // OTP login
  otpSent: false,
  otpUsername: null,

  signUpSattus: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: authInitialState,
  reducers: {
    setUserData: (state, action) => {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
      state.gender = action.payload.gender;
      state.permissions = action.payload.permissions;
    },
    hydrateAuth: (state, action) => {
      const saved = action.payload;
      if (saved?.token) {
        state.token = saved.token;
        state.firstName = saved.firstName;
        state.lastName = saved.lastName;
        state.phoneNumber = saved.phoneNumber;
        state.code = saved.code;
        state.email = saved.email;
        state.gender = saved.gender;
        state.permissions = saved.permissions;
      } else {
        state.token = null;
        state.firstName = null;
        state.lastName = null;
        state.phoneNumber = null;
        state.code = null;
        state.email = null;
        state.gender = null;
        state.permissions = null;
      }
      state.authReady = true;
    },
    resetToken: () => ({ ...authInitialState, authReady: true }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendAdminLoginOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(sendAdminLoginOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.otpSent = true;
        state.otpUsername = action.payload.username;
      })

      .addCase(sendAdminLoginOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(verifyAdminLoginOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(verifyAdminLoginOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.token = action.payload.token;

        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.phoneNumber = action.payload.phoneNumber;
        state.code = action.payload.code;
        state.gender = action.payload.gender;
        state.permissions = action.payload.permissions;
        state.email = action.payload.email;

        state.otpSent = false;
        state.otpUsername = null;
      })

      .addCase(verifyAdminLoginOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(refreshSession.fulfilled, (state, action) => {
        if (state.token) state.permissions = action.payload.permissions;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, () => ({
        ...authInitialState,
        authReady: true,
      }))
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Logout failed";
      });
  },
});

export const authSliceV = authSlice.reducer;
export const token = (state) => state.auth.token;
export const firstName = (state) => state.auth.firstName;
export const lastName = (state) => state.auth.lastName;
export const phoneNumber = (state) => state.auth.phoneNumber;
export const code = (state) => state.auth.code;
export const email = (state) => state.auth.email;
export const gender = (state) => state.auth.gender;
export const permissions = (state) => state.auth.permissions;
export const { resetToken, hydrateAuth, setUserData } = authSlice.actions;
export const authReady = (state) => state.auth.authReady;
export const signUpSattus = (state) => state.auth.signUpSattus;
export const otpSent = (state) => state.auth.otpSent;
export const otpUsername = (state) => state.auth.otpUsername;
export const loading = (state) => state.auth.loading;
export const error = (state) => state.auth.error;

// end auth slice

// start product slice

const productInitialState = {
  productListData: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState: productInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(list.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(list.fulfilled, (state, action) => {
        state.loading = false;
        state.productListData = action.payload;
      })
      .addCase(list.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const productSliceV = productSlice.reducer;
export const productListData = (state) => state.product.productListData;

// end product slice

// start HomePageVideo

const homePageInitialState = {
  homeVideoFileName: null,
  loading: false,
  error: null,
};

const homePage = createSlice({
  name: "homePage",
  initialState: homePageInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(homePageVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(homePageVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.homeVideoFileName = action.payload;
      })
      .addCase(homePageVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const homePageV = homePage.reducer;
export const homeVideoFileName = (state) => state.homePage.homeVideoFileName;

// end HomePageVideo

// start Honors

const HonorsInitialState = {
  honors: [],
  status: "idle",
  errorHonors: null,
};

const HonorsSlice = createSlice({
  name: "honors",
  initialState: HonorsInitialState,
  reducers: {},
});

export const HonorsSliceV = HonorsSlice.reducer;
export const honors = (state) => state.honors.honors;
export const status = (state) => state.honors.status;
export const errorHonors = (state) => state.honors.errorHonors;

// end Honors
