import React, { useState, useEffect } from "react";
import { Button, TextField, Box, CardMedia } from "@mui/material";
import styled from "styled-components";
// import redux
import { useDispatch } from "react-redux";
import { bannerEdit, bannerDeleted, uploadFile } from "@/app/Store/thunks";
// import modals
import ConfirmModal from "@/app/BaseComponent/ConfirmingModal";
import ErrorModal from "@/app/BaseComponent/ErrorModal";
import AreYouShureModal from "@/app/BaseComponent/AreYouSureModal";
import toast from "react-hot-toast";

const TEXTFIELD = styled(TextField)`
  .MuiInputBase-input {
    padding: 10px;
  }
  .css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root {
    transform: translate(50%, 50%);
  }
  .css-md26zr-MuiInputBase-root-MuiOutlinedInput-root {
    font-family: unset !important;
  }
  .css-1jy569b-MuiFormLabel-root-MuiInputLabel-root {
    font-family: unset !important;
  }
  .css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root {
    font-family: unset !important;
  }
  .css-1jy569b-MuiFormLabel-root-MuiInputLabel-root {
    left: 3px;
  }
`;

const ResponsiveDivInputs = styled.div`
  width: 50%;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const MainDivSection = styled.section`
  /* border: 2px solid #c0c0c0; */
  /* border-radius: 6px; */

  padding: 1.25rem;
  gap: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 3px 16px rgba(0, 0, 0, 0.06);
  align-items: center;
`;

const BOX = styled(Box)`
  width: 100%;
  margin-bottom: 10px;
  border-radius: 4px;
`;

const LABELIMAGEUPLOAD = styled.label`
  border: 1px solid #c0c0c0;
  border-radius: 4px;
  padding: 10px;
  width: 100%;
  height: 130px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DELETEUPLODEDIMAGE = styled.button`
  position: absolute;
  top: 0;
  left: 0%;
  transform: translate(50%, 50%);
  border: none;
  border-radius: 4px;
`;

const BUTTONSSTYLE = styled.div`
  display: flex;
  width: 100%;

  .confirmButtonStyle,
  .cancelButtonStyle {
    font-size: 14px;
    padding: 10px 32px;
    border-radius: 10px;
    font-weight: 500;
    transition: 160ms ease;
  }

  .confirmButtonStyle {
    background: #43a047;
    color: #fff;
    border: none;

    &:hover {
      background: #3a8c3e;
      transform: translateY(-1px);
    }
  }

  .cancelButtonStyle {
    background: #fafafa;
    border: 1px solid #d0d0d0;
    color: #444;

    &:hover {
      background: #f0f0f0;
      border-color: #bdbdbd;
      transform: translateY(-1px);
    }
  }
`;

const RedStar = styled.span`
  color: #e91e63;
  padding-left: 2px;
  padding-right: 2px;
`;

export default function EditHonors({
  setUpdateData,
  editedHonor,
  handleCancelEdit,
  setEditedHonor,
}) {
  const dispatch = useDispatch();

  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerLink, setBannerLink] = useState("");
  const [bannerImage, setBannerImage] = useState(null);

  // modal state
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);
  const [openModal4, setOpenModal4] = useState(false);
  // Close modal
  const closeModal = () => setOpenModal(false);
  const closeModal2 = () => setOpenModal2(false);
  const closeModal3 = () => setOpenModal3(false);
  const closeModal4 = () => setOpenModal4(false);

  const validateForm = () => {
    // Main fields
    // if (!bannerTitle.trim())
    //   return { valid: false, message: "لطفا عنوان را وارد کنید" };
    if (!bannerImage)
      return { valid: false, message: "لطفا یک عکس انتخاب کنید" };

    return { valid: true };
  };

  useEffect(() => {
    if (editedHonor) {
      setBannerTitle(editedHonor.title);
      setBannerLink(editedHonor.link);
      setBannerImage(editedHonor.src);
    }
  }, [editedHonor]);

  const handleBannerImageUpload = async (event) => {
    const file = event.target.files[0];
    const tag = "bannerImage";
    const type = 1;
    const isPublic = true;

    try {
      const fileId = await dispatch(
        uploadFile({ file, tag, type, isPublic })
      ).unwrap();

      // const imageUrl = `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${fileId}`;

      setBannerImage(fileId);
    } catch (error) {
      console.error("Error uploading banner image:", error);
    }
  };

  const handleTitleChange = (event) => {
    setBannerTitle(event.target.value);
  };

  const handleLinkChange = (event) => {
    setBannerLink(event.target.value);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setOpenModal4(false);
    try {
      const deleteVideo = await dispatch(
        bannerDeleted({ code: editedHonor.code })
      );
      if (deleteVideo.payload.message === "Success") {
        setOpenModal2(true);
        closeModalOnTimeout();
      } else {
        setOpenModal3(true);
      }
    } catch (error) {
      console.error("Error deleting honors:", error);
    }
  };

  const areYouShureFunction = (e) => {
    e.preventDefault();
    const result = validateForm();

    if (!result.valid) {
      toast.error(result.message);
      return;
    }
    setOpenModal(true);
  };

  const areYouShureFunction2 = (e) => {
    e.preventDefault();
    setOpenModal4(true);
  };

  function closeModalOnTimeout() {
    setTimeout(() => {
      setOpenModal2(false);
      handleCancelEdit();
    }, 3000);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setOpenModal(false);

    const formData = {
      title: bannerTitle || "",
      src: bannerImage,
      link: bannerLink,
    };
    try {
      const fetchData = await dispatch(
        bannerEdit({ banner: formData, code: editedHonor.code })
      ).unwrap();
      setOpenModal2(true);
      closeModalOnTimeout();
    } catch (error) {
      setOpenModal3(true);
      console.error("Error submitting data:", error);
    } finally {
      setUpdateData(true);
    }
  };

  return (
    <section className={`mt-3 container`}>
      <form onSubmit={areYouShureFunction}>
        <MainDivSection className="container">
          <ResponsiveDivInputs className="d-flex flex-row gap-2 align-items-center">
            <p style={{ whiteSpace: "nowrap" }} className="seeOrderFont">
              عنوان :
            </p>
            <TEXTFIELD
              label="عنوان"
              value={bannerTitle}
              onChange={handleTitleChange}
              fullWidth
              margin="normal"
            />
          </ResponsiveDivInputs>

          <ResponsiveDivInputs className="d-flex flex-row gap-2 align-items-center ">
            <p style={{ whiteSpace: "nowrap" }} className="seeOrderFont">
              لینک:
            </p>
            <TEXTFIELD
              label="لینک"
              value={bannerLink}
              onChange={handleLinkChange}
              fullWidth
              margin="normal"
            />
          </ResponsiveDivInputs>

          <div className="mt-3">
            {bannerImage ? (
              <>
                <div
                  className="d-flex flex-column position-relative"
                  style={{ width: "fit-content" }}
                >
                  <BOX
                    component="img"
                    src={
                      `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${bannerImage}` ||
                      ""
                    }
                    alt="UserColorImage"
                  />
                  <DELETEUPLODEDIMAGE onClick={() => setBannerImage(null)}>
                    <svg
                      width={17}
                      height={17}
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.5 2.98828C8.835 2.82328 7.16 2.73828 5.49 2.73828C4.5 2.73828 3.51 2.78828 2.52 2.88828L1.5 2.98828"
                        stroke="#FF4F3F"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4.25 2.485L4.36 1.83C4.44 1.355 4.5 1 5.345 1H6.655C7.5 1 7.565 1.375 7.64 1.835L7.75 2.485"
                        stroke="#FF4F3F"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.4252 4.57031L9.1002 9.60531C9.0452 10.3903 9.0002 11.0003 7.6052 11.0003H4.3952C3.0002 11.0003 2.9552 10.3903 2.9002 9.60531L2.5752 4.57031"
                        stroke="#FF4F3F"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.16504 8.25H6.83004"
                        stroke="#FF4F3F"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4.75 6.25H7.25"
                        stroke="#FF4F3F"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </DELETEUPLODEDIMAGE>
                </div>
              </>
            ) : (
              <>
                <LABELIMAGEUPLOAD htmlFor="blogImage">
                  <div className="d-flex flex-column text-center p-1">
                    <div>
                      <svg
                        width={21}
                        height={21}
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.25 11.25C2.25 13.3713 2.25 14.432 2.90901 15.091C3.56802 15.75 4.62868 15.75 6.75 15.75H11.25C13.3713 15.75 14.432 15.75 15.091 15.091C15.75 14.432 15.75 13.3713 15.75 11.25"
                          stroke="#404040"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9 12V2.25M9 2.25L12 5.53125M9 2.25L6 5.53125"
                          stroke="#404040"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p className={`colorTheInputFile discription`}>
                      بارگذاری فایل .png یا .jpg
                    </p>
                  </div>
                </LABELIMAGEUPLOAD>
                <input
                  className="d-none"
                  type="file"
                  accept={`${process.env.NEXT_PUBLIC_INPUT_IMAGE_FORMAT}`}
                  id="blogImage"
                  onChange={handleBannerImageUpload}
                />
              </>
            )}
          </div>

          <AreYouShureModal
            open={openModal}
            onClose={closeModal}
            text={"ایا از ویرایش بنر مطمعن هستید"}
            func={handleSubmit}
          />
          <AreYouShureModal
            open={openModal4}
            onClose={closeModal4}
            text={"ایا از حذف بنر مطمعن هستید"}
            func={handleDelete}
          />
          <ConfirmModal
            open={openModal2}
            onClose={closeModal2}
            text={"عملیات با موفقیت انجام شد"}
          />
          <ErrorModal
            open={openModal3}
            onClose={closeModal3}
            text={"خطا از لاگین بودن خود اطمینان حاصل فرمایید"}
          />
        </MainDivSection>
        <BUTTONSSTYLE className="d-flex flex-row">
          <div className="d-flex flex-row mt-3 mb-3 gap-3 w-100 justify-content-around">
            <button type="submit" className="confirmButtonStyle">
              ذخیره
            </button>
            <button className="cancelButtonStyle" onClick={handleCancelEdit}>
              انصراف
            </button>
          </div>
          {/* <div>
            <button
              className="mt-2 mb-2 deleteButtonStyle"
              type="button"
              onClick={areYouShureFunction2}
            >
              حذف بنر
            </button>
          </div> */}
        </BUTTONSSTYLE>
      </form>
    </section>
  );
}
