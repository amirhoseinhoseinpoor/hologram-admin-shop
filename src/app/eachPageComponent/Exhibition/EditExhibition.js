import React, { useState, useEffect } from "react";
import { Button, TextField, Box, CardMedia } from "@mui/material";
import styled from "styled-components";
import { Editor } from "@tinymce/tinymce-react";
// improt redux
import { useDispatch } from "react-redux";
import {
  exhibitionDeleted,
  uploadFile,
  exhibitionEdit,
} from "@/app/Store/thunks";
// import modals
import AreYouShureModal from "@/app/BaseComponent/AreYouSureModal";
import ErrorModal from "@/app/BaseComponent/ErrorModal";
import ConfirmModal from "@/app/BaseComponent/Confirmmodal";

const TEXTFIELD = styled(TextField)`
 .MuiInputBase-root {
    font-family: unset !important;
  }
  .MuiInputBase-input {
    padding: 5px;
  }
  .css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root {
    transform: translate(50%, 50%);
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

  const [content, setContent] = useState("");
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerTags, setBannerTags] = useState("");
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
      setContent(editedHonor.content); // Set content directly
      setBannerTitle(editedHonor.title);
      setBannerTags(editedHonor.tags);
      setBannerImage(editedHonor.src);
    }
  }, [editedHonor]);

  const handleEditorChange = (newContent) => {
    setContent(newContent); // Update content state
  };

  const handleTitleChange = (event) => {
    setBannerTitle(event.target.value);
  };

  const handleTagsChange = (event) => {
    setBannerTags(event.target.value);
  };

  const handleImageUpload = async (blobInfo, success, failure) => {
    const file = blobInfo.blob();
    const tag = "editorImageExhibition";
    const type = 1;
    const isPublic = true;

    try {
      const fileId = await dispatch(
        uploadFile({ file, tag, type, isPublic })
      ).unwrap();
      const imageUrl = `http://176.120.16.221:7000/system/download/${fileId}`;
      const editor = tinymce.activeEditor;
      editor.insertContent(`<img src="${imageUrl}" alt="Image" />`);
    } catch (error) {
      failure("Image upload failed");
    }
  };

  const handleBannerImageUpload = async (event) => {
    const file = event.target.files[0];
    const tag = "exhibitionMainImage";
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

  const handleDelete = async (e) => {
    e.preventDefault();
    setOpenModal4(false);
    try {
      const deleteVideo = await dispatch(
        exhibitionDeleted({ code: editedHonor.code })
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
      tags: bannerTags,
      content: content, // Send the content state directly
    };
    try {
      const fetchData = await dispatch(
        exhibitionEdit({ exhibition: formData, code: editedHonor.code })
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
      <h2>ویرایش نمایشگاه</h2>
      <form onSubmit={areYouShureFunction}>
        <TEXTFIELD
          label="Title"
          value={bannerTitle}
          onChange={handleTitleChange}
          fullWidth
          margin="normal"
        />
        <TEXTFIELD
          label="Tags"
          value={bannerTags}
          onChange={handleTagsChange}
          fullWidth
          margin="normal"
        />
        <input
          type="file"
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

        <div className="mt-3">
          <Editor
            apiKey="3akk9p7jow7ksa3txzom0c8qr4e59rtg6xy1fzvux8vysqs0"
            value={content} // Set the content state directly
            onEditorChange={handleEditorChange} // Update content state on change
            init={{
              height: 500,
              menubar: false,
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "help",
                "wordcount",
              ],
              toolbar:
                "undo redo | formatselect | bold italic backcolor | " +
                "alignleft aligncenter alignright alignjustify | " +
                "bullist numlist outdent indent | removeformat | image",
              images_upload_handler: handleImageUpload,
            }}
          />
        </div>

        <BUTTON className="mt-3" variant="contained" type="submit">
          تایید
        </BUTTON>
        <BUTTON
          className="bg-danger mt-2 mb-2"
          type="button"
          onClick={areYouShureFunction2}
        >
          حذف نمایشگاه
        </BUTTON>
        <BUTTON className="bg-warning" variant="contained" onClick={handleCancelEdit}>
          انصراف
        </BUTTON>
        {/* modal  */}
        <AreYouShureModal
          open={openModal}
          onClose={closeModal}
          text={"ایا از ویرایش وبلاگ مطمعن هستید"}
          func={handleSubmit}
        />
        <AreYouShureModal
          open={openModal4}
          onClose={closeModal4}
          text={"ایا از حذف وبلاگ مطمعن هستید"}
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
