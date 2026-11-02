"use client";
import Hoc from "../Components/HOCcomponent.js";
import style from "../Styles/AdminStyle/AdminStyle.module.scss";
import { Offcanvas } from "react-bootstrap";
import SidebarNav from "./SidebarNav.js";
import { useState, lazy, Suspense } from "react";
import dynamic from "next/dynamic";
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
import PersonIcon from "@mui/icons-material/Person";
import AccessibilityIcon from "@mui/icons-material/Accessibility";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import SoftLoader from "../BaseComponent/SoftLoader.js";

// import components
const DefineUser = lazy(
  () => import("../eachPageComponent/DefineUser/DefineUserTable.js"),
);

const CustomerUser = lazy(
  () => import("../eachPageComponent/CustomerUser/CustomerUserTabel.js"),
);

const HonorsMainComponent = lazy(
  () => import("../eachPageComponent/Honors/HonorsMainComponent.js"),
);

const DoshbordMainComponent = dynamic(
  () => import("../eachPageComponent/Doshbord/DoshbordMainComponent.js"),
  {
    ssr: false,
    loading: () => <SoftLoader />,
  },
);

const OrderMainComponent = dynamic(
  () => import("../eachPageComponent/Orders/OrderMainComponent.js"),
  {
    ssr: false,
    loading: () => <SoftLoader />,
  },
);

const ExhibitionMainComponent = dynamic(
  () => import("../eachPageComponent/Exhibition/ExhibitionMainComponent.js"),
  {
    ssr: false,
    loading: () => <SoftLoader />,
  },
);

const BlogsMainComponent = dynamic(
  () => import("../eachPageComponent/Blogs/BlogsMainComponent.js"),
  {
    ssr: false,
    loading: () => <SoftLoader />,
  },
);

const VideoMainComponent = dynamic(
  () => import("../eachPageComponent/Video/VideoMainComponent.js"),
  {
    ssr: false,
    loading: () => <SoftLoader />,
  },
);

const ProductMainComponent = dynamic(
  () => import("../eachPageComponent/Product/ProductMainComponent.js"),
  {
    ssr: false,
    loading: () => <SoftLoader />,
  },
);

const BannerMainComponent = dynamic(
  () => import("../eachPageComponent/Banner/BannerMainComponent.js"),
  {
    ssr: false,
    loading: () => <SoftLoader />,
  },
);

const HeaderMainComponent = dynamic(
  () => import("../eachPageComponent/Header/HeaderMainComponent.js"),
  {
    ssr: false,
    loading: () => <SoftLoader />,
  },
);

const AccessibilityMainComponent = dynamic(
  () =>
    import("../eachPageComponent/Accessibility/AccessibilityMainComponent.js"),
  {
    ssr: false,
    loading: () => <SoftLoader />,
  },
);

const ContactMainComponent = dynamic(
  () => import("../eachPageComponent/ContactUs/ContactMainComponent.js"),
  {
    ssr: false,
    loading: () => <SoftLoader />,
  },
);

const AdminPanel = () => {
  const permission = useSelector(permissions);

  const [activeTab, setActiveTab] = useState("Orders");
  const [visibility, setVisibility] = useState({});

  const navGroups = [
    {
      title: "اصلی",
      items: [
        { id: "Doshbord", title: "داشبورد", icon: <SpaceDashboardIcon /> },
        { id: "Orders", title: "سفارشات", icon: <ListAltIcon /> },
      ],
    },
    {
      title: "مدیریت محتوا",
      items: [
        { id: "header", title: "ساخت هدر", icon: <PatternIcon /> },
        { id: "Product", title: "محصولات", icon: <StorefrontIcon /> },
        { id: "Blogs", title: "مقالات", icon: <BookIcon /> },
        { id: "Honors", title: "افتخارات", icon: <MilitaryTechIcon /> },
        { id: "Exhibition", title: "نمایشگاه ها", icon: <BalconyIcon /> },
        { id: "Banner", title: "بنر", icon: <ViewArrayIcon /> },
        { id: "Video", title: "ویدیو", icon: <VideocamIcon /> },
        { id: "ContactUs", title: "تماس با ما", icon: <MailOutlineIcon /> },
      ],
    },
    {
      title: "کاربران و دسترسی",
      items: [
        { id: "defineUser", title: "کاربر های سیستم", icon: <PersonIcon /> },
        { id: "customerUser", title: "مدیریت مشتریان", icon: <PeopleIcon /> },
        {
          id: "Accessibility",
          title: "سطح دسترسی ها",
          icon: <AccessibilityIcon />,
        },
      ],
    },
  ];

  // Only show the sections the signed-in admin is allowed to open.
  const visibleGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        permission?.some((p) => p.htmlId === item.id),
      ),
    }))
    .filter((group) => group.items.length > 0);

  const handleSelect = (id) => {
    setActiveTab(id);
    handleClose("main");
  };

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
      <aside className={`${style.sidebar} d-lg-block d-none`}>
        <SidebarNav
          groups={visibleGroups}
          activeTab={activeTab}
          onSelect={setActiveTab}
        />
      </aside>

      <Offcanvas
        placement="end"
        className={style.offcanvas}
        show={!!visibility["main"]}
        onHide={() => handleClose("main")}
        id="basic-navbar-nav"
      >
        <SidebarNav
          groups={visibleGroups}
          activeTab={activeTab}
          onSelect={handleSelect}
        />
      </Offcanvas>

      <div className={style.content}>
        {activeTab === "Doshbord" && (
          <div className={`${style.tabContent} app-content`}>
            <DoshbordMainComponent toggleShow={toggleShow} />
          </div>
        )}
        {activeTab === "Orders" && (
          <div className={`${style.tabContent} app-content`}>
            <OrderMainComponent toggleShow={toggleShow} />
          </div>
        )}
        {activeTab === "header" && (
          <div className={`${style.tabContent} app-content`}>
            <DndProvider backend={HTML5Backend}>
              <HeaderMainComponent toggleShow={toggleShow} />
            </DndProvider>
          </div>
        )}
        {activeTab === "Product" && (
          <div className={`${style.tabContent} app-content`}>
            <ProductMainComponent toggleShow={toggleShow} />
          </div>
        )}
        {activeTab === "Blogs" && (
          <div className={`${style.tabContent} app-content`}>
            <BlogsMainComponent toggleShow={toggleShow} />
          </div>
        )}
        {activeTab === "Honors" && (
          <div className={`${style.tabContent} app-content`}>
            <Suspense fallback={<SoftLoader />}>
              <HonorsMainComponent toggleShow={toggleShow} />
            </Suspense>
          </div>
        )}
        {activeTab === "Exhibition" && (
          <div className={`${style.tabContent} app-content`}>
            <ExhibitionMainComponent toggleShow={toggleShow} />
          </div>
        )}
        {activeTab === "Banner" && (
          <div className={`${style.tabContent} app-content`}>
            <BannerMainComponent toggleShow={toggleShow} />
          </div>
        )}
        {activeTab === "Video" && (
          <div className={`${style.tabContent} app-content`}>
            <VideoMainComponent toggleShow={toggleShow} />
          </div>
        )}
        {activeTab === "defineUser" && (
          <div className={`${style.tabContent} app-content`}>
            <Suspense fallback={<SoftLoader />}>
              <DefineUser toggleShow={toggleShow} />
            </Suspense>
          </div>
        )}
        {activeTab === "customerUser" && (
          <div className={`${style.tabContent} app-content`}>
            <Suspense fallback={<SoftLoader />}>
              <CustomerUser toggleShow={toggleShow} />
            </Suspense>
          </div>
        )}
        {activeTab === "Accessibility" && (
          <div className={`${style.tabContent} app-content`}>
            <AccessibilityMainComponent toggleShow={toggleShow} />
          </div>
        )}
        {activeTab === "ContactUs" && (
          <div className={`${style.tabContent} app-content`}>
            <ContactMainComponent toggleShow={toggleShow} />
          </div>
        )}
      </div>
    </section>
  );
};

AdminPanel.displayName = "AdminPanel";

export default Hoc(AdminPanel);
