"use client";

import { PrimaryButton } from "@/app/BaseComponent/Buttons";
import { HeadermakeOrder } from "@/app/BaseComponent/PageHeader";
import React, { useState, useEffect } from "react";

import AddBlogs from "./AddBlogs";
import EditBlogs from "./EditBlogs";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Skeleton,
} from "@mui/material";
import styled from "styled-components";
import AddIcon from "@mui/icons-material/Add";
import PageToolbar from "@/app/BaseComponent/PageToolbar";
import { formatPersianDate } from "@/app/utils/persionDateUtils";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateIcon from "@mui/icons-material/Create";

// import baseComponents
import ProfileComponent from "@/app/BaseComponent/ProfileComponent";
import NavBarToggleBurgerButton from "@/app/BaseComponent/NavBarToggleBurgerButton";
import AreYouShureModal from "@/app/BaseComponent/AreYouSureModal";
import ConfirmingModal from "@/app/BaseComponent/ConfirmingModal";
import ErrorModal from "@/app/BaseComponent/ErrorModal";
import EmptyState from "@/app/BaseComponent/EmptyState";

//redux import
import { useDispatch } from "react-redux";
import { blogsList, blogsDeleted } from "@/app/Store/thunks";

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
  border-radius: var(--r-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  background-color: #f7f7f7;
  transition: transform 0.3s ease;
  cursor: pointer;
  min-height: 100px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }

  .deleteDiv {
    background-color: rgba(255, 255, 255, 0.92);
    border-radius: 50%;
    padding: 6px;
    display: flex;
    transition: background-color 0.15s ease;
    &:hover {
      background-color: var(--c-danger-50);
    }
  }
  .MuiCardContent-root {
    position: absolute;
    bottom: 0;
    color: white;
    padding: 1rem;

    .titleHonors {
      font-size: 1.05rem;
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
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  width: 100%;

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const ButtonColor = PrimaryButton;

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

        const dataComeAPI = await dispatch(blogsList()).unwrap();
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
      const deleteVideo = await dispatch(blogsDeleted({ code: indexDeleted }));
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
              مدیریت مقالات
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
              مدیریت مقالات {`>`} اضافه کردن
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
              مدیریت مقالات {`>`} ویرایش
            </div>
          </>
        )}
        <ProfileComponent />
      </HeadermakeOrder>

      {/* tabs */}
      {activekey === "editUserPage" && !editedHonor && (
        <PageToolbar
          title="مقالات"
          count={dataCome.length}
          loading={trackLoadingProduct}
        >
          <ButtonColor onClick={() => setActiveKey("addUser")}>
            <AddIcon />
            افزودن مقالات
          </ButtonColor>
        </PageToolbar>
      )}

      {/* content */}
      {activekey === "editUserPage" && !editedHonor && (
        <>
          <GridbaseDiv className="mt-3" style={{ cursor: "pointer" }}>
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
                          <div className="d-flex mb-1 mt-1 justify-content-end align-items-center container">
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
                            src={`${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${data.content.imageSrc}`}
                            sx={{
                              width: "100%",
                              maxHeight: "100%",
                              borderRadius: "2px",
                            }}
                          />
                          <GradientOverlay />
                          <CardContent className="d-flex flex-column justify-content-around">
                            <TYPOGRAPHY className="titleHonors">
                              {data.content.title}
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
                  <EmptyState
                    illustrationUrl="/illustrations/empty-blogs.svg"
                    title="هیچ مقاله‌ای یافت نشد"
                    description="مقاله جدید بنویسید و با مخاطبان خود به اشتراک بگذارید."
                    actionButtonText="نوشتن مقاله جدید"
                    actionButtonIcon={<CreateIcon />}
                    onActionClick={() => setActiveKey("addUser")}
                    variant="grid"
                  />
                )}
              </>
            )}
          </GridbaseDiv>
        </>
      )}

      {activekey === "addUser" && !editedHonor && (
        <>
          <div>
            <AddBlogs
              dataCome={dataCome}
              setActiveKey={setActiveKey}
              setUpdateData={setUpdateData}
            />
          </div>
        </>
      )}
      {editedHonor && (
        <>
          <EditBlogs
            dataCome={dataCome}
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
        text={"آیا از حذف مقاله مطمئن هستید؟"}
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
        text={"خطا در انجام عملیات، لطفاً دوباره تلاش کنید"}
      />
    </section>
  );
}
