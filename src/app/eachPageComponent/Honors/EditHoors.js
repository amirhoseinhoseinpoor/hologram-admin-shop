import React, { useState, useEffect } from "react";
import { TextField, Box } from "@mui/material";
import styled from "styled-components";
import { Editor } from "@tinymce/tinymce-react";
import { useDispatch } from "react-redux";
import { honorsDeleted, uploadFile, honorsEdit } from "@/app/Store/thunks";
// import modals
import ErrorModal from "@/app/BaseComponent/ErrorModal";
import AreYouShureModal from "@/app/BaseComponent/AreYouSureModal";
import ConfirmModal from "@/app/BaseComponent/ConfirmingModal";

const BUTTONSSTYLE = styled.div`
  .cancelButtonStyle {
    color: #e91e63;
    background-color: unset;
    border : 1px solid #e91e63;
    padding-right : 10px;
    padding-left : 10px;
  }

  .deleteButtonStyle {
    color: #ff4f3f !important;
    background-color: transparent;
  }
  .confirmButtonStyle {
    padding : 0 60px;
    color: white;
    background-color: #43A047;
  }
`;
const DELETEUPLODEDIMAGE = styled.button`
  position: absolute;
  top: 0;
  left: -5%;
  transform: translate(50%, 50%);
  border: none;
  border-radius: 4px;
`;

const BOX = styled(Box)`
  max-width: 200px;
  max-height: 200px;
  border-radius: 4px;
`;

const LABELIMAGEUPLOAD = styled.label`
  border: 1px solid #c0c0c0;
  border-radius: 4px;
  padding: 10px;
  width: 100%;
  height: 77%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
`;

const BorderDiv = styled.div`
 border : 2px solid #42424a;
 border-radius: 6px;
 padding: 10px;
`

const TEXTFIELD = styled(TextField)`
  .MuiInputBase-input {
    padding: 8px;
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
  .css-17vbkzs-MuiFormControl-root-MuiTextField-root{
    margin: 0px !important;
  }
`;

export default function EditHonors({
  editedHonor,
  handleCancelEdit,
  setEditedHonor,
}) {
  const dispatch = useDispatch();

  const [content, setContent] = useState(""); // No array, just a string
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
    const tag = "editorImageHonors";
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
    const tag = "honorImage";
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
        honorsDeleted({ code: editedHonor.code })
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
        honorsEdit({ honor: formData, code: editedHonor.code })
      ).unwrap();
      setOpenModal2(true);
      closeModalOnTimeout();
    } catch (error) {
      setOpenModal3(true);
      console.error("Error submitting data:", error);
    }
  };

  return (
    <div className="mt-3 container">
      <p className="QASize text-center mb-4">ویرایش افتخارات</p>
      <form onSubmit={areYouShureFunction}>
        <BorderDiv className="d-flex flex-row justify-content-between">
          <div className="me-3 w-50">
            <div className="d-flex flex-row gap-2 align-items-center">
              <p style={{whiteSpace : "nowrap"}} className="seeOrderFont">عنوان :</p>
              <TEXTFIELD
                label="عنوان"
                value={bannerTitle}
                onChange={handleTitleChange}
                fullWidth
                margin="normal"
              />
            </div>

            <div className="d-flex flex-row gap-2 align-items-center">
              <p style={{whiteSpace : "nowrap"}} className="seeOrderFont">تگ ها :</p>
              <TEXTFIELD
                label="تگ ها"
                value={bannerTags}
                onChange={handleTagsChange}
                fullWidth
                margin="normal"
              />
            </div>
          </div>
          <div className="ms-4">
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
        </BorderDiv>

        {/* <input
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
        )} */}

        <div className="mt-4">
          <Editor
            apiKey="3akk9p7jow7ksa3txzom0c8qr4e59rtg6xy1fzvux8vysqs0"
            value={content} 
            onEditorChange={handleEditorChange} 
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
          text={"ایا از ویرایش افتخار مطمعن هستید"}
          func={handleSubmit}
        />
        <AreYouShureModal
          open={openModal4}
          onClose={closeModal4}
          text={"ایا از حذف افتخار مطمعن هستید"}
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
