"use client";

import React, { useState, useEffect } from "react";

import AddVideo from "./AddVideo";
import EditVideo from "./EditVideo";
//redux import
import { useDispatch } from "react-redux";
import { homePageVideo } from "../../Store/thunks.js";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import styled from "styled-components";
// improt base component
import NavBarToggleBurgerButton from "@/app/BaseComponent/NavBarToggleBurgerButton";

const HeadermakeOrder = styled.div`
  background-color: white;
  padding: 10px;
  color: white;
  .textHeaderStyle {
    color: black;
  }

  @media (max-width: 980px) {
    background-color: rgb(26, 32, 53) !important;
    .textHeaderStyle {
      color: white !important;
    }
  }
`;

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

export default function HonorsMainComponent({ toggleShow }) {
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

  // cancelingEdit
  const handleCancelEdit = () => {
    setEditedHonor(null);
  };

  return (
    <section>
      <HeadermakeOrder className="d-flex flex-row mb-3 justify-content-between">
        <div className="d-block d-lg-none">
          <NavBarToggleBurgerButton func={() => toggleShow("main")} />
        </div>
        {activekey === "editUserPage" && !editedHonor && (
          <>
            <div className="NormalTextSizing textHeaderStyle d-flex align-items-center">
              ویرایش ویدیو
            </div>
            <div>
              <button
                className="bg-success"
                onClick={() => setActiveKey("addUser")}
              >
                افزودن ویدیو
              </button>
            </div>
          </>
        )}
        {activekey === "addUser" && !editedHonor && (
          <>
            <div className="NormalTextSizing textHeaderStyle d-flex align-items-center">
              افزودن ویدیو
            </div>
            <div>
              <button
                className="bg-success"
                onClick={() => setActiveKey("editUserPage")}
              >
                ویرایش ویدیو
              </button>
            </div>
          </>
        )}
        {editedHonor && (
          <>
            <div className="NormalTextSizing textHeaderStyle d-flex align-items-center">
              ویرایش ویدیو
            </div>
            <div>
              <button className="bg-success" onClick={handleCancelEdit}>
                ویدیو
              </button>
            </div>
          </>
        )}
      </HeadermakeOrder>
      {activekey === "editUserPage" && !editedHonor && (
        <>
          <div
            className="mt-3 d-flex flex-column gap-3 container"
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
                            width: "150px",
                            maxHeight: "100%",
                            borderRadius: "2px",
                          }}
                        />
                      )}
                      <CardContent className="d-flex flex-column justify-content-around">
                        <TYPOGRAPHY className="titleHonors">
                          {data.media.title}
                        </TYPOGRAPHY>
                        <div className="d-flex flex-row gap-2">
                          <p>کد محصول :</p>
                          <TYPOGRAPHY className="dateHonors">
                            {data.code}
                          </TYPOGRAPHY>
                        </div>
                      </CardContent>
                    </CARD>
                  ) : (
                    <div>
                      {/* Handle when media is null */}
                      <TYPOGRAPHY variant="body2" color="textSecondary">
                        No media available for code {data.code}
                      </TYPOGRAPHY>
                    </div>
                  )}
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
