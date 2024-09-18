"use client";

import React, { useState, useEffect } from "react";

import AddVideo from "./AddVideo";
import EditVideo from "./EditVideo";
//redux import
import { useSelector, useDispatch } from "react-redux";
import { honors } from "../../Store/slice.js";
import { updateHonor } from "../../Store/thunks.js";

import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import honorsData from "/public/json/Video.json";
import styled from "styled-components";
import parse from "html-react-parser";

const CARD = styled(Card)`
  background-color: #5f5f5f !important;
  color: white !important;
  .MuiCardContent-root {
    .titleHonors {
      font-size: 20px;
      font-weight: 500;
    }
  }
`;

export default function HonorsMainComponent() {
  const dispatch = useDispatch();
  const honorsR = useSelector(honors);

  // add honors
  const [activekey, setActiveKey] = useState("editUserPage");
  // edit honors
  const [editedHonor, setEditedHonor] = useState(null);

  const [content, setContent] = useState(""); // Added content state for editing
  useEffect(() => {
    // This assumes that you have a way to initialize the honors in your state.
    // You might want to dispatch a thunk to fetch honors from the server.
  }, [dispatch]);

  // saving the changes
  const handleHonorSave = async (event) => {
    event.preventDefault();
    await dispatch(updateHonor({ ...editedHonor, content }));
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
      newImageFile: newImage,
    });
  };

  return (
    <section>
      {activekey === "editUserPage" && !editedHonor && (
        <>
          <div className="d-flex flex-row justify-content-between mb-2">
            <div>
              <h2 className="m-0"> ویرایش ویدیو</h2>
            </div>
            <div>
              <button onClick={() => setActiveKey("addUser")}>
                افزودن ویدیو
              </button>
            </div>
          </div>
          <div
            className="mt-3 d-flex flex-column gap-3"
            style={{ cursor: "pointer" }}
          >
            {honorsData.map((honor, index) => (
              <React.Fragment key={index}>
                <CARD
                  className="d-flex flex-row"
                  onClick={() => {
                    setEditedHonor(honor);
                    setContent(honor.content); // Set content when editing
                  }}
                >
                  <CardMedia
                    component="img"
                    src={honor.poster}
                    sx={{
                      width: "200px",
                      borderRadius: "2px",
                    }}
                  />
                  <CardContent className="d-flex flex-column justify-content-around">
                    <Typography className="titleHonors">
                      {honor.title}
                    </Typography>
                    <Typography className="dateHonors">{honor.discription}</Typography>
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
              <h2 className="m-0"> افزودن ویدیو</h2>
            </div>
            <div>
              <button onClick={() => setActiveKey("editUserPage")}>
                ویرایش ویدیو
              </button>
            </div>
          </div>

          <div>
            <AddVideo dispatch={dispatch} />
          </div>
        </>
      )}
      {editedHonor && (
        <>
          <EditVideo
            editedHonor={editedHonor}
            handleHonorSave={handleHonorSave}
            handleCancelEdit={handleCancelEdit}
            handleEditImageChange={handleEditImageChange}
            setEditedHonor={setEditedHonor}
            content={content}
            setContent={setContent}
          />

          {/* <div>{parse(content)}</div> */}
        </>
      )}
    </section>
  );
}
