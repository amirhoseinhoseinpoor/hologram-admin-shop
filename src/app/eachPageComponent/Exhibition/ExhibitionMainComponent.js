"use client";

import React, { useState, useEffect } from "react";

import AddExhibition from "./AddExhibition";
import EditExhibition from "./EditExhibition";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import styled from "styled-components";
// import base component
import ProfileComponent from "@/app/BaseComponent/ProfileComponent";
import NavBarToggleBurgerButton from "@/app/BaseComponent/NavBarToggleBurgerButton";

//redux import
import { useDispatch } from "react-redux";
import { exhibitionList } from "@/app/Store/thunks";
import { formatPersianDate } from "@/app/utils/persionDateUtils";

const HeadermakeOrder = styled.div`
  /* background-color: white; */
  padding: 10px;
  color: white;
  .textHeaderStyle {
    color: black;
  }

  @media (max-width: 980px) {
    /* background-color: rgb(26, 32, 53) !important; */
    .textHeaderStyle {
      /* color: white !important; */
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
const ButtonColor = styled.button`
  background-image: linear-gradient(195deg, #42424a 0%, #191919 100%);
`;

const TYPOGRAPHY = styled(Typography)`
  font-family: unset !important;
  font-size: 17px !important;
`;

export default function HonorsMainComponent({ toggleShow }) {
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
      <HeadermakeOrder className="d-flex flex-row mb-3 justify-content-between">
        <div className="d-block d-lg-none">
          <NavBarToggleBurgerButton func={() => toggleShow("main")} />
        </div>
        {activekey === "editUserPage" && !editedHonor && (
          <>
            <div className="NormalTextSizing textHeaderStyle d-flex align-items-center">
              ویرایش نمایشگاه
            </div>
          </>
        )}
        {activekey === "addUser" && !editedHonor && (
          <>
            <div className="NormalTextSizing textHeaderStyle d-flex align-items-center">
              افزودن نمایشگاه
            </div>
          </>
        )}
        {editedHonor && (
          <>
            <div className="NormalTextSizing textHeaderStyle d-flex align-items-center">
              ویرایش نمایشگاه
            </div>
          </>
        )}
        <ProfileComponent colorGet={"#191919"} />
      </HeadermakeOrder>
      {/* tabs */}
      <div className="d-flex justify-content-end ms-3">
        {activekey === "editUserPage" && !editedHonor && (
          <>
            <div>
              <ButtonColor onClick={() => setActiveKey("addUser")}>
                افزودن نمایشگاه
              </ButtonColor>
            </div>
          </>
        )}
        {activekey === "addUser" && !editedHonor && (
          <>
            <div>
              <ButtonColor onClick={() => setActiveKey("editUserPage")}>
                ویرایش نمایشگاه
              </ButtonColor>
            </div>
          </>
        )}
        {editedHonor && (
          <>
            <div>
              <ButtonColor onClick={handleCancelEdit}>نمایشگاه</ButtonColor>
            </div>
          </>
        )}
      </div>

      {/* content */}
      {activekey === "editUserPage" && !editedHonor && (
        <>
          <div
            className="mt-3 d-flex flex-column gap-3 container"
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
                        width: "150px",
                        maxHeight: "100%",
                        borderRadius: "2px",
                      }}
                    />
                    <CardContent className="d-flex flex-column justify-content-around">
                      <TYPOGRAPHY className="titleHonors">
                        {data.title}
                      </TYPOGRAPHY>
                      <TYPOGRAPHY className="dateHonors">
                        {formatPersianDate(data.date)}
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
          <div>
            <AddExhibition />
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
