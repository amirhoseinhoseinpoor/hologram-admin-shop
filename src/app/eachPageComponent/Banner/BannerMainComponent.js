"use client";

import React, { useState, useEffect } from "react";

import AddBanner from "./AddBanner";
import EditBanner from "./EditBanner";
//redux import
import { useDispatch } from "react-redux";
import { bannerList } from "@/app/Store/thunks";
import { bannerDeleted } from "@/app/Store/thunks";

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Skeleton,
} from "@mui/material";
import styled from "styled-components";
import PreviewIcon from "@mui/icons-material/Preview";
import DeleteIcon from "@mui/icons-material/Delete";

// improt base component
import ProfileComponent from "@/app/BaseComponent/ProfileComponent";
import NavBarToggleBurgerButton from "@/app/BaseComponent/NavBarToggleBurgerButton";
import { formatPersianDate } from "@/app/utils/persionDateUtils";
import AreYouShureModal from "@/app/BaseComponent/AreYouSureModal";
import ConfirmingModal from "@/app/BaseComponent/ConfirmingModal";
import ErrorModal from "@/app/BaseComponent/ErrorModal";

const HeadermakeOrder = styled.div`
  padding: 10px;
  color: white;
  background-color: rgb(225, 223, 223);
  border-radius: 4px;
  margin: 7px 15px;
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
  /* box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); */
  display: flex;
  flex-direction: column;
  height: fit-content;
  .zIndex {
    z-index: 12;
  }

  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
  background-color: #f7f7f7;
  transition: transform 0.3s ease;
  cursor: pointer;
  max-width: 500px;
  max-height: 500px;
  min-height:100px;


  &:hover {
    transform: translateY(-5px);
  }

  .deleteDiv {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    padding: 10px;
    &:hover {
      background-color: #66bb6a;
    }
  }
  .MuiCardContent-root {
    position: absolute;
    bottom: 0;
    color: white;
    padding: 1.5rem;

    .titleHonors {
      font-size: 1.5rem;
      font-weight: 600;
    }
  }
  .css-46bh2p-MuiCardContent-root:last-child {
    padding-bottom: 10px;
    text-align: center;
  }
`;

const GradientOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
`;

const GridbaseDiv = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 50px;
  width: 70%;
  @media (max-width: 980px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
    width: 70%;
    grid-gap: 40px;
  }
`;

const ButtonColor = styled.button`
  background-image: linear-gradient(195deg, #66bb6a 0%, #43a047 100%);
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
  const [indexDeleted, setIndexDeleted] = useState(null);
  const [updateData, setUpdateData] = useState(false);
  const [trackLoadingProduct, setTrackLoadingProduct] = useState(false);

  const [openModal2, setOpenModal2] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);
  const [openModal4, setOpenModal4] = useState(false);

  const closeModal2 = () => setOpenModal2(false);
  const closeModal3 = () => setOpenModal3(false);
  const closeModal4 = () => setOpenModal4(false);

  useEffect(() => {
    const fechData = async () => {
      try {
        setTrackLoadingProduct(true);
        const dataComeAPI = await dispatch(bannerList()).unwrap();
        setDataCome(dataComeAPI || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setTrackLoadingProduct(false);
        setUpdateData(false);
      }
    };

    fechData();
  }, [dispatch, updateData]);

  const handleDelete = async (e) => {
    e.preventDefault();
    setOpenModal4(false);
    try {
      const deleteVideo = await dispatch(bannerDeleted({ code: indexDeleted }));
      if (deleteVideo.payload.message === "Success") {
        setUpdateData(true);
        setOpenModal2(true);
        closeModalOnTimeout();
      } else {
        setOpenModal3(true);
      }
    } catch (error) {
      console.error("Error deleting honors:", error);
    }
  };

  const areYouShureFunction2 = (e) => {
    e.preventDefault();
    setOpenModal4(true);
  };

  function closeModalOnTimeout() {
    setTimeout(() => {
      setOpenModal2(false);
    }, 3000);
  }

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
            <div className="NormalTextSizing text-decoration-underline textHeaderStyle d-flex align-items-center">
              ویرایش بنر
            </div>
          </>
        )}
        {activekey === "addUser" && !editedHonor && (
          <>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => setActiveKey("editUserPage")}
              className="NormalTextSizing text-decoration-underline textHeaderStyle d-flex align-items-center"
            >
              بنر
            </div>
          </>
        )}
        {editedHonor && (
          <>
            <div
              style={{ cursor: "pointer" }}
              onClick={handleCancelEdit}
              className="NormalTextSizing text-decoration-underline textHeaderStyle d-flex align-items-center"
            >
              بنر
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
                افزودن بنر
              </ButtonColor>
            </div>
          </>
        )}
        {/* {activekey === "addUser" && !editedHonor && (
          <>
            <div>
              <ButtonColor onClick={() => setActiveKey("editUserPage")}>
                ویرایش بنر
              </ButtonColor>
            </div>
          </>
        )}
        {editedHonor && (
          <>
            <div>
              <ButtonColor onClick={handleCancelEdit}>بنر ها</ButtonColor>
            </div>
          </>
        )} */}
      </div>
      {/* content */}
      {activekey === "editUserPage" && !editedHonor && (
        <>
          <GridbaseDiv className="mt-3 container" style={{ cursor: "pointer" }}>
            {trackLoadingProduct ? (
              <>
                <Skeleton
                  animation="wave"
                  variant="rounded"
                  className="w-100"
                  height={300}
                />
                <Skeleton
                  animation="wave"
                  variant="rounded"
                  className="w-100"
                  height={300}
                />
              </>
            ) : (
              <>
                {dataCome.length > 0 ? (
                  dataCome.map((data, index) => (
                    <React.Fragment key={index}>
                      <CARD className="position-relative">
                        <div className="position-absolute zIndex  w-100 top-0 ">
                          <div className="d-flex mb-1 mt-1 justify-content-end align-items-center container ">
                            {/* <div
                            onClick={() => {
                              setEditedHonor(data);
                            }}
                          >
                            <PreviewIcon style={{ color: "#3892F3" }} />
                          </div> */}

                            <div
                              className="deleteDiv"
                              onClick={(e) => {
                                setIndexDeleted(data?.code);
                                areYouShureFunction2(e);
                              }}
                            >
                              <DeleteIcon style={{ color: "#FF4C4C" }} />
                            </div>
                          </div>
                        </div>
                        <div
                          onClick={() => {
                            setEditedHonor(data);
                          }}
                        >
                          <CardMedia
                            component="img"
                            src={`${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${data.src}`}
                            sx={{
                              width: "100%",
                              maxHeight: "100%",
                              borderRadius: "2px",
                            }}
                          />
                          <GradientOverlay />
                          <CardContent className="d-flex flex-column justify-content-around">
                            <TYPOGRAPHY className="titleHonors">
                              {data.title}
                            </TYPOGRAPHY>
                            <TYPOGRAPHY className="dateHonors">
                              {formatPersianDate(data.date)}
                            </TYPOGRAPHY>
                          </CardContent>
                        </div>
                      </CARD>
                    </React.Fragment>
                  ))
                ) : (
                  <TYPOGRAPHY variant="body2">در حال حاضر دیتایی موجود نمیباشد</TYPOGRAPHY>
                )}
              </>
            )}
          </GridbaseDiv>
        </>
      )}

      {activekey === "addUser" && !editedHonor && (
        <>
          <div>
            <AddBanner setUpdateData={setUpdateData} setActiveKey={setActiveKey} />
          </div>
        </>
      )}
      {editedHonor && (
        <>
          <EditBanner
            setUpdateData={setUpdateData}
            editedHonor={editedHonor}
            handleCancelEdit={handleCancelEdit}
            setEditedHonor={setEditedHonor}
          />
        </>
      )}
      <AreYouShureModal
        open={openModal4}
        onClose={closeModal4}
        text={"ایا از حذف بنر مطمعن هستید"}
        func={handleDelete}
      />
      <ConfirmingModal
        open={openModal2}
        onClose={closeModal2}
        text={"عملیات با موفقیت انجام شد"}
      />
      <ErrorModal
        open={openModal3}
        onClose={closeModal3}
        text={"خطا در انجام عملیات"}
      />
    </section>
  );
}
