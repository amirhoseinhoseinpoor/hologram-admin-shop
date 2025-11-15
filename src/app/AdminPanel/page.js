"use client";
import Hoc from "../Components/HOCcomponent.js";
import style from "../Styles/AdminStyle/AdminStyle.module.scss";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { Offcanvas, Navbar, Nav } from "react-bootstrap";
import React, { useState, lazy, Suspense } from "react";
import dynamic from "next/dynamic";
import CustomCloseButton from "../BaseComponent/CustomCloseButton.js";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// import redux
import { useSelector } from "react-redux";
import { permissions } from "../Store/slice.js";

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
import PersonIcon from "@mui/icons-material/Person";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AccessibilityIcon from "@mui/icons-material/Accessibility";
import { Box } from "@mui/material";
import ShowVersionServer from "../Components/ShowVersionServer.js";

// import components
const DefineUser = lazy(() =>
  import("../eachPageComponent/DefineUser/DefineUserTable.js")
);

const CustomerUser = lazy(() =>
  import("../eachPageComponent/CustomerUser/CustomerUserTabel.js")
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

const AccessibilityMainComponent = dynamic(
  () =>
    import("../eachPageComponent/Accessibility/AccessibilityMainComponent.js"),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

const AdminPanel = () => {
  const permission = useSelector(permissions);

  const [activeTab, setActiveTab] = useState("Product");
  const [visibility, setVisibility] = useState({});

  const tabs = [
    { id: "Doshbord", title: "داشبورد", icon: <SpaceDashboardIcon /> },
    { id: "Orders", title: "سفارشات", icon: <ListAltIcon /> },
    { id: "separator1", isDecorative: true },
    {
      id: "settingsHeader",
      isDecorative: true,
      title: (
        <div
          style={{ cursor: "default" }}
          className="d-flex flex-row justify-content-between"
        >
          <div>
            <SettingsIcon /> تنظیمات
          </div>
          <div>
            <ArrowDropDownIcon />
          </div>
        </div>
      ),
    },
    { id: "header", style: "pe-2", title: "ساخت هدر", icon: <PatternIcon /> },
    {
      id: "Product",
      style: "pe-2",
      title: "محصولات",
      icon: <StorefrontIcon />,
    },
    { id: "Blogs", style: "pe-2", title: "مقالات", icon: <BookIcon /> },
    {
      id: "Honors",
      style: "pe-2",
      title: "افتخارات",
      icon: <MilitaryTechIcon />,
    },
    {
      id: "Exhibition",
      style: "pe-2",
      title: "نمایشگاه ها",
      icon: <BalconyIcon />,
    },
    { id: "Banner", style: "pe-2", title: "بنر", icon: <ViewArrayIcon /> },
    { id: "Video", style: "pe-2", title: "ویدیو", icon: <VideocamIcon /> },
    {
      id: "defineUser",
      style: "pe-2",
      title: "کاربر های سیستم",
      icon: <PersonIcon />,
    },
    {
      id: "customerUser",
      style: "pe-2",
      title: "مدیریت مشتریان",
      icon: <PeopleIcon />,
    },
    {
      id: "Accessibility",
      style: "pe-2",
      title: "سطح دسترسی ها",
      icon: <AccessibilityIcon />,
    },
  ];

  // Filter only functional tabs based on permissions
  const filteredTabs = tabs.filter(
    (tab) =>
      tab.isDecorative ||
      permission?.some((permission) => permission.htmlId === tab.id)
  );

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
        <h4
          className={`${style.titleStyleHeader} title d-flex flex-column justify-content-center gap-2 align-items-center`}
        >
          <Box
            component="img"
            sx={{
              width: "70px",
              height: "100%",
              objectFit: "cover",
            }}
            alt="image."
            src="/LOGO/cropped-com.chakavak.adv_512x512.png"
          />
        </h4>

        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          id="admin-tabs1"
          className={`${style.sidebarMain} discription mt-3`}
        >
          {filteredTabs.map((tab) =>
            tab.isDecorative ? (
              // Render decorative tabs
              <Tab
                key={tab.id}
                title={
                  tab.title || <div className={style.addBorderSideBar}></div>
                }
              />
            ) : (
              // Render functional tabs
              <Tab
                key={tab.id}
                eventKey={tab.id}
                title={
                  <div className={`${tab.style}`}>
                    {tab.icon} {tab.title}
                  </div>
                }
              />
            )
          )}
        </Tabs>
      </aside>

      <div className={`${style.content}`}>
        <div className="w-100 ">
          <Navbar.Offcanvas
            placement="end"
            className={` ${style.navbaritemheader}`}
            show={visibility["main"]}
            onHide={() => handleClose("main")}
            id="basic-navbar-nav"
          >
            <Offcanvas.Header
              className={`${style.offcanvasheader} ${style.nextoffcanvas} ${style.offcanvasHeaderResponsive} justify-content-between position-relative`}
              closeButton={false}
            >
              <Offcanvas.Title className="me-2">
                <Box
                  component="img"
                  sx={{
                    width: "40px",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  alt="image."
                  src="/LOGO/cropped-com.chakavak.adv_512x512.png"
                />
              </Offcanvas.Title>
              <CustomCloseButton
                className="me-2"
                color={"#262626"}
                onClick={() => handleClose("main")}
              />

              <div
                className={`${style.addBorderSideBar2} position-absolute`}
              ></div>
            </Offcanvas.Header>

            <Nav className="align-items-center gap-3">
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                id="admin-tabs2"
                className={`${style.sidebarMain} NormalTextSizing`}
              >
                {filteredTabs.map((tab) =>
                  tab.isDecorative ? (
                    // Render decorative tabs
                    <Tab
                      key={tab.id}
                      title={
                        tab.title || (
                          <div className={style.addBorderSideBar}></div>
                        )
                      }
                    />
                  ) : (
                    // Render functional tabs
                    <Tab
                      key={tab.id}
                      eventKey={tab.id}
                      title={
                        <div className={`${tab.style}`}>
                          {tab.icon} {tab.title}
                        </div>
                      }
                    />
                  )
                )}

                {/* <Tab
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

                <Tab title={<div className={style.addBorderSideBar}></div>} />

                <Tab
                  title={
                    <div
                      style={{ cursor: "default" }}
                      className="d-flex flex-row justify-content-between"
                    >
                      <div>
                        <SettingsIcon /> تنظیمات
                      </div>
                      <div>
                        <ArrowDropDownIcon />
                      </div>
                    </div>
                  }
                />

                <Tab
                  eventKey="header"
                  title={
                    <div className="pe-2">
                      <PatternIcon /> ساخت هدر
                    </div>
                  }
                ></Tab>
                <Tab
                  eventKey="Product"
                  title={
                    <div className="pe-2">
                      <StorefrontIcon /> محصولات
                    </div>
                  }
                ></Tab>
                <Tab
                  eventKey="Blogs"
                  title={
                    <div className="pe-2">
                      <BookIcon /> مقالات
                    </div>
                  }
                ></Tab>
                <Tab
                  eventKey="Honors"
                  title={
                    <div className="pe-2">
                      <MilitaryTechIcon /> افتخارات
                    </div>
                  }
                ></Tab>
                <Tab
                  eventKey="Exhibition"
                  title={
                    <div className="pe-2">
                      <BalconyIcon /> نمایشگاه ها
                    </div>
                  }
                ></Tab>
                <Tab
                  eventKey="Banner"
                  title={
                    <div className="pe-2">
                      <ViewArrayIcon /> بنر
                    </div>
                  }
                ></Tab>
                <Tab
                  eventKey="Video"
                  title={
                    <div className="pe-2">
                      <VideocamIcon /> ویدیو
                    </div>
                  }
                ></Tab>
                <Tab
                  eventKey="defineUser"
                  title={
                    <div className="pe-2">
                      <PersonIcon /> کاربر های سیستم
                    </div>
                  }
                ></Tab>
                <Tab
                  eventKey="customerUser"
                  title={
                    <div className="pe-2">
                      <PeopleIcon /> مدیریت مشتریان
                    </div>
                  }
                ></Tab> */}
              </Tabs>
            </Nav>
          </Navbar.Offcanvas>
        </div>

        {activeTab === "Doshbord" && (
          <div className={style.tabContent}>
            <DoshbordMainComponent toggleShow={toggleShow} />
          </div>
        )}
        {activeTab === "Orders" && (
          <div className={style.tabContent}>
            <OrderMainComponent toggleShow={toggleShow} />
          </div>
        )}
        {activeTab === "header" && (
          <div className={style.tabContent}>
            <DndProvider backend={HTML5Backend}>
              <HeaderMainComponent toggleShow={toggleShow} />
            </DndProvider>
          </div>
        )}
        {activeTab === "Product" && (
          <div className={style.tabContent}>
            <ProductMainComponent toggleShow={toggleShow} />
          </div>
        )}
        {activeTab === "Blogs" && (
          <div className={style.tabContent}>
            <BlogsMainComponent toggleShow={toggleShow} />
          </div>
        )}
        {activeTab === "Honors" && (
          <div className={style.tabContent}>
            <Suspense fallback={<div>loading...</div>}>
              <HonorsMainComponent toggleShow={toggleShow} />
            </Suspense>
          </div>
        )}
        {activeTab === "Exhibition" && (
          <div className={style.tabContent}>
            <ExhibitionMainComponent toggleShow={toggleShow} />
          </div>
        )}
        {activeTab === "Banner" && (
          <div className={style.tabContent}>
            <BannerMainComponent toggleShow={toggleShow} />
          </div>
        )}
        {activeTab === "Video" && (
          <div className={style.tabContent}>
            <VideoMainComponent toggleShow={toggleShow} />
          </div>
        )}
        {activeTab === "defineUser" && (
          <div className={style.tabContent}>
            <Suspense fallback={<div>Loading...</div>}>
              <DefineUser toggleShow={toggleShow} />
            </Suspense>
          </div>
        )}
        {activeTab === "customerUser" && (
          <div className={style.tabContent}>
            <Suspense fallback={<div>Loading...</div>}>
              <CustomerUser toggleShow={toggleShow} />
            </Suspense>
          </div>
        )}
        {activeTab === "Accessibility" && (
          <div className={style.tabContent}>
            <AccessibilityMainComponent toggleShow={toggleShow} />
          </div>
        )}
        <ShowVersionServer />
      </div>
    </section>
  );
};

AdminPanel.displayName = "AdminPanel";
Hoc(AdminPanel);
export default AdminPanel;
