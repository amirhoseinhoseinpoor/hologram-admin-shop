import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Box,
  CardMedia,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import styled from "styled-components";
import { Editor } from "@tinymce/tinymce-react";
import ConfirmModal from "@/app/BaseComponent/ConfirmingModal";
import ErrorModal from "@/app/BaseComponent/ErrorModal";
import AreYouShureModal from "@/app/BaseComponent/AreYouSureModal";

// import redux
import { useDispatch } from "react-redux";
import { uploadFile } from "@/app/Store/thunks";
import { blogsEdit } from "@/app/Store/thunks";
import { blogsDeleted } from "@/app/Store/thunks";

const BUTTONSSTYLE = styled.div`
  .cancelButtonStyle {
    color: #48abf7;
    background-color: rgba(72, 171, 247, 0.1);
  }

  .deleteButtonStyle {
    color: #ff4f3f !important;
    background-color: transparent;
  }
  .confirmButtonStyle {
    color: white;
    background-color: #1572e8;
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

const FORMCONTROLLABEL = styled(FormControlLabel)`
  .css-ahj2mt-MuiTypography-root {
    font-family: unset !important;
  }
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

const BOX = styled(Box)`
  max-width: 200px;
  max-height: 200px;
  border-radius: 4px;
`;

export default function EditHonors({
  editedHonor,
  handleCancelEdit,
  setEditedHonor,
}) {
  const dispatch = useDispatch();

  const [content, setContent] = useState("");
  const [bannerTitle, setBannerTitle] = useState("");
  const [blogTime, setBlogTime] = useState("");
  const [blogType, setBlogType] = useState("");
  const [bannerTags, setBannerTags] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const [notify, setNotify] = useState(false);
  const [posetives, setposetives] = useState("");
  const [negetive, setnegetive] = useState("");
  // product
  const [productTitle, setproductTitle] = useState("");
  const [productSrc, setproductSrc] = useState("");
  const [productLink, setproductLink] = useState("");

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
      setContent(editedHonor.content.content);
      setBlogTime(editedHonor.content.time);
      setBlogType(editedHonor.content.type);
      setNotify(editedHonor.content.priority);
      setposetives(editedHonor.content.posetives);
      setnegetive(editedHonor.content.negetive);
      setproductTitle(editedHonor.content.product.title);
      setproductSrc(editedHonor.content.product.src);
      setproductLink(editedHonor.content.product.link);
      setBannerTitle(editedHonor.content.title);
      setBannerTags(editedHonor.content.tags);
      setBannerImage(editedHonor.content.imageSrc);
    }
  }, [editedHonor]);

  const handleEditorChange = (newContent) => {
    setContent(newContent);
  };

  const handleTitleChange = (event) => {
    setBannerTitle(event.target.value);
  };

  const handleTimeChange = (event) => {
    setBlogTime(event.target.value);
  };

  const handleTypeChange = (event) => {
    setBlogType(event.target.value);
  };

  const handleTagsChange = (event) => {
    setBannerTags(event.target.value);
  };

  const handlePosetivesChange = (event) => {
    setposetives(event.target.value);
  };

  const handleNegetivesChange = (event) => {
    setnegetive(event.target.value);
  };

  const handleProductTitleChange = (event) => {
    setproductTitle(event.target.value);
  };

  const handleProductLinkChange = (event) => {
    setproductLink(event.target.value);
  };

  const handleNotifyChange = (event) => {
    setNotify(event.target.checked); // Update the notify state
  };

  const handleImageUpload = async (blobInfo, success, failure) => {
    const file = blobInfo.blob();
    const tag = "editorImageBlogs";
    const type = 1;
    const isPublic = true;

    try {
      // Upload the file using your thunk
      const fileId = await dispatch(
        uploadFile({ file, tag, type, isPublic })
      ).unwrap();

      // Construct the valid image URL based on your backend API response
      const imageUrl = `http://176.120.16.221:7000/system/download/${fileId}`;

      // Ensure the image URL is valid and log it for debugging purposes
      console.log("Uploaded image URL:", imageUrl);
      const editor = tinymce.activeEditor; // Get the active editor instance
      editor.insertContent(`<img src="${imageUrl}" alt="Image" />`);

      // success(imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      failure("Image upload failed"); // Return an error to TinyMCE if the upload fails
    }
  };

  // Handle file input change
  const handleBannerImageUpload = async (event) => {
    const file = event.target.files[0]; // Get the selected file
    const tag = "blogMainSrc";
    const type = 1; // Adjust based on your backend logic
    const isPublic = true;

    try {
      // Dispatch the uploadFile thunk
      const fileId = await dispatch(
        uploadFile({ file, tag, type, isPublic })
      ).unwrap();

      // Get the URL of the uploaded image
      // const imageUrl = `http://176.120.16.221/system/download/${fileId}`;
      setBannerImage(fileId); // Store the URL of the uploaded image
    } catch (error) {
      console.error("Error uploading banner image:", error);
    }
  };

  const handleProductSrcChange = async (event) => {
    const file = event.target.files[0]; // Get the selected file
    const tag = "blogProductSrc";
    const type = 1; // Adjust based on your backend logic
    const isPublic = true;

    try {
      // Dispatch the uploadFile thunk
      const fileId = await dispatch(
        uploadFile({ file, tag, type, isPublic })
      ).unwrap();

      // Get the URL of the uploaded image
      // const imageUrl = `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${fileId}`;
      setproductSrc(fileId);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setOpenModal4(false);
    try {
      const deleteVideo = await dispatch(
        blogsDeleted({ code: editedHonor.code })
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
      time: blogTime,
      priority: notify,
      imageSrc: bannerImage,
      tags: bannerTags,
      content: content,
      posetives: posetives,
      negetive: negetive,
      product: {
        title: productTitle,
        src: productSrc,
        link: productLink,
      },
    };

    const finalData = {
      content: formData,
    };

    try {
      const fetchData = await dispatch(
        blogsEdit({ content: finalData, code: editedHonor.code })
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
      <h2>ویرایش وبلاگ</h2>
      <form onSubmit={areYouShureFunction} className="p-3">
        <TEXTFIELD
          fullWidth
          label="عنوان"
          value={bannerTitle}
          onChange={handleTitleChange}
          margin="normal"
        />
        <TEXTFIELD
          fullWidth
          label="زمان مطالعه"
          value={blogTime}
          onChange={handleTimeChange}
          margin="normal"
        />
        <TEXTFIELD
          fullWidth
          label="نوع"
          value={blogType}
          onChange={handleTypeChange}
          margin="normal"
        />
        <p className="VodeoDisSizing mb-1 me-1">عکس اصلی مقاله</p>

        {bannerImage ? (
          <>
            <input
              className="d-none"
              type="file"
              accept={`${process.env.NEXT_PUBLIC_INPUT_IMAGE_FORMAT}`}
              id="blogImage"
              onChange={handleBannerImageUpload}
            />
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

            <div
              className="d-flex flex-column"
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

        {/* <input
          type="file"
          id="bannerImage"
          onChange={handleBannerImageUpload}
        /> */}
        {/* {bannerImage && (
          <Box sx={{ width: "100px", height: "100px", marginTop: "10px" }}>
            <CardMedia
              component="img"
              src={`${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${bannerImage}`}
              sx={{ width: "100%", height: "100%", borderRadius: 3 }}
            />
          </Box>
        )} */}

        <TEXTFIELD
          fullWidth
          label="posetives"
          value={posetives}
          onChange={handlePosetivesChange}
          margin="normal"
        />

        <TEXTFIELD
          fullWidth
          label="negetive"
          value={negetive}
          onChange={handleNegetivesChange}
          margin="normal"
        />

        <TEXTFIELD
          fullWidth
          label="productTitle"
          value={productTitle}
          onChange={handleProductTitleChange}
          margin="normal"
        />

        <label htmlFor="ProductImage">عکس محصول تبلیغاتی</label>
        {productSrc ? (
          <>
            <input
              className="d-none"
              type="file"
              accept={`${process.env.NEXT_PUBLIC_INPUT_IMAGE_FORMAT}`}
              id="blogImage"
              onChange={handleBannerImageUpload}
            />
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
            <div
              className="d-flex flex-column"
              style={{ width: "fit-content" }}
            >
              <BOX
                // onClick={() => handleOpen(logo)}
                component="img"
                src={
                  `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${productSrc}` ||
                  ""
                }
                alt="BlogProductImage"
              />
            </div>
          </>
        ) : (
          <>
            <LABELIMAGEUPLOAD
              className="VodeoDisSizing mb-1"
              htmlFor="ProductImage"
            >
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
              id="ProductImage"
              onChange={handleProductSrcChange}
            />
          </>
        )}

        {/* <input
          type="file"
          id="ProductImage"
          onChange={handleProductSrcChange}
        />
        {productSrc && (
          <Box sx={{ width: "100px", height: "100px", marginTop: "10px" }}>
            <CardMedia
              component="img"
              src={`${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${productSrc}`}
              sx={{ width: "100%", height: "100%", borderRadius: 3 }}
            />
          </Box>
        )} */}

        <TEXTFIELD
          fullWidth
          label="productLink"
          value={productLink}
          onChange={handleProductLinkChange}
          margin="normal"
        />

        <TEXTFIELD
          fullWidth
          label="Tags"
          value={bannerTags}
          onChange={handleTagsChange}
          margin="normal"
        />

        <FORMCONTROLLABEL
          sx={{ fontFamily: "unset" }}
          control={<Checkbox checked={notify} onChange={handleNotifyChange} />}
          label="ایا مقاله مهم و در صفحه اصلی است"
        />

        <div>
          <Editor
            apiKey="3akk9p7jow7ksa3txzom0c8qr4e59rtg6xy1fzvux8vysqs0" // Replace with your TinyMCE API key
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
                "undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | removeformat | image |  h1 h2 h3 h4 h5 h6",
              style_formats: [
                { title: "Header 1", block: "h1" },
                { title: "Header 2", block: "h2" },
                { title: "Header 3", block: "h3" },
                { title: "Header 4", block: "h4" },
                { title: "Header 5", block: "h5" },
                { title: "Header 6", block: "h6" },
              ],
              images_upload_handler: handleImageUpload,
            }}
          />
        </div>

        <BUTTONSSTYLE className="d-flex flex-row justify-content-between">
          <div className="d-flex flex-row mt-3 mb-3 gap-3">
            <button type="submit" className="confirmButtonStyle">
              ویرایش مقاله
            </button>
            <button className="cancelButtonStyle" onClick={handleCancelEdit}>
              انصراف
            </button>
          </div>
          <div>
            <button
              className="mt-2 mb-2 deleteButtonStyle"
              type="button"
              onClick={areYouShureFunction2}
            >
              حذف مقاله
            </button>
          </div>
        </BUTTONSSTYLE>

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
