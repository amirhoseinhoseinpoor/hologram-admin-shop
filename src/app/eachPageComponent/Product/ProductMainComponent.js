"use client";

import React, { useState, useEffect } from "react";

import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
//redux import
import { useSelector, useDispatch } from "react-redux";
import { list } from "../../Store/thunks.js";
import { productListData } from "@/app/Store/slice";



import { Card, CardContent, CardMedia, Typography } from "@mui/material";
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
              <h2 className="m-0">ویرایش محصولات</h2>
            </div>
            <div>
              <button style={{backgroundColor: "green"}} onClick={() => setActiveKey("addUser")}>
                افزودن محصول
              </button>
            </div>
          </div>
          <div
            className="mt-3 d-flex flex-column gap-3"
            style={{ cursor: "pointer" }}
          >
            {datacome &&
              datacome.map((data, index) => (
                <div key={index}>
                  <CARD
                    className="d-flex flex-row"
                    onClick={() => {
                      setEditedHonor(data);
                    }}
                  >
                    {data.info.imgData && (
                      <CardMedia
                        component="img"
                        src={`${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${data.info.imgData[0].src}`}
                        sx={{
                          width: "120px",
                          maxHeight: "100%",
                          borderRadius: "2px",
                        }}
                      />
                    )}

                    <CardContent className="d-flex flex-column justify-content-around">
                      <Typography className="titleHonors">
                        {data.name}
                      </Typography>
                      <div className="d-flex flex-row gap-2">
                        <p>کد محصول :</p>
                        <Typography className="dateHonors">
                          {data.code}
                        </Typography>
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
          </div>
        </>
      )}

      {activekey === "addUser" && !editedHonor && (
        <>
          <div className="d-flex flex-row justify-content-between mb-2">
            <div>
              <h2  className="m-0"> افزودن محصول</h2>
            </div>
            <div>
              <button className="bg-success" onClick={() => setActiveKey("editUserPage")}>
                ویرایش محصولات
              </button>
            </div>
          </div>

          <div>
            <AddProduct />
          </div>
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
