import React, { useState, useEffect } from "react";
import { Button, TextField, Box, CardMedia } from "@mui/material";
import styled from "styled-components";
// import redux
import { useDispatch } from "react-redux";
import { bannerEdit, bannerDeleted, uploadFile } from "@/app/Store/thunks";
// import modals
import ConfirmModal from "@/app/BaseComponent/Confirmmodal";
import ErrorModal from "@/app/BaseComponent/ErrorModal";
import AreYouShureModal from "@/app/BaseComponent/AreYouSureModal";

const TEXTFIELD = styled(TextField)`
  .MuiInputBase-input {
    margin-bottom: 0;
  }
`;

const BUTTON = styled(Button)`
  font-family: unset !important;
`;

export default function EditHonors({
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
    setOpenModal(true);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setOpenModal(false);

    const formData = {
      title: bannerTitle,
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
    }
  };

  return (
    <div className="mt-3">
      <h2>ویرایش بنر</h2>
      <form onSubmit={areYouShureFunction}>
        <TEXTFIELD
          label="Title"
          value={bannerTitle}
          onChange={handleTitleChange}
          fullWidth
          margin="normal"
        />
        <TEXTFIELD
          label="Link"
          value={bannerLink}
          onChange={handleLinkChange}
          fullWidth
          margin="normal"
        />

        <label htmlFor="bannerImage">Select Image:</label>
        <input
          type="file"
          id="bannerImage"
          onChange={handleBannerImageUpload}
          accept="image/*"
        />

        {bannerImage && (
          <Box sx={{ width: "100px", height: "100px", marginTop: "10px" }}>
            <CardMedia
              component="img"
              src={`${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${bannerImage}`}
              sx={{ width: "100%", height: "100%", borderRadius: 3 }}
            />
          </Box>
        )}

        <BUTTON className="mt-4" variant="contained" type="submit">
          تایید
        </BUTTON>
        <BUTTON
          className="bg-danger mt-2 mb-2"
          type="button"
          onClick={areYouShureFunction2}
        >
          حذف بنر
        </BUTTON>
        <BUTTON className="bg-warning" variant="contained" onClick={handleCancelEdit}>
          انصراف
        </BUTTON>
        {/* modal  */}
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
      </form>
    </div>
  );
}
