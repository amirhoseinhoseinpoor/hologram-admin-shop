import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"; // Import axios for API calls

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    const { username, password } = credentials;
    try {
      const response = await axios.post(
        "http://176.120.16.221:7000/auth/login",
        {
          username,
          password,
        }
      );
      const token = response.data.token; // Assuming successful login returns a token
      
      return token;
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

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await axios.post("/api/logout"); // Assuming logout endpoint exists
  } catch (error) {
    console.error("Logout error:", error);
  }
});

export const Adduser = createAsyncThunk(
  "users/Adduser",
  async (formData, thunkAPI) => {
    console.log(formData);
    try {
      const response = await axios.post("/json/tabelContent.json", formData);

      return response.data; // Assuming successful update returns updated banner data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateHonor = createAsyncThunk(
  "honors/updateHonor",
  async (honor, { rejectWithValue }) => {
    console.log(honor);
    try {
      const formData = new FormData();
      formData.append("title", honor.title);
      formData.append("date", honor.date);
      formData.append("tags", honor.tags);
      formData.append("src", honor.src);
      formData.append("content", honor.content);

      if (honor.newImageFile) {
        formData.append("image", honor.newImageFile);
      }

      const response = await axios.post(
        `/api/updateHonor/${honor.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
