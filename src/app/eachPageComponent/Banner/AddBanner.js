import React, { useState } from "react";

// import redux
import { useDispatch } from "react-redux";
import { uploadFile } from "@/app/Store/thunks";
import { bannerpot } from "@/app/Store/thunks";



export default function AddHonors() {
  const dispatch = useDispatch();


  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerLink, setBannerLink] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  

  const handleTitleChange = (event) => {
    setBannerTitle(event.target.value);
  };

  const handleLinkChange = (event) => {
    setBannerLink(event.target.value);
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

      setBannerImage(fileId); 

    } catch (error) {
      console.error("Error uploading banner image:", error);
    }
  };


  // Form submit logic
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Construct the data to be sent to the backend
    const formData = {
      title: bannerTitle,
      src: bannerImage,
      link: bannerLink,
    };

    console.log(formData);

    try {
      const fetchData = await dispatch(bannerpot(formData)).unwrap();
      console.log(fetchData);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };


  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="bannerImage">عکس :</label>
        <input type="file" id="bannerImage" onChange={handleBannerImageUpload} />
        <label htmlFor="bannerTitle">Title:</label>
        <input
          id="bannerTitle"
          value={bannerTitle}
          onChange={handleTitleChange}
        />
        <label htmlFor="bannerLink">Link:</label>
        <input
          id="bannerLink"
          value={bannerLink}
          onChange={handleLinkChange}
        />

        <button type="submit">اضافه کردن بنر</button>
      </form>
    </>
  );
}
