import { createSlice } from "@reduxjs/toolkit";
import {
  login,
  logout,
  sendAdminLoginOtp,
  verifyAdminLoginOtp,
  Adduser,
  list,
  homePageVideo,
  bannerdata,
  addBanner,
  uploadFile,
} from "./thunks";

// start auth slice

const authinitialState = {
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
  initialState: authinitialState,
  reducers: {
    setUserData: (state, action) => {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
      state.gender = action.payload.gender;
      state.permissions = action.payload.permissions;
    },
    resetToken: (state) => {
      state.token = null;
      state.firstName = null;
      state.lastName = null;
      state.phoneNumber = null;
    },
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
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.token = null;
      })
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
export const { resetToken } = authSlice.actions;
export const { setUserData } = authSlice.actions;
export const signUpSattus = (state) => state.auth.signUpSattus;
export const otpSent = (state) => state.auth.otpSent;
export const otpUsername = (state) => state.auth.otpUsername;
export const loading = (state) => state.auth.loading;
export const error = (state) => state.auth.error;

// end auth slice

// start product slice

const peoductinitialState = {
  productListData: null,
  // uploadedFiles: {},
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState: peoductinitialState,
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
    // .addCase(uploadFile.pending, (state) => {
    //   state.loading = true;
    //   state.error = null;
    // })
    // .addCase(uploadFile.fulfilled, (state, action) => {
    //   state.loading = false;
    //   state.uploadedFiles[action.meta.arg.name] = action.payload;
    // })
    // .addCase(uploadFile.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.error.message;
    // });
  },
});

export const productSliceV = productSlice.reducer;
export const productListData = (state) => state.product.productListData;

// end product slice

// start Banner

// const bannerinitialState = {
//   bannerImg: null,
//   loading: false,
//   error: null,
// };

// const bannerSlice = createSlice({
//   name: "banner",
//   initialState: bannerinitialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(bannerdata.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(bannerdata.fulfilled, (state, action) => {
//         state.loading = false;
//         state.bannerImg = action.payload;
//       })
//       .addCase(bannerdata.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       });
//     // .addCase(addBanner.pending, (state) => {
//     //   state.loading = true;
//     //   state.error = null;
//     // })
//     // .addCase(addBanner.fulfilled, (state, action) => {
//     //   state.loading = false;
//     //   state.bannerImg = action.payload;
//     // })
//     // .addCase(addBanner.rejected, (state, action) => {
//     //   state.loading = false;
//     //   state.error = action.error.message;
//     // })
//   },
// });

// export const bannerSliceV = bannerSlice.reducer;
// export const bannerImg = (state) => state.banner.bannerImg;

// end Banner

// start HomePageVideo

const homePageinitialState = {
  homeVideoFileName: null,
  loading: false,
  error: null,
};

const homePage = createSlice({
  name: "homePage",
  initialState: homePageinitialState,
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

const AdminInitialState = {
  banner: null,
  loading: false,
  error: null,
};

// const adminSlice = createSlice({
//   name: "users",
//   initialState: AdminInitialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder

//       .addCase(Adduser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(Adduser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.banner = action.payload;
//       })
//       .addCase(Adduser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       });
//   },
// });

// export const adminsliceV = adminSlice.reducer;
// export const banner = (state) => state.admin.banner;

const HonorsInitialState = {
  honors: [],
  status: "idle",
  errorHonors: null,
};

const HonorsSlice = createSlice({
  name: "honors",
  initialState: HonorsInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder;
  },
});

export const HonorsSliceV = HonorsSlice.reducer;
export const honors = (state) => state.honors.honors;
export const status = (state) => state.honors.status;
export const errorHonors = (state) => state.honors.errorHonors;
