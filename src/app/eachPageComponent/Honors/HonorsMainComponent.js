"use client";

import React, { useState, useEffect } from "react";

//redux import 
import { useSelector, useDispatch } from "react-redux";
import { honors } from "../../Store/slice.js";
import { updateHonor } from "../../Store/thunks.js";

import CKEditor from "./CKEditor.js";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import honorsData  from "/public/json/HonorsTest.json";
import styled from "styled-components";

const CARD = styled(Card)`
  background-color: #5f5f5f !important;
  color: white !important;
  .MuiCardContent-root {
    /* padding:0; */
    .titleHonors {
      font-size: 20px;
      font-weight : 500;
    }
  }
`;


const TEXTFIELD = styled(TextField)`
  .MuiInputBase-input {
    margin-bottom: 0;
  }
`;

export default function HonorsMainComponent() {
  const dispatch = useDispatch();
  const honorsR  = useSelector(honors);



  // add honors
  const [activekey, setActiveKey] = useState("editUserPage");
  // edit honors
  const [editedHonor, setEditedHonor] = useState(null);
  // for geting data from api ( create the thunk )
  useEffect(() => {
    // This assumes that you have a way to initialize the honors in your state.
    // You might want to dispatch a thunk to fetch honors from the server.
  }, [dispatch]);



  // savig the changes
  const handleHonorSave = async (event) => {
    event.preventDefault();
    // Call your API to update the honor
     await dispatch(updateHonor(editedHonor));
    setEditedHonor(null);
  };

  // cancelingEdit
  const handleCancelEdit = () => {
    setEditedHonor(null);
  };

  const handleEditImageChange = (event) => {
    const newImage = event.target.files[0];
    setEditedHonor({
      ...editedHonor,
      src: URL.createObjectURL(newImage),
      newImageFile: newImage
    });
  };







  // image change
  const handleImageChange = (event) => {
    const newImage = event.target.files[0];
    setBannerImage(newImage);
  };

  // text change
  const handleTextChange = (event) => {
    setBannerText(event.target.value);
  };

  // form submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("image", bannerImage); // Append image file
    formData.append("text", bannerText); // Append banner text
    await dispatch(updateBannerContent(formData)); // Dispatch update thunk
  };

  return (
    <section>
      {activekey === "editUserPage" && !editedHonor && (
        <>
          <div className="d-flex flex-row justify-content-between mb-2">
            <div>
              <h2 className="m-0"> ویرایش افتخارات</h2>
            </div>
            <div>
              <button onClick={() => setActiveKey("addUser")}>
                افزودن افتخارات
              </button>
            </div>
          </div>
          <div className="mt-3 d-flex flex-column gap-3" style={{cursor : "pointer"}}>
            {honorsData.map((honor, index) => (
              <React.Fragment key={index}>
                <CARD
                  className="d-flex flex-row"
                  onClick={() => setEditedHonor(honor)}
                >
                  <CardMedia
                    component="img"
                    src={honor.src}
                    sx={{
                      width: "120px",
                      maxHeight: "100%",
                      borderRadius: 3,
                    }}
                  />
                  <CardContent className="d-flex flex-column justify-content-around">
                    <Typography className="titleHonors">{honor.title}</Typography>
                    <Typography className="dateHonors">{honor.date}</Typography>
                  </CardContent>
                </CARD>
              </React.Fragment>
            ))}
          </div>
        </>
      )}

      {activekey === "addUser" && !editedHonor && (
        <>
          <div className="d-flex flex-row justify-content-between mb-2">
            <div>
              <h2 className="m-0"> افزودن افتخارات</h2>
            </div>
            <div>
              <button onClick={() => setActiveKey("editUserPage")}>
                ویرایش افتخارات
              </button>
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit}>
              <label htmlFor="bannerImage">Image:</label>
              <input
                type="file"
                id="bannerImage"
                onChange={handleImageChange}
              />
              <label htmlFor="bannerText">Text:</label>
              <textarea
                id="bannerText"
                
                onChange={handleTextChange}
              />
              <button type="submit">Update Banner</button>
            </form>
          </div>

          <CKEditor />
        </>
      )}
      {editedHonor && (
        <>
          <div className="mt-3">
            <h2>Edit Honor</h2>
            <form onSubmit={handleHonorSave}>
              <TEXTFIELD
                label="Title"
                value={editedHonor.title}
                onChange={(e) =>
                  setEditedHonor({ ...editedHonor, title: e.target.value })
                }
                fullWidth
                margin="normal"
              />
              <TEXTFIELD
                label="Date"
                value={editedHonor.date}
                onChange={(e) =>
                  setEditedHonor({ ...editedHonor, date: e.target.value })
                }
                fullWidth
                margin="normal"
              />
              <input
                type="file"
                onChange={handleEditImageChange}
                accept="image/*"
              />
              {editedHonor.src && (
                <Box sx={{ width: '100px', height: '100px', marginTop: '10px' }}>
                <CardMedia
                  component="img"
                  src={editedHonor.src}
                  sx={{ width: '100%', height: '100%', borderRadius: 3 }}
                />
              </Box>
              )}
              <Button className="mb-3 mt-3" variant="contained" type="submit">
                Save
              </Button>
              <Button variant="contained" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </form>
          </div>
        </>
      )}
    </section>
  );
}
