import React, { useState } from "react";

// import redux
import { useDispatch } from "react-redux";
import { uploadFile } from "@/app/Store/thunks";
import { bannerpot } from "@/app/Store/thunks";
// import modals
import ConfirmModal from "@/app/BaseComponent/Confirmmodal";
import ErrorModal from "@/app/BaseComponent/ErrorModal";
import AreYouShureModal from "@/app/BaseComponent/AreYouSureModal";


export default function AddHonors() {
  const dispatch = useDispatch();


  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerLink, setBannerLink] = useState("");
  const [bannerImage, setBannerImage] = useState(null);

   // modal state
   const [openModal, setOpenModal] = useState(false);
   const [openModal2, setOpenModal2] = useState(false);
   const [openModal3, setOpenModal3] = useState(false);
   // Close modal
   const closeModal = () => setOpenModal(false);
   const closeModal2 = () => setOpenModal2(false);
   const closeModal3 = () => setOpenModal3(false);
  

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
      link: bannerLink,
    };
    try {
      const fetchData = await dispatch(bannerpot(formData)).unwrap();
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
        <label htmlFor="bannerImage">عکس :</label>
        <input type="file" id="bannerImage" onChange={handleBannerImageUpload} />
        <label className="mt-2" htmlFor="bannerTitle">عنوان: </label>
        <input
          id="bannerTitle"
          value={bannerTitle}
          onChange={handleTitleChange}
        />
        <label className="mt-2 mb-2" htmlFor="bannerLink"> لینک : ( اگه خالی بزاریم بنر بدون دکمه میشه )</label>
        <input
          id="bannerLink"
          value={bannerLink}
          onChange={handleLinkChange}
        />
        <button className="mt-3 bg-success" type="submit">اضافه کردن بنر</button>
        {/* modals */}
        <AreYouShureModal
          open={openModal}
          onClose={closeModal}
          text={"ایا از اضافه کردن بلاگ مطمعن هستید"}
          func={handleSubmit}
        />
        <ConfirmModal
          open={openModal2}
          onClose={closeModal2}
          text={"بلاگ با موفقیت اضافه شد"}
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
