"use client";

import React, { useState, useEffect } from "react";

import AddBlogs from "./AddBlogs";
import EditBlogs from "./EditBlogs";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import styled from "styled-components";
import { formatPersianDate } from "@/app/utils/persionDateUtils";

//redux import
import { useSelector, useDispatch } from "react-redux";
import { blogsList } from "@/app/Store/thunks";

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

  const [activekey, setActiveKey] = useState("editUserPage");
  const [editedHonor, setEditedHonor] = useState(null);
  const [dataCome, setDataCome] = useState([]);

  

  useEffect(() => {
    const fechData = async () => {
      try {
        const dataComeAPI = await dispatch(blogsList()).unwrap();
        setDataCome(dataComeAPI || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fechData();
  }, [dispatch]);



  // // saving the changes
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
              <h2 className="m-0 "> ویرایش مقالات</h2>
            </div>
            <div>
              <button style={{backgroundColor: "green"}} onClick={() => setActiveKey("addUser")}>
                افزودن افتخارات
              </button>
            </div>
          </div>
          <div
            className="mt-3 d-flex flex-column gap-3"
            style={{ cursor: "pointer" }}
          >
            {dataCome.length > 0 ? (
              dataCome.map((honor, index) => (
                <React.Fragment key={index}>
                  <CARD
                    className="d-flex flex-row"
                    onClick={() => {
                      setEditedHonor(honor);
                    }}
                  >
                    <CardMedia
                      component="img"
                      src={`${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${honor.content.imageSrc}`}
                      sx={{
                        width: "120px",
                        maxHeight: "100%",
                        borderRadius: "2px",
                      }}
                    />
                    <CardContent className="d-flex flex-column justify-content-around">
                      <Typography className="titleHonors">
                        {honor.content.title}
                      </Typography>
                      <Typography className="dateHonors">
                        {formatPersianDate(honor.date)}
                      </Typography>
                    </CardContent>
                  </CARD>
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
              <h2 className="m-0"> افزودن مقالات</h2>
            </div>
            <div>
              <button className="bg-success" onClick={() => setActiveKey("editUserPage")}>
                ویرایش مقالات
              </button>
            </div>
          </div>

          <div>
            <AddBlogs/>
          </div>
        </>
      )}
      {editedHonor && (
        <>
          <EditBlogs
            editedHonor={editedHonor}
            // handleHonorSave={handleHonorSave}
            handleCancelEdit={handleCancelEdit}
            // handleEditImageChange={handleEditImageChange}
            setEditedHonor={setEditedHonor}
            // content={content}
            // setContent={setContent}
          />
        </>
      )}
    </section>
  );
}
