import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

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
      const token = response.data.token;
      
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

// Product

export const uploadFile = createAsyncThunk(
  "product/uploadFile ",
  async ({ file, tag, type, isPublic }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    try {
      // Create a FormData object
      const formData = new FormData();
      formData.append("files", file);
      formData.append("tag", tag);
      formData.append("type", type);
      formData.append("isPublic", isPublic);

      const response = await axios.post(
        "http://localhost:7000/system/upload",
        formData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data[0].fileName) {
        alert("افزودن عکس با موفقیت انجام شد");
      }

      return response.data[0].fileName;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("خطا در افزودن media");
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
  'image/fetchPrivateImage',
  async ({ filename }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;
    console.log(token);
    

    try {
      const response = await axios.post(
        `http://localhost:7000/system/download/${filename}`,
        {}, // No body is needed for this request
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "", // Include the token in the Authorization header
          },
          responseType: 'arraybuffer', // Receive binary data
          
        }
      );

      const base64String = Buffer.from(response.data, 'binary').toString('base64');

     console.log('base64String: ' + `data:image/png;base64,${base64String}`);
     
      

      
      
      // const blob = new Blob([response.data], { type: 'image/jpeg' }); // Adjust the MIME type if needed
      
      // console.log(blob);
      
      // // Create an object URL for the blob
      // const imageObjectURL = URL.createObjectURL(blob);

      return `data:image/png;base64,${base64String}`;

    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue('Error from server');
      } else {
        return thunkAPI.rejectWithValue('Something went wrong, please try again later');
      }
    }
  }
);


export const productpot = createAsyncThunk(
  "product/productpot",
  async (productData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;
    try {
      const response = await axios.post(
        "http://localhost:7000/product",
        productData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;

      if (data) {
        alert("افزودن محصول با موفقیت انجام شد");
      }

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
    const token = state.auth.token;
    try {
      const response = await axios.patch(
        `http://localhost:7000/product/${code}`,
        productData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;

      if (data) {
        alert("اپدیت محصول با موفقیت انجام شد");
        console.log(data);
      }

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

export const list = createAsyncThunk("product/list", async (thunkAPI) => {
  try {
    const response = await axios.get("http://localhost:7000/product/list");
    const data = response.data;

    return data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      return thunkAPI.rejectWithValue("ارور سمت من");
    } else {
      return thunkAPI.rejectWithValue("مشکلی به وجود امده لطفا بعدا تلاش کنید");
    }
  }
});

export const deleted = createAsyncThunk(
  "product/deleted",
  async ({ code, name }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    try {
      const response2 = await axios.get(
        `http://localhost:7000/system/download/list/${name}`
      );

      const listOfDelete = response2.data;

      listOfDelete.map((item) => {
        const responseDelete = axios.delete(
          `http://localhost:7000/system/download/${item.fileName}`,
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
        `http://localhost:7000/system/download/${listOfDelete}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );


      const response = await axios.delete(
        `http://localhost:7000/product/${code}`,
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

// start order

export const listorders = createAsyncThunk("order/list", async (_,thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.token;
  
  try {
    const response = await axios.get(
      "http://localhost:7000/order/list",
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
      return thunkAPI.rejectWithValue("مشکلی به وجود امده لطفا بعدا تلاش کنید");
    }
  }
});

export const whosOrder = createAsyncThunk("order/whosOrder", async ({id} , thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.token;
  
  try {
    const response = await axios.post(
      "http://localhost:7000/users",
      {id},
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
      return thunkAPI.rejectWithValue("مشکلی به وجود امده لطفا بعدا تلاش کنید");
    }
  }
});

export const updateOrderStatus = createAsyncThunk("order/updateOrderStatus", async ({code , status} , thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.token;
  
  try {   
    
    const response = await axios.patch(
      `http://localhost:7000/order/status/${code}/${status}`,
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
      return thunkAPI.rejectWithValue("مشکلی به وجود امده لطفا بعدا تلاش کنید");
    }
  }
});

export const requestAdminCommnet = createAsyncThunk("order/requestAdminCommnet", async ({code , reqComment} , thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.token;
  
  try {   
    
    const response = await axios.patch(
      `http://localhost:7000/order/request/${code}/comment`,
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
      return thunkAPI.rejectWithValue("مشکلی به وجود امده لطفا بعدا تلاش کنید");
    }
  }
});

export const increaseStep = createAsyncThunk("order/increaseStep", async ({code , step} , thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.token;
  try {   
    
    const response = await axios.patch(
      `http://localhost:7000/order/step/${code}/${step}`,
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
      return thunkAPI.rejectWithValue("مشکلی به وجود امده لطفا بعدا تلاش کنید");
    }
  }
});




// end order

// start banner
export const bannerdata = createAsyncThunk(
  "banner/bannerdata",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        "http://localhost:7000/system/download/list/banner"
      );

      const bannerData = response.data;

      // Initialize an array to store the images with base64 data
      const imagesWithBase64 = [];

      // Loop through each banner and fetch its image
      for (let image of bannerData) {
        try {
          const imageResponse = await axios.get(
            `http://localhost:7000/system/download/${image.fileName}`,
            { responseType: "arraybuffer" }
          );

          // Convert the ArrayBuffer to a Uint8Array
          const uint8Array = new Uint8Array(imageResponse.data);

          // Convert the Uint8Array to a base64 string
          const base64Image = Buffer.from(uint8Array).toString("base64");

          // Determine MIME type (assuming it's PNG for simplicity)
          const mimeType = imageResponse.headers["content-type"] || "image/png";

          // Add the base64 string to the image object
          imagesWithBase64.push({
            ...image,
            base64Image: `data:${mimeType};base64,${base64Image}`,
          });
        } catch (imageError) {
          console.error("Error fetching image:", imageError);
          // Handle individual image errors here if necessary
        }
      }

      return imagesWithBase64;
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

export const addBanner = createAsyncThunk(
  "banner/addBanner",
  async ({ bannerImage }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    try {
      // Create a FormData object
      const formData = new FormData();
      formData.append("files", bannerImage);
      formData.append("tag", "banner");
      formData.append("type", 1);
      formData.append("isPublic", true);

      const response = await axios.post(
        "http://localhost:7000/system/upload",
        formData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data[0].fileName) {
        alert("افزودن عکس با موفقیت انجام شد");
      }

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("خطا در افزودن عکس");
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

// start HomePageVideo

export const homePageVideo = createAsyncThunk(
  "homePage/video",
  async (thunkAPI) => {
    try {
      const response = await axios.get(
        "http://localhost:7000/system/download/list/homePage1"
      );

      console.log(response.data);
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
