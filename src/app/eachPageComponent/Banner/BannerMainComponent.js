"use client";

import React, { useState, useEffect } from "react";

import AddBanner from "./AddBanner";
import EditBanner from "./EditBanner";
//redux import
import { useSelector, useDispatch } from "react-redux";

import { bannerdata } from "@/app/Store/thunks";
import { bannerImg } from "@/app/Store/slice";

import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import honorsData from "/public/json/ExhibitionTest.json";
import styled from "styled-components";

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

  // add honors
  const [activekey, setActiveKey] = useState("editUserPage");
  // edit honors
  const [editedHonor, setEditedHonor] = useState(null);

  const [content, setContent] = useState(""); // Added content state for editing
  useEffect(() => {
    dispatch(bannerdata());
  }, [dispatch]);

  const images = useSelector(bannerImg);
  console.log(images);

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
              <h2 className="m-0">ویرایش بنر ها</h2>
            </div>
            <div>
              <button onClick={() => setActiveKey("addUser")}>
                افزودن بنر
              </button>
            </div>
          </div>
          <div
            className="mt-3 d-flex flex-column gap-3"
            style={{ cursor: "pointer" }}
          >
            {images &&
              images.map((image) => (
                <div key={image.fileName}>
                  {/* <img
                    src={`http://localhost:7000/system/download/file/${image.fileName}`}
                    alt={image.originalName}
                    style={{ width: "150px", cursor: "pointer" }}
                    onClick={() => handleImageClick(image)}
                  /> */}
                  {/* <input
                    type="file"
                    id={`fileInput-${image.fileName}`}
                    style={{ display: "none" }}
                    onChange={(e) => handleImageChange(e, image)}
                  /> */}

                  <CARD
                    className="d-flex flex-row"
                    // onClick={() => {
                    //   setEditedHonor(honor);
                    //   setContent(honor.content); // Set content when editing
                    // }}
                  >
                    <CardMedia
                      component="img"
                      src={image.base64Image}
                      alt={image.originalName}
                      sx={{
                        width: "120px",
                        maxHeight: "100%",
                        borderRadius: "2px",
                      }}
                    />
                    {/* <CardContent className="d-flex flex-column justify-content-around">
                      <Typography className="titleHonors">
                        {honor.title}
                      </Typography>
                      <Typography className="dateHonors">
                        {honor.date}
                      </Typography>
                    </CardContent> */}
                  </CARD>
                </div>
              ))}
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
                    src={honor.src}
                    sx={{
                      width: "120px",
                      maxHeight: "100%",
                      borderRadius: "2px",
                    }}
                  />
                  <CardContent className="d-flex flex-column justify-content-around">
                    <Typography className="titleHonors">
                      {honor.title}
                    </Typography>
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
            <AddBanner />
          </div>
        </>
      )}
      {editedHonor && (
        <>
          <EditBanner
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
