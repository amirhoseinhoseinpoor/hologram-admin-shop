import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addBanner } from "@/app/Store/thunks";

export default function AddHonors() {
  const dispatch = useDispatch();

  const [bannerImage, setBannerImage] = useState(null);

  const handleImageChange = (event) => {
    const newImage = event.target.files[0];
    setBannerImage(newImage);
  };

  // form submit
  const handleSubmit = async (event) => {
    event.preventDefault();

    await dispatch(addBanner({ bannerImage }));
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="bannerImage">عکس :</label>
        <input type="file" id="bannerImage" onChange={handleImageChange} />

        <button type="submit">اضافه کردن بنر</button>
      </form>
    </>
  );
}
