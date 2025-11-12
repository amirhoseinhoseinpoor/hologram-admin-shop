import React, { useState, useEffect } from "react";
import { Button, TextField, Box } from "@mui/material";
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
import ConfirmModal from "@/app/BaseComponent/ConfirmingModal";

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

const LABELIMAGEUPLOAD = styled.label`
  border: 1px solid #c0c0c0;
  border-radius: 4px;
  padding: 25px;
  width: 100%;
  height: 77%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const BorderDiv = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.25rem;
  gap: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 3px 16px rgba(0, 0, 0, 0.06);
  align-items: center;
  @media (max-width: 768px) {
    flex-direction: column !important;
    .inputMainDiv {
      width: 100% !important;
    }
  }
`;

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

const BOX = styled(Box)`
  max-width: 200px;
  max-height: 200px;
  border-radius: 4px;
`;

const DELETEUPLODEDIMAGE = styled.button`
  position: absolute;
  top: 0;
  left: -5%;
  transform: translate(50%, 50%);
  border: none;
  border-radius: 4px;
`;

export default function EditHonors({
  setUpdateData,
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
      handleCancelEdit();
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
    }finally{
      setUpdateData(true);
    }
  };

  return (
    <div className="mt-3 container">
      <p className="QASize text-center mb-4">ویرایش نمایشگاه</p>
      <form onSubmit={areYouShureFunction}>
        <BorderDiv className="d-flex flex-row justify-content-between">
          <div className="inputMainDiv me-3 w-50">
            <div className="d-flex flex-row gap-2 align-items-center">
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
            </div>
            <div className="d-flex flex-row gap-2 align-items-center">
              <p style={{ whiteSpace: "nowrap" }} className="seeOrderFont">
                عنوان :
              </p>
              <TEXTFIELD
                label="تگ ها"
                value={bannerTags}
                onChange={handleTagsChange}
                fullWidth
                margin="normal"
              />
            </div>
          </div>
          <div>
            {bannerImage ? (
              <>
                <div
                  className="d-flex flex-column position-relative"
                  style={{ width: "fit-content" }}
                >
                  <BOX
                    // onClick={() => handleOpen(logo)}
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
                  <div className="d-flex flex-column text-center p-1 ">
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
        </BorderDiv>

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

        <BUTTONSSTYLE className="d-flex flex-row justify-content-between">
          <div className="d-flex flex-row mt-3 mb-3 gap-3 justify-content-around w-100">
            <button type="submit" className="confirmButtonStyle">
              ذخیره
            </button>
            <button className="cancelButtonStyle" onClick={handleCancelEdit}>
              انصراف
            </button>
          </div>
        </BUTTONSSTYLE>

        {/* modal  */}
        <AreYouShureModal
          open={openModal}
          onClose={closeModal}
          text={"ایا از ویرایش نمایشگاه مطمئن هستید"}
          func={handleSubmit}
        />
        <AreYouShureModal
          open={openModal4}
          onClose={closeModal4}
          text={"ایا از حذف نمایشگاه مطمئن هستید"}
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
          text={"خطا در انجام عملیات"}
        />
      </form>
    </div>
  );
}
