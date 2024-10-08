"use client";

import React, { useState, useEffect } from "react";

import AddVideo from "./AddVideo";
import EditVideo from "./EditVideo";
//redux import
import { useSelector, useDispatch } from "react-redux";

// import { updateHonor } from "../../Store/thunks.js";
import { homePageVideo } from "../../Store/thunks.js";
// import { homeVideoFileName } from "../../Store/slice.js";

import { Card, CardContent, CardMedia, Typography } from "@mui/material";

// import honorsData from "/public/json/Video.json";

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

  // const [content, setContent] = useState("");

  const [dataCome, setDataCome] = useState([]);

  useEffect(() => {
    const fechData = async () => {
      try {
        const dataComeAPI = await dispatch(homePageVideo()).unwrap();
        setDataCome(dataComeAPI || []); // Make sure to set dataCome as an array
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fechData();
  }, [dispatch]);

  // saving the changes
  // const handleHonorSave = async (event) => {
  //   event.preventDefault();
  //   await dispatch(updateHonor({ ...editedHonor, content }));
  //   setEditedHonor(null);
  // };

  // cancelingEdit
  const handleCancelEdit = () => {
    setEditedHonor(null);
  };

  // const handleEditImageChange = (event) => {
  //   const newImage = event.target.files[0];
  //   setEditedHonor({
  //     ...editedHonor,
  //     src: URL.createObjectURL(newImage),
  //     newImageFile: newImage,
  //   });
  // };

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
            {dataCome.length > 0 ? (
              dataCome.map((data, index) => (
                <React.Fragment key={index}>
                  {/* Check if media exists */}
                  {data.media ? (
                    <CARD
                      className="d-flex flex-row"
                      onClick={() => {
                        setEditedHonor(data);
                      }}
                    >
                      {data.media.poster && (
                        <CardMedia
                          component="img"
                          src={`${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${data.media.poster}`}
                          sx={{
                            width: "120px",
                            maxHeight: "100%",
                            borderRadius: "2px",
                          }}
                        />
                      )}
                      <CardContent className="d-flex flex-column justify-content-around">
                        <Typography className="titleHonors">
                          {data.media.title}
                        </Typography>
                        <div className="d-flex flex-row gap-2">
                          <p>کد محصول :</p>
                          <Typography className="dateHonors">
                            {data.code}
                          </Typography>
                        </div>
                      </CardContent>
                    </CARD>
                  ) : (
                    <div>
                      {/* Handle when media is null */}
                      <Typography variant="body2" color="textSecondary">
                        No media available for code {data.code}
                      </Typography>
                    </div>
                  )}
                </React.Fragment>
              ))
            ) : (
              <Typography variant="body2">No data available</Typography>
            )}
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
            <AddVideo />
          </div>
        </>
      )}

      {editedHonor && (
        <>
          <EditVideo
            editedHonor={editedHonor}
            handleCancelEdit={() => setEditedHonor(null)}
            setEditedHonor={setEditedHonor}
          />
        </>
      )}
    </section>
  );
}
