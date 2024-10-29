"use client";

import React, { useState, useEffect } from "react";

import AddBlogs from "./AddBlogs";
import EditBlogs from "./EditBlogs";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import styled from "styled-components";
import { formatPersianDate } from "@/app/utils/persionDateUtils";

//redux import
import { useDispatch } from "react-redux";
import { blogsList } from "@/app/Store/thunks";

const CARD = styled(Card)`
  background-color: #dfdcdc !important;
  color: black !important;
  border: 1px solid #ddd;
  box-shadow: unset;
  .MuiCardContent-root {
    .titleHonors {
      font-size: 20px;
      font-weight: 500;
    }
  }
`;

const TYPOGRAPHY = styled(Typography)`
  font-family: unset !important;
  font-size: 17px !important;
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

  // cancelingEdit
  const handleCancelEdit = () => {
    setEditedHonor(null);
  };

  return (
    <section>
      {activekey === "editUserPage" && !editedHonor && (
        <>
          <div className="d-flex flex-row justify-content-between mb-2">
            <div>
              <h2 className="m-0 "> ویرایش مقالات</h2>
            </div>
            <div>
              <button
                style={{ backgroundColor: "green" }}
                onClick={() => setActiveKey("addUser")}
              >
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
                        width: "150px",
                        maxHeight: "100%",
                        borderRadius: "2px",
                      }}
                    />
                    <CardContent className="d-flex flex-column justify-content-around">
                      <TYPOGRAPHY className="titleHonors">
                        {honor.content.title}
                      </TYPOGRAPHY>
                      <TYPOGRAPHY className="dateHonors">
                        {formatPersianDate(honor.date)}
                      </TYPOGRAPHY>
                    </CardContent>
                  </CARD>
                </React.Fragment>
              ))
            ) : (
              <TYPOGRAPHY variant="body2">No data available</TYPOGRAPHY>
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
              <button
                className="bg-success"
                onClick={() => setActiveKey("editUserPage")}
              >
                ویرایش مقالات
              </button>
            </div>
          </div>

          <div>
            <AddBlogs />
          </div>
        </>
      )}
      {editedHonor && (
        <>
          <EditBlogs
            editedHonor={editedHonor}
            handleCancelEdit={handleCancelEdit}
            setEditedHonor={setEditedHonor}
          />
        </>
      )}
    </section>
  );
}
