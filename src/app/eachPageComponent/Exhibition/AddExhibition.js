import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

// import redux
import { useDispatch } from "react-redux";
import { uploadFile } from "../../Store/thunks.js";
import { exhibitionpot } from "../../Store/thunks.js";
// imports modals
import ErrorModal from "@/app/BaseComponent/ErrorModal.js";
import ConfirmModal from "@/app/BaseComponent/Confirmmodal.js";
import AreYouShureModal from "@/app/BaseComponent/AreYouSureModal.js";


export default function AddHonors() {
  const dispatch = useDispatch();

  const [content, setContent] = useState("");
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerTags, setBannerTags] = useState("");
  const [bannerImage, setBannerImage] = useState(null);

  // modal state
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);
  // Close modal
  const closeModal = () => setOpenModal(false);
  const closeModal2 = () => setOpenModal2(false);
  const closeModal3 = () => setOpenModal3(false);

  const handleEditorChange = (newContent) => {
    setContent(newContent);
  };

  const handleTitleChange = (event) => {
    setBannerTitle(event.target.value);
  };

  const handleTagsChange = (event) => {
    setBannerTags(event.target.value);
  };

  const handleImageUpload = async (blobInfo, success, failure) => {
    const file = blobInfo.blob(); // Get the image blob from TinyMCE
    const tag = "editorImageExhibition";
    const type = 1; // Adjust based on your backend logic
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
    const tag = "bannerImage";
    const type = 1; // Adjust based on your backend logic
    const isPublic = true;

    try {
      // Dispatch the uploadFile thunk
      const fileId = await dispatch(
        uploadFile({ file, tag, type, isPublic })
      ).unwrap();

      // Get the URL of the uploaded image
      // const imageUrl = `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${fileId}`;
      
      setBannerImage(fileId); // Store the URL of the uploaded image
    } catch (error) {
      console.error("Error uploading banner image:", error);
    }
  };

  const areYouShureFunction = (e) => {
    e.preventDefault();
    setOpenModal(true);
  };

  function closeModalOnTimeout() {
    setTimeout(() => {
      setOpenModal2(false);
    }, 3000);
  }

  // Form submit logic
  const handleSubmit = async (event) => {
    event.preventDefault();
    setOpenModal(false);

    // Construct the data to be sent to the backend
    const formData = {
      title: bannerTitle,
      src: bannerImage,
      tags: bannerTags,
      content: content, // This will include the content with images inserted as <img src="...">
    };

    console.log(formData);

    try {
      const fetchData = await dispatch(exhibitionpot(formData)).unwrap();
      if (fetchData) {
        setOpenModal2(true);
        closeModalOnTimeout();
      }
    } catch (error) {
      setOpenModal3(true);
      console.error("Error submitting data:", error);
    }
  };

  return (
    <>
      <form onSubmit={areYouShureFunction}>
        <label className="mt-1" htmlFor="bannerTitle">عنوان: </label>
        <input
          id="bannerTitle"
          value={bannerTitle}
          onChange={handleTitleChange}
        />
        <label className="mt-3" htmlFor="bannerImage">عکس اصلی :</label>
        <input
          type="file"
          id="bannerImage"
          onChange={handleBannerImageUpload}
        />

        <label className="mt-3" htmlFor="bannerTags">تگ ها : (با , ازهم جدا شوند)</label>
        <input id="bannerTags" value={bannerTags} onChange={handleTagsChange} />

        <div className="mt-4">
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
                bullist numlist outdent indent | removeformat | image",
              images_upload_handler: handleImageUpload,
            }}
          />
        </div>
        <button className="bg-success mt-3" type="submit">اضافه کردن نمایشگاه</button>
        {/* modals */}
        <AreYouShureModal
          open={openModal}
          onClose={closeModal}
          text={"ایا از اضافه کردن نمایشگاه مطمعن هستید"}
          func={handleSubmit}
        />
        <ConfirmModal
          open={openModal2}
          onClose={closeModal2}
          text={"نمایشگاه با موفقیت اضافه شد"}
        />
        <ErrorModal
          open={openModal3}
          onClose={closeModal3}
          text={"خطا از لاگین بودن خود اطمینان حاصل فرمایید"}
        />
      </form>
    </>
  );
}
