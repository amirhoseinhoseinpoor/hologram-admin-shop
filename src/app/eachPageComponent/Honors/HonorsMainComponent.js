"use client";

import React, { useState } from "react";



import { useSelector, useDispatch } from "react-redux";
import { banner } from "../../Store/slice.js";
import { updateBannerContent } from "../../Store/thunks.js";
import  CKEditor  from "./CKEditor.js";

export default function HonorsMainComponent() {
    
  const dispatch = useDispatch();
  const bannerV = useSelector(banner);

  const [bannerImage, setBannerImage] = useState(bannerV?.image || "");
  const [bannerText, setBannerText] = useState(bannerV?.text || "");

  // add honors
  const [activekey, setActiveKey] = useState("editUserPage");

  // image change
  const handleImageChange = (event) => {
    const newImage = event.target.files[0];
    setBannerImage(newImage);
  };

  // text change
  const handleTextChange = (event) => {
    setBannerText(event.target.value);
  };

  // form submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("image", bannerImage); // Append image file
    formData.append("text", bannerText); // Append banner text
    await dispatch(updateBannerContent(formData)); // Dispatch update thunk
  };

  return (
    <section>
      {activekey === "editUserPage" && (
        <>
          <div className="d-flex flex-row justify-content-between mb-2">
            <div>
              <h2 className="m-0"> ویرایش افتخارات</h2>
            </div>
            <div>
              <button onClick={() => setActiveKey("addUser")}>افزودن افتخارات</button>
            </div>
          </div>

         
        </>
      )}


      {activekey === "addUser" && (
        <>
          <div className="d-flex flex-row justify-content-between mb-2">
            <div>
              <h2 className="m-0"> افزودن افتخارات</h2>
            </div>
            <div>
              <button onClick={() => setActiveKey("editUserPage")}>ویرایش افتخارات</button>
            </div>
          </div>

          <div>
          <form onSubmit={handleSubmit}>
            <label htmlFor="bannerImage">Image:</label>
            <input type="file" id="bannerImage" onChange={handleImageChange} />
            <label htmlFor="bannerText">Text:</label>
            <textarea
              id="bannerText"
              value={bannerText}
              onChange={handleTextChange}
            />
            <button type="submit">Update Banner</button>
          </form>
          </div>

          <CKEditor/>
        
        </>
      )}
    </section>
  );
}
