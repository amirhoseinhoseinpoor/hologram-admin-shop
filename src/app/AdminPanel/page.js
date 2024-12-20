"use client";
import Hoc from "../Components/HOCcomponent.js";
import style from "../Styles/AdminStyle/AdminStyle.module.scss";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { Offcanvas, Navbar, Nav } from "react-bootstrap";
import React, { useState, lazy, Suspense } from "react";
import dynamic from "next/dynamic";
import CustomCloseButton from "../BaseComponent/CustomCloseButton.js";

// mui icons import
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import StorefrontIcon from "@mui/icons-material/Storefront";
import BookIcon from "@mui/icons-material/Book";
import PatternIcon from "@mui/icons-material/Pattern";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import BalconyIcon from "@mui/icons-material/Balcony";
import ViewArrayIcon from "@mui/icons-material/ViewArray";
import VideocamIcon from "@mui/icons-material/Videocam";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";



// import components
const DefineUser = lazy(() =>
  import("../eachPageComponent/DefineUser/DefineUserTable.js")
);
const HonorsMainComponent = lazy(() =>
  import("../eachPageComponent/Honors/HonorsMainComponent.js")
);

const DoshbordMainComponent = dynamic(
  () => import("../eachPageComponent/Doshbord/DoshbordMainComponent.js"),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

const OrderMainComponent = dynamic(
  () => import("../eachPageComponent/Orders/OrderMainComponent.js"),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

const ExhibitionMainComponent = dynamic(
  () => import("../eachPageComponent/Exhibition/ExhibitionMainComponent.js"),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

const BlogsMainComponent = dynamic(
  () => import("../eachPageComponent/Blogs/BlogsMainComponent.js"),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

const VideoMainComponent = dynamic(
  () => import("../eachPageComponent/Video/VideoMainComponent.js"),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

const ProductMainComponent = dynamic(
  () => import("../eachPageComponent/Product/ProductMainComponent.js"),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

const BannerMainComponent = dynamic(
  () => import("../eachPageComponent/Banner/BannerMainComponent.js"),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

const HeaderMainComponent = dynamic(
  () => import("../eachPageComponent/Header/HeaderMainComponent.js"),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("Product");
  // State to manage visibility of all off-canvas elements dynamically
  const [visibility, setVisibility] = useState({});

  // Function to close a specific off-canvas
  const handleClose = (key) => {
    setVisibility((prev) => ({ ...prev, [key]: false }));
  };

  // Function to toggle visibility
  const toggleShow = (key) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section className={` ${style.adminPanel}`}>
      <aside className={`${style.sidebar} d-lg-flex d-none me-2 my-2`}>
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          id="admin-tabs1"
          className={`${style.sidebarMain} discription mt-3`}
        >
          <Tab
            eventKey="Doshbord"
            title={
              <>
                <SpaceDashboardIcon /> داشبورد
              </>
            }
          ></Tab>
          <Tab
            eventKey="Orders"
            title={
              <>
                <ListAltIcon/> سفارشات
              </>
            }
          ></Tab>
          <Tab
            eventKey="header"
            title={
              <>
                <PatternIcon /> ساخت هدر
              </>
            }
          ></Tab>
          <Tab
            eventKey="Product"
            title={
              <>
                <StorefrontIcon /> محصولات
              </>
            }
          ></Tab>
          <Tab
            eventKey="Blogs"
            title={
              <>
                <BookIcon /> مقالات
              </>
            }
          ></Tab>
          <Tab
            eventKey="Honors"
            title={
              <>
                <MilitaryTechIcon /> افتخارات
              </>
            }
          ></Tab>
          <Tab
            eventKey="Exhibition"
            title={
              <>
                <BalconyIcon /> نمایشگاه ها
              </>
            }
          ></Tab>
          <Tab
            eventKey="Banner"
            title={
              <>
                <ViewArrayIcon /> بنر
              </>
            }
          ></Tab>
          <Tab
            eventKey="Video"
            title={
              <>
                <VideocamIcon /> ویدیو
              </>
            }
          ></Tab>
          <Tab
            eventKey="defineUser"
            title={
              <>
                <PeopleIcon /> مدیریت کاربر
              </>
            }
          ></Tab>
          {/* <Tab
            eventKey="setting"
            title={
              <>
                <SettingsIcon /> تنظیمات
              </>
            }
          ></Tab> */}
        </Tabs>
      </aside>

      <div className={`${style.content}`}>
        <div className="w-100 ">
          {/* <div className="d-block d-lg-none">
            <NavBarToggleBurgerButton func={() => toggleShow("main")}/>
          </div> */}

          <Navbar.Offcanvas
            placement="end"
            className={` ${style.navbaritemheader}`}
            show={visibility["main"]}
            onHide={() => handleClose("main")}
            id="basic-navbar-nav"
          >
            <Offcanvas.Header
              className={`${style.offcanvasheader} ${style.nextoffcanvas}`}
              closeButton={false}
            >
              <Offcanvas.Title>لوگو</Offcanvas.Title>
              <CustomCloseButton color={'#262626'} onClick={() => handleClose("main")} />
            </Offcanvas.Header>

            <Nav className="align-items-center gap-3">
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                id="admin-tabs2"
                className={`${style.sidebarMain} NormalTextSizing`}
              >
                <Tab
                  eventKey="Doshbord"
                  title={
                    <>
                      <SpaceDashboardIcon /> داشبورد
                    </>
                  }
                ></Tab>
                <Tab
                  eventKey="Orders"
                  title={
                    <>
                      <ListAltIcon /> سفارشات
                    </>
                  }
                ></Tab>
                <Tab
                  eventKey="header"
                  title={
                    <>
                      <PatternIcon /> ساخت هدر
                    </>
                  }
                ></Tab>
                <Tab
                  eventKey="Product"
                  title={
                    <>
                      <StorefrontIcon /> محصولات
                    </>
                  }
                ></Tab>
                <Tab
                  eventKey="Blogs"
                  title={
                    <>
                      <BookIcon /> مقالات
                    </>
                  }
                ></Tab>
                <Tab
                  eventKey="Honors"
                  title={
                    <>
                      <MilitaryTechIcon /> افتخارات
                    </>
                  }
                ></Tab>
                <Tab
                  eventKey="Exhibition"
                  title={
                    <>
                      <BalconyIcon /> نمایشگاه ها
                    </>
                  }
                ></Tab>
                <Tab
                  eventKey="Banner"
                  title={
                    <>
                      <ViewArrayIcon /> بنر
                    </>
                  }
                ></Tab>
                <Tab
                  eventKey="Video"
                  title={
                    <>
                      <VideocamIcon /> ویدیو
                    </>
                  }
                ></Tab>
                <Tab
                  eventKey="defineUser"
                  title={
                    <>
                      <PeopleIcon /> مدیریت کاربر
                    </>
                  }
                ></Tab>
                {/* <Tab
                  eventKey="setting"
                  title={
                    <>
                      <SettingsIcon /> تنظیمات
                    </>
                  }
                ></Tab> */}
              </Tabs>
            </Nav>
          </Navbar.Offcanvas>
        </div>

        {activeTab === "Doshbord" && (
          <div className={style.tabContent}>
            <DoshbordMainComponent toggleShow={toggleShow}/>
          </div>
        )}
        {activeTab === "Orders" && (
          <div className={style.tabContent}>
            <OrderMainComponent toggleShow={toggleShow}/>
          </div>
        )}
        {activeTab === "header" && (
          <div className={style.tabContent}>
            <HeaderMainComponent toggleShow={toggleShow}/>
          </div>
        )}
        {activeTab === "Product" && (
          <div className={style.tabContent}>
            <ProductMainComponent toggleShow={toggleShow}/>
          </div>
        )}
        {activeTab === "Blogs" && (
          <div className={style.tabContent}>
            <BlogsMainComponent toggleShow={toggleShow}/>
          </div>
        )}
        {activeTab === "Honors" && (
          <div className={style.tabContent}>
            <Suspense fallback={<div>loading...</div>}>
              <HonorsMainComponent toggleShow={toggleShow}/>
            </Suspense>
          </div>
        )}
        {activeTab === "Exhibition" && (
          <div className={style.tabContent}>
            <ExhibitionMainComponent toggleShow={toggleShow}/>
          </div>
        )}
        {activeTab === "Banner" && (
          <div className={style.tabContent}>
            <BannerMainComponent toggleShow={toggleShow}/>
          </div>
        )}
        {activeTab === "Video" && (
          <div className={style.tabContent}>
            <VideoMainComponent toggleShow={toggleShow}/>
          </div>
        )}
        {activeTab === "defineUser" && (
          <div className={style.tabContent}>
            <Suspense fallback={<div>Loading...</div>}>
              <DefineUser toggleShow={toggleShow}/>
            </Suspense>
          </div>
        )}
        {/* {activeTab === "setting" && (
          <div className={style.tabContent}>Tab content for Settings</div>
        )} */}
      </div>
    </section>
  );
};

AdminPanel.displayName = "AdminPanel";
Hoc(AdminPanel);
export default AdminPanel;
