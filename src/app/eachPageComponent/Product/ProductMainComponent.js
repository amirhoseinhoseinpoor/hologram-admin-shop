"use client";

import React, { useState, useEffect } from "react";

import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
// import base component
import ProfileComponent from "@/app/BaseComponent/ProfileComponent";
import NavBarToggleBurgerButton from "@/app/BaseComponent/NavBarToggleBurgerButton";
//redux import
import { useSelector, useDispatch } from "react-redux";
import { list } from "../../Store/thunks.js";
import { productListData } from "@/app/Store/slice";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import styled from "styled-components";

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

  // add honors
  const [activekey, setActiveKey] = useState("editUserPage");

  // edit honors
  const [editedHonor, setEditedHonor] = useState(null);

  // const [content, setContent] = useState("");

  const datacome = useSelector(productListData);

  // console.log(datacome);

  useEffect(() => {
    dispatch(list());
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

  return (
    <section>
      <HeadermakeOrder className="d-flex flex-row mb-3 justify-content-between">
        <div className="d-block d-lg-none">
          <NavBarToggleBurgerButton func={() => toggleShow("main")} />
        </div>
        <div>
          {activekey === "editUserPage" && !editedHonor && (
            <>
              <div className="NormalTextSizing textHeaderStyle d-flex align-items-center">
                ویرایش محصولات
              </div>
            </>
          )}
          {activekey === "addUser" && !editedHonor && (
            <>
              <div className="NormalTextSizing textHeaderStyle d-flex align-items-center">
                افزودن محصول
              </div>
            </>
          )}
          {editedHonor && (
            <>
              <div className="NormalTextSizing textHeaderStyle d-flex align-items-center">
                ویرایش محصول
              </div>
            </>
          )}
        </div>
        <ProfileComponent colorGet={"#191919"} />
      </HeadermakeOrder>

      <div className="d-flex  justify-content-end ms-3">
        {activekey === "editUserPage" && !editedHonor && (
          <>
            <div>
              <ButtonColor onClick={() => setActiveKey("addUser")}>
                افزودن محصول
              </ButtonColor>
            </div>
          </>
        )}
        {activekey === "addUser" && !editedHonor && (
          <>
            <div>
              <ButtonColor onClick={() => setActiveKey("editUserPage")}>
                ویرایش محصولات
              </ButtonColor>
            </div>
          </>
        )}
        {editedHonor && (
          <>
            <div>
              <ButtonColor onClick={handleCancelEdit}>محصولات</ButtonColor>
            </div>
          </>
        )}
      </div>

      {activekey === "editUserPage" && !editedHonor && (
        <>
          <GridbaseDiv
            className="mt-3 container"
            style={{ cursor: "pointer" }}
          >
            {datacome &&
              datacome.map((data, index) => (
                <div key={index}>
                  <CARD
                    
                    onClick={() => {
                      setEditedHonor(data);
                    }}
                  >
                    {data.info.imgData && (
                      <CardMedia
                        component="img"
                        src={`${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${data.info.imgData[0].src}`}
                        sx={{
                          width: "100%",
                          maxHeight: "100%",
                          borderRadius: "2px",
                        }}
                      />
                    )}

                    <CardContent className="d-flex flex-column justify-content-around">
                      <TYPOGRAPHY className="titleHonors">
                        {data.name}
                      </TYPOGRAPHY>
                      <div className="d-flex flex-row gap-2">
                        <p>کد محصول :</p>
                        <TYPOGRAPHY className="dateHonors">
                          {data.code}
                        </TYPOGRAPHY>
                      </div>
                    </CardContent>
                  </CARD>
                </div>
              ))}
            {/* {honorsData.map((honor, index) => (
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
            ))} */}
          </GridbaseDiv>
        </>
      )}

      {activekey === "addUser" && !editedHonor && (
        <>
          <AddProduct />
        </>
      )}
      {editedHonor && (
        <>
          <EditProduct
            editedHonor={editedHonor}
            handleCancelEdit={handleCancelEdit}
            setEditedHonor={setEditedHonor}
          />
        </>
      )}
    </section>
  );
}
