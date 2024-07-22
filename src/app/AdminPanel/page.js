"use client";
import Hoc from "../Components/HOCcomponent.js";
import style from "../Styles/AdminStyle/AdminStyle.module.scss";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import React, { useState ,lazy, Suspense } from "react";

// import components

 // lazy loading 
 const DefineUser = lazy(() => import("../eachPageComponent/DefineUser/DefineUserTable.js"));
 const HonorsMainComponent = lazy(() => import("../eachPageComponent/Honors/HonorsMainComponent.js")); 

const AdminPanel = () => {

 

  const [activeTab, setActiveTab] = useState("Doshbord"); 


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
            <Suspense fallback={<div>loading...</div>}> 
              <HonorsMainComponent/>
            </Suspense>
            
          </div>
        )}
        {activeTab === "defineUser" && (
          <div className={style.tabContent}>
            <Suspense fallback={<div>Loading...</div>}>
              <DefineUser />
            </Suspense>
            
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
