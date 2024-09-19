import { createSlice } from "@reduxjs/toolkit";
import { login, logout, Adduser , updateHonor , list } from "./thunks";

const authinitialState = {
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: authinitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.token = null;
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      });
  },
});

// export default authSlice.reducer;
export const authSliceV = authSlice.reducer;
export const token = (state) => state.auth.token;
export const loading = (state) => state.auth.loading;
export const error = (state) => state.auth.error;



const peoductinitialState = {
  data: null,
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
        state.data = action.payload;
      })
      .addCase(list.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
  },
});

export const productSliceV = productSlice.reducer;
export const data = (state) => state.product.data;





const AdminInitialState = {
  banner: null,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "users",
  initialState: AdminInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(Adduser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(Adduser.fulfilled, (state, action) => {
        state.loading = false;
        state.banner = action.payload;
      })
      .addCase(Adduser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const adminsliceV = adminSlice.reducer;
export const banner = (state) => state.admin.banner;



const HonorsInitialState = {
  honors : [],
  status : 'idle',
  errorHonors : null,
};

const HonorsSlice = createSlice({
  
  name : "honors",
  initialState : HonorsInitialState,
  reducers : {},
  extraReducers : (builder) => {
    builder
    .addCase(updateHonor.pending, (state) =>{
      state.status = 'loading';
    })
    .addCase(updateHonor.fulfilled, (state , action) => {
      state.status = 'succeeded';
      const index = state.honors.findIndex(honor => honor.id === action.payload.id);
      if (index !== -1) {
        state.honors[index] = action.payload;
      }
    })
    .addCase(updateHonor.rejected, (state, action) => {
      state.status = 'failed';
      state.errorHonors = action.payload;
    });
  }
})

export const HonorsSliceV = HonorsSlice.reducer;
export const honors = (state) => state.honors.honors;
export const status = (state) => state.honors.status;
export const errorHonors = (state) => state.honors.errorHonors;