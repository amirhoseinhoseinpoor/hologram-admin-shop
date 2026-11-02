import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACK_END_SERVER;

const authHeader = (token) => ({
  Authorization: token ? `Bearer ${token}` : "",
});

// auterezation
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    const { username, password } = credentials;

    try {
      const response = await axios.post(`${API_URL}/auth/adminLogin`, {
        username,
        password,
      });

      return {
        username,
        message: response.data.message,
      };
    } catch (error) {
      if (error.response?.status === 400) {
        return thunkAPI.rejectWithValue(
          error.response.data?.message || "شماره همراه یا پسورد اشتباه است",
        );
      }

      return thunkAPI.rejectWithValue("مشکلی به وجود آمد لطفا بعدا تلاش کنید");
    }
  },
);

export const sendAdminLoginOtp = createAsyncThunk(
  "auth/sendAdminLoginOtp",
  async ({ username, password }, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/auth/adminLogin`, {
        username,
        password,
      });

      return {
        username,
        message: response.data?.message,
      };
    } catch (error) {
      console.error("sendAdminLoginOtp error:", error.response?.data || error);

      if (error.response?.status === 400) {
        return thunkAPI.rejectWithValue("شماره همراه یا پسورد اشتباه است");
      }

      return thunkAPI.rejectWithValue("مشکلی به وجود آمد، لطفا بعدا تلاش کنید");
    }
  },
);

export const verifyAdminLoginOtp = createAsyncThunk(
  "auth/verifyAdminLoginOtp",
  async ({ username, otp }, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/auth/adminLogin-otp`, {
        username,
        otp,
      });

      const token = response.data.token;

      if (!token) {
        return thunkAPI.rejectWithValue("توکن دریافت نشد");
      }

      const response2 = await axios.post(
        `${API_URL}/users`,
        { username },
        {
          headers: authHeader(token),
        },
      );

      const user = response2.data[0];

      const gettingRole = await axios.get(
        `${API_URL}/users/${user.code}/permissions`,
        {
          headers: authHeader(token),
        },
      );

      return {
        token,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.username,
        code: user.code,
        email: user.email,
        gender: user.gender,
        permissions: gettingRole.data,
      };
    } catch (error) {
      console.error(
        "verifyAdminLoginOtp error:",
        error.response?.data || error,
      );

      if (error.response?.status === 400) {
        return thunkAPI.rejectWithValue(
          error.response.data?.message || "کد تایید اشتباه یا منقضی شده است",
        );
      }

      return thunkAPI.rejectWithValue("مشکلی به وجود آمد، لطفا بعدا تلاش کنید");
    }
  },
);

// start roles

export const gettingAllRoles = createAsyncThunk(
  "roles/gettingAllRoles",
  async (_, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;

    try {
      const response = await axios.get(`${API_URL}/roles`, {
        headers: authHeader(token),
      });
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("error");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const createPermissionRole = createAsyncThunk(
  "roles/createPermissionRole",
  async ({ name, permissionIds }, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;

    try {
      const response = await axios.post(
        `${API_URL}/roles`,
        {
          name,
          permissionIds,
        },
        {
          headers: authHeader(token),
        },
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue(error?.response);
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const updatePermissionRole = createAsyncThunk(
  "roles/updatePermissionRole",
  async ({ roleId, permissionIds }, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;

    try {
      const response = await axios.patch(
        `${API_URL}/roles/update-permissions`,
        {
          roleId,
          permissionIds,
        },
        {
          headers: authHeader(token),
        },
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("error");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const deleteRole = createAsyncThunk(
  "roles/deleteRole",
  async ({ id }, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;

    try {
      const response = await axios.delete(`${API_URL}/roles/${id}`, {
        headers: authHeader(token),
      });
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("error");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

// end roles

export const addUser = createAsyncThunk(
  "userManagment/addUser",
  async (credentials, thunkAPI) => {
    const { firstName, lastName, username, password, domain, roleId } =
      credentials;

    const { token } = thunkAPI.getState().auth;

    try {
      const response = await axios.post(
        `${API_URL}/auth/createUserByAdmin`,
        {
          firstName,
          lastName,
          username,
          password,
          domain,
          ...(roleId && roleId.length > 0 && { roleIds: roleId }),
        },
        {
          headers: authHeader(token),
        },
      );
      const signUpSattus = response.data.message;
      return signUpSattus;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("شما قبلا ثبت نام کرده اید");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

// user managment

export const getuser = createAsyncThunk(
  "userManagment/getuser",
  async ({ domain }, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;

    try {
      const response = await axios.get(
        `${API_URL}/users/allUser?domain=${domain}`,
        {
          headers: authHeader(token),
        },
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("error");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const editUser = createAsyncThunk(
  "userManagment/editUser",
  async (
    { code, firstName, lastName, username, active, domain, roleIds },
    thunkAPI,
  ) => {
    const { token } = thunkAPI.getState().auth;

    try {
      const response = await axios.patch(
        `${API_URL}/users/${code}`,
        {
          firstName,
          lastName,
          username,
          active,
          domain,
          roleIds,
        },
        {
          headers: authHeader(token),
        },
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("error");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const editUserPassword = createAsyncThunk(
  "userManagment/editUserPassword",
  async ({ code, password }, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;

    try {
      const response = await axios.patch(
        `${API_URL}/users/${code}`,
        {
          password,
        },
        {
          headers: authHeader(token),
        },
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("error");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const deleteUser = createAsyncThunk(
  "userManagment/deleteUser",
  async ({ code }, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;

    try {
      const response = await axios.delete(`${API_URL}/users/${code}`, {
        headers: authHeader(token),
      });
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("error");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

// Product

export const uploadFile = createAsyncThunk(
  "product/uploadFile ",
  async ({ file, tag, type, isPublic }, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;

    try {
      const formData = new FormData();
      formData.append("tag", tag);
      formData.append("type", String(type)); // Convert to string
      formData.append("isPublic", String(isPublic)); // Convert to string
      formData.append("files", file);

      const response = await axios.post(`${API_URL}/system/upload`, formData, {
        headers: authHeader(token),
      });

      return response.data[0].fileName;
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const fetchPrivateImage = createAsyncThunk(
  "image/fetchPrivateImage",
  async ({ filename }, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;

    try {
      const response = await axios.post(
        `${API_URL}/system/download/${filename}`,
        {}, // No body is needed for this request
        {
          headers: authHeader(token),
          responseType: "blob",
        },
      );

      const imageObjectURL = URL.createObjectURL(response.data);

      return imageObjectURL;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("Error from server");
      } else {
        return thunkAPI.rejectWithValue(
          "Something went wrong, please try again later",
        );
      }
    }
  },
);

export const productpot = createAsyncThunk(
  "product/productpot",
  async (productData, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;
    try {
      const response = await axios.post(`${API_URL}/product`, productData, {
        headers: authHeader(token),
      });
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const productEdit = createAsyncThunk(
  "product/productEdit",
  async ({ productData, code }, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;
    try {
      const response = await axios.patch(
        `${API_URL}/product/${code}`,
        productData,
        {
          headers: authHeader(token),
        },
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const countProduct = createAsyncThunk(
  "product/countProduct",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/product/count`);
      const data = response.data;

      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const list = createAsyncThunk(
  "product/list",
  async ({ page, limit }, thunkAPI) => {
    try {
      const response = await axios.get(
        `${API_URL}/product/listPaginated?page=${page}&limit=${limit}`,
      );
      const data = response.data;

      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const prodNameAndNav = createAsyncThunk(
  "product/prodNameAndNav",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/product/names-navIds`);
      const data = response.data;

      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const deleted = createAsyncThunk(
  "product/deleted",
  async ({ code, name }, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;

    try {
      const response2 = await axios.get(
        `${API_URL}/system/download/list/${name}`,
      );

      const listOfDelete = response2.data;
      // remove every uploaded file of this product; a failed cleanup must not
      // block deleting the product itself
      await Promise.allSettled(
        listOfDelete.map((item) =>
          axios.delete(`${API_URL}/system/download/${item.fileName}`, {
            headers: authHeader(token),
          }),
        ),
      );

      const response = await axios.delete(`${API_URL}/product/${code}`, {
        headers: authHeader(token),
      });
      const data = response.data;

      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

// end product

// start HomePageVideo

export const homePageVideo = createAsyncThunk(
  "homePage/video",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/video/list`);

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const videopot = createAsyncThunk(
  "homePage/videopot",
  async (productData, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;
    try {
      const response = await axios.post(`${API_URL}/video`, productData, {
        headers: authHeader(token),
      });
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const videoEdit = createAsyncThunk(
  "homePage/videoEdit",
  async ({ media, code }, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;
    try {
      const response = await axios.patch(`${API_URL}/video/${code}`, media, {
        headers: authHeader(token),
      });
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const HomePageVideoDeleted = createAsyncThunk(
  "homePage/HomePageVideoDeleted",
  async ({ code }, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;

    try {
      const response = await axios.delete(
        `${API_URL}/video/${code}`,

        {
          headers: authHeader(token),
        },
      );
      const data = response.data;

      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

// end HomePageVideo

// start honors

export const honorsList = createAsyncThunk(
  "honor/honorsList",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/honors/list`);
      const data = response.data;

      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const honorspot = createAsyncThunk(
  "homePage/honorspot",
  async (formData, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;
    try {
      const response = await axios.post(`${API_URL}/honors`, formData, {
        headers: authHeader(token),
      });
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const honorsEdit = createAsyncThunk(
  "homePage/honorsEdit",
  async ({ honor, code }, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;
    try {
      const response = await axios.patch(`${API_URL}/honors/${code}`, honor, {
        headers: authHeader(token),
      });
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const honorsDeleted = createAsyncThunk(
  "homePage/honorsDeleted",
  async ({ code }, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;

    try {
      const response = await axios.delete(
        `${API_URL}/honors/${code}`,

        {
          headers: authHeader(token),
        },
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);
// end honors

// start exhibition

export const exhibitionList = createAsyncThunk(
  "exhibition/exhibitionList",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/exhibition/list`);
      const data = response.data;

      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const exhibitionpot = createAsyncThunk(
  "exhibition/exhibitionpot",
  async (formData, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;
    try {
      const response = await axios.post(`${API_URL}/exhibition`, formData, {
        headers: authHeader(token),
      });
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const exhibitionEdit = createAsyncThunk(
  "exhibition/exhibitionEdit",
  async ({ exhibition, code }, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;
    try {
      const response = await axios.patch(
        `${API_URL}/exhibition/${code}`,
        exhibition,
        {
          headers: authHeader(token),
        },
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const exhibitionDeleted = createAsyncThunk(
  "exhibition/exhibitionDeleted",
  async ({ code }, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;

    try {
      const response = await axios.delete(
        `${API_URL}/exhibition/${code}`,

        {
          headers: authHeader(token),
        },
      );
      const data = response.data;

      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

// end exhibition

// start banner

export const bannerList = createAsyncThunk(
  "banner/bannerList",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/banner/list`);
      const data = response.data;

      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const bannerpot = createAsyncThunk(
  "banner/bannerpot",
  async (formData, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;
    try {
      const response = await axios.post(`${API_URL}/banner`, formData, {
        headers: authHeader(token),
      });
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const bannerEdit = createAsyncThunk(
  "banner/bannerEdit",
  async ({ banner, code }, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;
    try {
      const response = await axios.patch(`${API_URL}/banner/${code}`, banner, {
        headers: authHeader(token),
      });
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const bannerDeleted = createAsyncThunk(
  "banner/bannerDeleted",
  async ({ code }, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;

    try {
      const response = await axios.delete(
        `${API_URL}/banner/${code}`,

        {
          headers: authHeader(token),
        },
      );
      const data = response.data;

      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

// end banner

// start header
export const HeaderList = createAsyncThunk(
  "Header/HeaderList",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/header/find`);
      const data = response.data;

      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const headerEdit = createAsyncThunk(
  "header/headerEdit",
  async ({ header }, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;
    try {
      const response = await axios.patch(`${API_URL}/header`, header, {
        headers: authHeader(token),
      });
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

// end header

// start blog

export const blogsList = createAsyncThunk(
  "blog/blogsList",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/blogs/list`);
      const data = response.data;

      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const blogspot = createAsyncThunk(
  "blog/blogspot",
  async (formData, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;
    try {
      const response = await axios.post(`${API_URL}/blogs`, formData, {
        headers: authHeader(token),
      });
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const blogsEdit = createAsyncThunk(
  "blog/blogsEdit",
  async ({ content, code }, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;
    try {
      const response = await axios.patch(`${API_URL}/blogs/${code}`, content, {
        headers: authHeader(token),
      });
      const data = response.data;

      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const blogsDeleted = createAsyncThunk(
  "blog/blogsDeleted",
  async ({ code }, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;

    try {
      const response = await axios.delete(
        `${API_URL}/blogs/${code}`,

        {
          headers: authHeader(token),
        },
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);
// end blog

// start order

export const Countorders = createAsyncThunk(
  "order/Countorders",
  async ({ status }, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;

    try {
      let url = `${API_URL}/order/count`;

      // If status is provided, append it to the URL
      if (status !== undefined) {
        url += `?status=${status}`;
      }

      const response = await axios.get(url, {
        headers: authHeader(token),
      });

      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const sendNewMessage = createAsyncThunk(
  "order/sendNewMessage",
  async ({ code, newMessageSend }, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;

    try {
      const response = await axios.patch(
        `${API_URL}/order/chat/${code}`,
        {
          chat: newMessageSend,
        },
        {
          headers: authHeader(token),
        },
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const listorders = createAsyncThunk(
  "order/list",
  async (
    { status, sortBy = "createdAt", sortOrder = "desc", page = 1, limit = 10 },
    thunkAPI,
  ) => {
    const { token } = thunkAPI.getState().auth;

    try {
      const response = await axios.get(`${API_URL}/order/list`, {
        params: { status, sortBy, sortOrder, page, limit },
        headers: authHeader(token),
      });
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const whosOrder = createAsyncThunk(
  "order/whosOrder",
  async ({ id }, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;

    try {
      const response = await axios.post(
        `${API_URL}/users`,
        { id },
        {
          headers: authHeader(token),
        },
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ code, status }, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;

    try {
      const response = await axios.patch(
        `${API_URL}/order/status/${code}/${status}`,
        {},
        {
          headers: authHeader(token),
        },
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const chatImageSend = createAsyncThunk(
  "order/chatImageSend",
  async ({ code, chatImage }, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;

    try {
      const response = await axios.patch(
        `${API_URL}/order/chatImage/${code}`,
        {
          chatImage,
        },
        {
          headers: authHeader(token),
        },
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const updateFirstStep = createAsyncThunk(
  "order/updateFirstStep",
  async ({ code, dataToSend }, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;
    try {
      const response = await axios.post(
        `${API_URL}/order/edit/request/${code}`,
        dataToSend,
        {
          headers: authHeader(token),
        },
      );

      const data = response.data;

      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const requestAdminCommnet = createAsyncThunk(
  "order/requestAdminCommnet",
  async ({ code, reqComment }, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;

    try {
      const response = await axios.patch(
        `${API_URL}/order/request/${code}/comment`,
        {
          reqComment,
        },
        {
          headers: authHeader(token),
        },
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const sendingSecondStep = createAsyncThunk(
  "order/sendingSecondStep",
  async ({ code, sendingFinalData }, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;
    try {
      const response = await axios.patch(
        `${API_URL}/order/document/${code}`,
        {
          document: sendingFinalData,
        },
        {
          headers: authHeader(token),
        },
      );

      const data = response.data;

      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const paymentStepData = createAsyncThunk(
  "order/paymentStepData",
  async ({ code, payment }, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;

    try {
      const response = await axios.patch(
        `${API_URL}/order/payment/${code}`,
        {
          payment,
        },
        {
          headers: authHeader(token),
        },
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const sendingAdressStep = createAsyncThunk(
  "order/sendingAdressStep",
  async ({ code, finalData }, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;
    try {
      const response = await axios.patch(
        `${API_URL}/order/document/${code}`,
        {
          delivery: finalData,
        },
        {
          headers: authHeader(token),
        },
      );

      const data = response.data;

      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const increaseStep = createAsyncThunk(
  "order/increaseStep",
  async ({ code, step }, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;
    try {
      const response = await axios.patch(
        `${API_URL}/order/step/${code}/${step}`,
        {},
        {
          headers: authHeader(token),
        },
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

export const deleteOrder = createAsyncThunk(
  "order/deleteOrder",
  async ({ code }, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;
    try {
      const secondResponse = await axios.patch(
        `${API_URL}/order/status/${code}/5`,
        {},
        {
          headers: authHeader(token),
        },
      );

      const response = await axios.delete(
        `${API_URL}/order/deleteById/${code}`,
        {
          headers: authHeader(token),
        },
      );

      const data = response.data;
      const secondDataCome = secondResponse.data;

      return {
        firstData: data,
        secondData: secondDataCome,
      };
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید",
        );
      }
    }
  },
);

// end order

//       // Initialize an array to store the images with base64 data
//       const imagesWithBase64 = [];

//           // Convert the ArrayBuffer to a Uint8Array
//           const uint8Array = new Uint8Array(imageResponse.data);

//           // Convert the Uint8Array to a base64 string
//           const base64Image = Buffer.from(uint8Array).toString("base64");

//           // Determine MIME type (assuming it's PNG for simplicity)
//           const mimeType = imageResponse.headers["content-type"] || "image/png";

// start contact
export const getContactList = createAsyncThunk(
  "contact/getContactList",
  async (_, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;
    try {
      const response = await axios.get(`${API_URL}/contact/list`, {
        headers: authHeader(token),
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("خطا در دریافت پیام‌ها");
      }
      return thunkAPI.rejectWithValue("مشکلی به وجود امده لطفا بعدا تلاش کنید");
    }
  },
);

export const markContactRead = createAsyncThunk(
  "contact/markContactRead",
  async ({ code, isRead }, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;
    try {
      const response = await axios.patch(
        `${API_URL}/contact/${code}`,
        { isRead },
        { headers: authHeader(token) },
      );
      return response.data;
    } catch {
      return thunkAPI.rejectWithValue("مشکلی به وجود امده لطفا بعدا تلاش کنید");
    }
  },
);

export const deleteContact = createAsyncThunk(
  "contact/deleteContact",
  async (code, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;
    try {
      const response = await axios.delete(`${API_URL}/contact/${code}`, {
        headers: authHeader(token),
      });
      return response.data;
    } catch {
      return thunkAPI.rejectWithValue("مشکلی به وجود امده لطفا بعدا تلاش کنید");
    }
  },
);
// end contact

// Sessions are stateless JWTs; logging out only clears the client session.
export const logout = createAsyncThunk("auth/logout", async () => {});

// Re-validates a restored session and refreshes the user's permissions.
// Only an explicit "token rejected" answer logs out (handled by the axios
// interceptor in AuthBootstrap); network errors keep the session.
export const refreshSession = createAsyncThunk(
  "auth/refreshSession",
  async (_, thunkAPI) => {
    const { token, code } = thunkAPI.getState().auth;
    if (!token || !code) return thunkAPI.rejectWithValue("no session");

    try {
      const response = await axios.get(`${API_URL}/users/${code}/permissions`, {
        headers: authHeader(token),
      });
      return { permissions: response.data };
    } catch {
      return thunkAPI.rejectWithValue("session refresh failed");
    }
  },
);
