"use client";

import React, { useState, useEffect } from "react";

import AddBlogs from "./AddBlogs";
import EditBlogs from "./EditBlogs";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import styled from "styled-components";
import { formatPersianDate } from "@/app/utils/persionDateUtils";
// import baseComponents
import ProfileComponent from "@/app/BaseComponent/ProfileComponent";
import NavBarToggleBurgerButton from "@/app/BaseComponent/NavBarToggleBurgerButton";
//redux import
import { useDispatch } from "react-redux";
import { blogsList } from "@/app/Store/thunks";

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
  background-color: white !important;
  color: black !important;
  border: 1px solid #ddd;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction : column;
  .MuiCardContent-root {
    .titleHonors {
      font-size: 20px;
      font-weight: 500;
    }
  }
  .css-46bh2p-MuiCardContent-root:last-child{
    padding-bottom : 10px;
  }
`;

const GridbaseDiv = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;
  @media (max-width : 980px) {
    grid-template-columns: repeat(3 , 1fr);
  }
  @media (max-width : 768px) {
    grid-template-columns: repeat(2 , 1fr);
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
      <HeadermakeOrder className="d-flex flex-row mb-3 justify-content-between">
        <div className="d-block d-lg-none">
          <NavBarToggleBurgerButton func={() => toggleShow("main")} />
        </div>
        {activekey === "editUserPage" && !editedHonor && (
          <>
            <div className="NormalTextSizing textHeaderStyle d-flex align-items-center">
              ویرایش مقالات
            </div>
          </>
        )}
        {activekey === "addUser" && !editedHonor && (
          <>
            <div className="NormalTextSizing textHeaderStyle d-flex align-items-center">
              افزودن مقالات
            </div>
          </>
        )}
        {editedHonor && (
          <>
            <div className="NormalTextSizing textHeaderStyle d-flex align-items-center">
              ویرایش مقالات
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
                افزودن مقالات
              </ButtonColor>
            </div>
          </>
        )}
        {activekey === "addUser" && !editedHonor && (
          <>
            <div>
              <ButtonColor onClick={() => setActiveKey("editUserPage")}>
                ویرایش مقالات
              </ButtonColor>
            </div>
          </>
        )}
        {editedHonor && (
          <>
            <div>
              <ButtonColor onClick={handleCancelEdit}>مقالات</ButtonColor>
            </div>
          </>
        )}
      </div>

      {/* content */}
      {activekey === "editUserPage" && !editedHonor && (
        <>
          <GridbaseDiv
            className="mt-3 container"
            style={{ cursor: "pointer" }}
          >
            {dataCome.length > 0 ? (
              dataCome.map((honor, index) => (
                <React.Fragment key={index}>
                  <CARD
                   
                    onClick={() => {
                      setEditedHonor(honor);
                    }}
                  >
                    <CardMedia
                      component="img"
                      src={`${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${honor.content.imageSrc}`}
                      sx={{
                        width: "100%",
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
          </GridbaseDiv>
        </>
      )}

      {activekey === "addUser" && !editedHonor && (
        <>
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
