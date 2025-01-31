import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// auterezation
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    const { username, password } = credentials;
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/auth/adminLogin`,
        {
          username,
          password,
        }
      );
      const token = response.data.token;

      const response2 = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/users`,
        { username },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const gettingRole = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/users/${response2.data[0].code}/permissions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(gettingRole.data);

      return {
        token,
        firstName: response2.data[0].firstName,
        lastName: response2.data[0].lastName,
        phoneNumber: response2.data[0].username,
        code: response2.data[0].code,
        email: response2.data[0].email,
        gender: response2.data[0].gender,
        permissions: gettingRole.data,
      };
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("شماره همراه یا پسورد اشتباه است");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

// start roles

export const gettingAllRoles = createAsyncThunk(
  "roles/gettingAllRoles",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/roles`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("error");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

export const createPermissionRole = createAsyncThunk(
  "roles/updatePermissionRole",
  async ({name , permissionIds}, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/roles`,
        {
          name,
          permissionIds
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue(error?.response);
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);


export const updatePermissionRole = createAsyncThunk(
  "roles/updatePermissionRole",
  async ({roleId , permissionIds}, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/roles/update-permissions`,
        {
          roleId,
          permissionIds
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("error");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

export const deleteRole = createAsyncThunk(
  "roles/deleteRole",
  async ({id}, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;
    console.log(id);
    

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/roles/${id}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("error");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

// end roles


export const addUser = createAsyncThunk(
  "userManagment/addUser",
  async (credentials, thunkAPI) => {
    const { firstName, lastName, username, password, domain, roleId } =
      credentials;

    const state = thunkAPI.getState();
    const token = state.auth.token.token;

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/auth/createUserByAdmin`,
        {
          firstName,
          lastName,
          username,
          password,
          domain,
          ...(roleId && roleId.length > 0 && { roleIds: roleId }),
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      const signUpSattus = response.data.message;
      console.log(signUpSattus);
      return signUpSattus;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("شما قبلا ثبت نام کرده اید");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

// user managment

export const getuser = createAsyncThunk(
  "userManagment/getuser",
  async ({ domain }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/users/allUser?domain=${domain}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("error");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

export const editUser = createAsyncThunk(
  "userManagment/editUser",
  async (
    { code, firstName, lastName, username, active, domain, roleIds },
    thunkAPI
  ) => {
    console.log(roleIds);

    const state = thunkAPI.getState();
    const token = state.auth.token.token;

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/users/${code}`,
        {
          firstName,
          lastName,
          username,
          active,
          domain,
          roleIds,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("error");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

export const deleteUser = createAsyncThunk(
  "userManagment/deleteUser",
  async ({ code }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/users/${code}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("error");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

// Product

export const uploadFile = createAsyncThunk(
  "product/uploadFile ",
  async ({ file, tag, type, isPublic }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;

    try {
      // Create a FormData object
      const formData = new FormData();
      formData.append("files", file);
      formData.append("tag", tag);
      formData.append("type", type);
      formData.append("isPublic", isPublic);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/upload`,
        formData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data[0].fileName;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

export const fetchPrivateImage = createAsyncThunk(
  "image/fetchPrivateImage",
  async ({ filename }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${filename}`,
        {}, // No body is needed for this request
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
          responseType: "blob",
        }
      );

      const imageObjectURL = URL.createObjectURL(response.data);

      return imageObjectURL;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("Error from server");
      } else {
        return thunkAPI.rejectWithValue(
          "Something went wrong, please try again later"
        );
      }
    }
  }
);

export const productpot = createAsyncThunk(
  "product/productpot",
  async (productData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/product`,
        productData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

export const productEdit = createAsyncThunk(
  "product/productEdit",
  async ({ productData, code }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/product/${code}`,
        productData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

export const countProduct = createAsyncThunk(
  "product/countProduct",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/product/count`
      );
      const data = response.data;

      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

export const list = createAsyncThunk(
  "product/list",
  async ({ page, limit }, thunkAPI) => {
   
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/product/listPaginated?page=${page}&limit=${limit}`
      );
      const data = response.data;

      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

export const prodNameAndNav = createAsyncThunk(
  "product/prodNameAndNav",
  async (_, thunkAPI) => {
   
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/product/names-navIds`
      );
      const data = response.data;

      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

export const deleted = createAsyncThunk(
  "product/deleted",
  async ({ code, name }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;

    try {
      const response2 = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/list/${name}`
      );

      const listOfDelete = response2.data;

      listOfDelete.map((item) => {
        const responseDelete = axios.delete(
          `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${item.fileName}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        console.log(responseDelete);
        console.log(item.fileName);
      });

      const responseDelete = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${listOfDelete}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/product/${code}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      const data = response.data;

      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

// end product

// start HomePageVideo

export const homePageVideo = createAsyncThunk(
  "homePage/video",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/video/list`
      );

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

export const videopot = createAsyncThunk(
  "homePage/videopot",
  async (productData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/video`,
        productData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

export const videoEdit = createAsyncThunk(
  "homePage/videoEdit",
  async ({ media, code }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/video/${code}`,
        media,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

export const HomePageVideoDeleted = createAsyncThunk(
  "homePage/HomePageVideoDeleted",
  async ({ code }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/video/${code}`,

        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      const data = response.data;
      console.log(data);

      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

// end HomePageVideo

// start honors

export const honorsList = createAsyncThunk(
  "honor/honorsList",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/honors/list`
      );
      const data = response.data;

      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

export const honorspot = createAsyncThunk(
  "homePage/honorspot",
  async (formData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/honors`,
        formData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

export const honorsEdit = createAsyncThunk(
  "homePage/honorsEdit",
  async ({ honor, code }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/honors/${code}`,
        honor,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

export const honorsDeleted = createAsyncThunk(
  "homePage/honorsDeleted",
  async ({ code }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/honors/${code}`,

        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);
// end honors

// start exhibition

export const exhibitionList = createAsyncThunk(
  "exhibition/exhibitionList",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/exhibition/list`
      );
      const data = response.data;

      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

export const exhibitionpot = createAsyncThunk(
  "exhibition/exhibitionpot",
  async (formData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/exhibition`,
        formData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

export const exhibitionEdit = createAsyncThunk(
  "exhibition/exhibitionEdit",
  async ({ exhibition, code }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/exhibition/${code}`,
        exhibition,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

export const exhibitionDeleted = createAsyncThunk(
  "exhibition/exhibitionDeleted",
  async ({ code }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/exhibition/${code}`,

        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      const data = response.data;

      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

// end exhibition

// start banner

export const bannerList = createAsyncThunk(
  "banner/bannerList",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/banner/list`
      );
      const data = response.data;

      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

export const bannerpot = createAsyncThunk(
  "banner/bannerpot",
  async (formData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/banner`,
        formData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

export const bannerEdit = createAsyncThunk(
  "banner/bannerEdit",
  async ({ banner, code }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/banner/${code}`,
        banner,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

export const bannerDeleted = createAsyncThunk(
  "banner/bannerDeleted",
  async ({ code }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/banner/${code}`,

        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      const data = response.data;
      console.log(data);

      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

// end banner

// start header
export const HeaderList = createAsyncThunk(
  "Header/HeaderList",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/header/find`
      );
      const data = response.data;

      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

export const headerEdit = createAsyncThunk(
  "header/headerEdit",
  async ({ header }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/header`,
        header,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

// end header

// start blog

export const blogsList = createAsyncThunk(
  "blog/blogsList",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/blogs/list`
      );
      const data = response.data;

      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

export const blogspot = createAsyncThunk(
  "blog/blogspot",
  async (formData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/blogs`,
        formData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

export const blogsEdit = createAsyncThunk(
  "blog/blogsEdit",
  async ({ content, code }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/blogs/${code}`,
        content,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;

      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

export const blogsDeleted = createAsyncThunk(
  "blog/blogsDeleted",
  async ({ code }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/blogs/${code}`,

        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);
// end blog

// start order

export const Countorders = createAsyncThunk(
  "order/Countorders",
  async ({ status }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;

    try {
      let url = `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/order/count`;

      // If status is provided, append it to the URL
      if (status !== undefined) {
        url += `?status=${status}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

export const sendNewMessage = createAsyncThunk(
  "order/sendNewMessage",
  async ({ code, newMessageSend }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/order/chat/${code}`,
        {
          chat: newMessageSend,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

export const listorders = createAsyncThunk(
  "order/list",
  async (
    { status, sortBy = "createdAt", sortOrder = "desc", page = 1, limit = 10 },
    thunkAPI
  ) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/order/list`,
        {
          params: { status, sortBy, sortOrder, page, limit },
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

export const whosOrder = createAsyncThunk(
  "order/whosOrder",
  async ({ id }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/users`,
        { id },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ code, status }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/order/status/${code}/${status}`,
        {},
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

export const chatImageSend = createAsyncThunk(
  "order/chatImageSend",
  async ({ code, chatImage }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/order/chatImage/${code}`,
        {
          chatImage,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

export const requestAdminCommnet = createAsyncThunk(
  "order/requestAdminCommnet",
  async ({ code, reqComment }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/order/request/${code}/comment`,
        {
          reqComment,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);


export const sendingSecondStep = createAsyncThunk(
  "order/sendingSecondStep",
  async ({ code, sendingFinalData }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/order/document/${code}`,
        {
          document: sendingFinalData,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      const data = response.data;

      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);


export const paymentStepData = createAsyncThunk(
  "order/paymentStepData",
  async ({ code, payment }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/order/payment/${code}`,
        {
          payment,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

export const sendingAdressStep = createAsyncThunk(
  "order/sendingAdressStep",
  async ({ code, finalData }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/order/document/${code}`,
        {
          delivery: finalData,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      const data = response.data;

      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

export const increaseStep = createAsyncThunk(
  "order/increaseStep",
  async ({ code, step }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/order/step/${code}/${step}`,
        {},
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("ارور سمت من");
      } else {
        return thunkAPI.rejectWithValue(
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "order/deleteOrder",
  async ({ code }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token.token;
    try {
      const secondResponse = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/order/status/${code}/5`,
        {},
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/order/deleteById/${code}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
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
          "مشکلی به وجود امده لطفا بعدا تلاش کنید"
        );
      }
    }
  }
);

// end order

// start banner
// export const bannerdata = createAsyncThunk(
//   "banner/bannerdata",
//   async (_, thunkAPI) => {
//     try {
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/list/banner`
//       );

//       const bannerData = response.data;

//       // Initialize an array to store the images with base64 data
//       const imagesWithBase64 = [];

//       // Loop through each banner and fetch its image
//       for (let image of bannerData) {
//         try {
//           const imageResponse = await axios.get(
//             `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${image.fileName}`,
//             { responseType: "arraybuffer" }
//           );

//           // Convert the ArrayBuffer to a Uint8Array
//           const uint8Array = new Uint8Array(imageResponse.data);

//           // Convert the Uint8Array to a base64 string
//           const base64Image = Buffer.from(uint8Array).toString("base64");

//           // Determine MIME type (assuming it's PNG for simplicity)
//           const mimeType = imageResponse.headers["content-type"] || "image/png";

//           // Add the base64 string to the image object
//           imagesWithBase64.push({
//             ...image,
//             base64Image: `data:${mimeType};base64,${base64Image}`,
//           });
//         } catch (imageError) {
//           console.error("Error fetching image:", imageError);
//           // Handle individual image errors here if necessary
//         }
//       }

//       return imagesWithBase64;
//     } catch (error) {
//       if (error.response && error.response.status === 400) {
//         return thunkAPI.rejectWithValue("ارور سمت من");
//       } else {
//         return thunkAPI.rejectWithValue(
//           "مشکلی به وجود امده لطفا بعدا تلاش کنید"
//         );
//       }
//     }
//   }
// );

// export const addBanner = createAsyncThunk(
//   "banner/addBanner",
//   async ({ bannerImage }, thunkAPI) => {
//     const state = thunkAPI.getState();
//     const token = state.auth.token.token;

//     try {
//       // Create a FormData object
//       const formData = new FormData();
//       formData.append("files", bannerImage);
//       formData.append("tag", "banner");
//       formData.append("type", 1);
//       formData.append("isPublic", true);

//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/upload`,
//         formData,
//         {
//           headers: {
//             Authorization: token ? `Bearer ${token}` : "",
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (response.data[0].fileName) {
//         alert("افزودن عکس با موفقیت انجام شد");
//       }

//       return response.data;
//     } catch (error) {
//       if (error.response && error.response.status === 400) {
//         alert("خطا در افزودن عکس");
//         return thunkAPI.rejectWithValue("ارور سمت من");
//       } else {
//         return thunkAPI.rejectWithValue(
//           "مشکلی به وجود امده لطفا بعدا تلاش کنید"
//         );
//       }
//     }
//   }
// );
// end banner

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await axios.post("/api/logout"); // Assuming logout endpoint exists
  } catch (error) {
    console.error("Logout error:", error);
  }
});
