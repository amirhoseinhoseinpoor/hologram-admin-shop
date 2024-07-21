"use client";
import Hoc from "../Components/HOCcomponent.js";
import style from "../Styles/AdminStyle/AdminStyle.module.scss";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { banner } from "../Store/slice.js";
import { updateBannerContent } from "../Store/thunks.js";

// import components
import DefineUser from "../eachPageComponent/DefineUser/DefineUserTable.js";



const AdminPanel = () => {
  const dispatch = useDispatch();
  const bannerV = useSelector(banner); // Access banner data from Redux store
  const [bannerImage, setBannerImage] = useState(bannerV?.image || ""); // Set initial image state
  const [bannerText, setBannerText] = useState(bannerV?.text || ""); // Set initial text state
  const [activeTab, setActiveTab] = useState("Doshbord"); // Set initial active tab

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
    <section className={`h-100 ${style.adminPanel}`}>
      <aside className={style.sidebar}>
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          id="admin-tabs"
          className={style.sidebarMain}
        >
          <Tab eventKey="Doshbord" title="داشبورد"></Tab>
          <Tab eventKey="Honors" title="افتخارات"></Tab>
          <Tab eventKey="defineUser" title="مدیریت کاربر"></Tab>
          <Tab eventKey="home" title="تنظیمات"></Tab>
        </Tabs>
      </aside>
      <div className={style.content}>
        {activeTab === "Honors" && (
          <div className={style.tabContent}>
            <h2>Banner</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="bannerImage">Image:</label>
              <input
                type="file"
                id="bannerImage"
                onChange={handleImageChange}
              />
              <label htmlFor="bannerText">Text:</label>
              <textarea
                id="bannerText"
                value={bannerText}
                onChange={handleTextChange}
              />
              <button type="submit">Update Banner</button>
            </form>
          </div>
        )}
        {activeTab === "defineUser" && (
          <div className={style.tabContent}>
            <DefineUser/>
           
          </div>
        )}
        {activeTab === "home" && (
          <div className={style.tabContent}>Tab content for Settings</div>
        )}
      </div>
    </section>
  );
};

AdminPanel.displayName = "AdminPanel";
Hoc(AdminPanel);
export default AdminPanel;
