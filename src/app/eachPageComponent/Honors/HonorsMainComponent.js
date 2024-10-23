"use client";

import React, { useState, useEffect } from "react";

import AddHonors from "./AddHonors";
import EditHonors from "./EditHoors";
//redux import
import { useDispatch } from "react-redux";
import { honorsList } from "../../Store/thunks.js";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { formatPersianDate } from "@/app/utils/persionDateUtils";
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
  
  const [activekey, setActiveKey] = useState("editUserPage");
  const [editedHonor, setEditedHonor] = useState(null);
  const [dataCome, setDataCome] = useState([]);

 useEffect(() => {
    const fechData = async () => {
      try {
        const dataComeAPI = await dispatch(honorsList()).unwrap();
        setDataCome(dataComeAPI || []); 
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fechData();
  }, [dispatch]);


  const handleCancelEdit = () => {
    setEditedHonor(null);
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
            dataCome.map((data, index) => (
              <React.Fragment key={index}>
                <CARD
                  className="d-flex flex-row"
                  onClick={() => {
                    setEditedHonor(data);
                    // setContent(data.content); // Set content when editing
                  }}
                >
                  <CardMedia
                    component="img"
                    src={`${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${data.src}`}
                    sx={{
                      width: "120px",
                      maxHeight: "100%",
                      borderRadius: "2px",
                    }}
                  />
                  <CardContent className="d-flex flex-column justify-content-around">
                    <Typography className="titleHonors">
                      {data.title}
                    </Typography>
                    <Typography className="dateHonors">{formatPersianDate(data.date)}</Typography>
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
              <h2 className="m-0"> افزودن افتخارات</h2>
            </div>
            <div>
              <button onClick={() => setActiveKey("editUserPage")}>
                ویرایش افتخارات
              </button>
            </div>
          </div>

          <div>
            <AddHonors/>
          </div>
        </>
      )}
      {editedHonor && (
        <>
          <EditHonors
            editedHonor={editedHonor}
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
