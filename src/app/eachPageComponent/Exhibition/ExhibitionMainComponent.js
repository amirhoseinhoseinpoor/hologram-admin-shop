"use client";

import React, { useState, useEffect } from "react";

import AddExhibition from "./AddExhibition";
import EditExhibition from "./EditExhibition";

import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import honorsData from "/public/json/ExhibitionTest.json";
import styled from "styled-components";

//redux import
import { useDispatch } from "react-redux";
import { exhibitionList } from "@/app/Store/thunks";
import { formatPersianDate } from "@/app/utils/persionDateUtils";

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
        const dataComeAPI = await dispatch(exhibitionList()).unwrap();
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
            <button onClick={() => setActiveKey("addUser")}>
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
                  src={data.src}
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
          <AddExhibition/>
        </div>
      </>
    )}
    {editedHonor && (
      <>
        <EditExhibition
          editedHonor={editedHonor}
          handleCancelEdit={handleCancelEdit}
          setEditedHonor={setEditedHonor}
        />
      </>
    )}
  </section>
  );
}
