import { useEffect, useState } from "react";
import React from "react";
import MakeOrder from "./MakeOrderComponents/MakeOrder";
import { useDispatch } from "react-redux";
import { listorders, whosOrder, updateOrderStatus } from "@/app/Store/thunks";
import SearchIcon from "@mui/icons-material/Search";
import styled from "styled-components";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Skeleton,
} from "@mui/material";

// import base components
import ProfileComponent from "@/app/BaseComponent/ProfileComponent";
import NavBarToggleBurgerButton from "@/app/BaseComponent/NavBarToggleBurgerButton";
import ConfirmingModal from "@/app/BaseComponent/ConfirmingModal";
import ErrorModal from "@/app/BaseComponent/ErrorModal";
// import component
import OrderTabel from "./OrderTabel";


const FixTablePlace = styled.div`
  @media (min-width: 980px) {
    position: relative;
    margin-top: 60px;
    .fixingTabel {
      position: absolute;
      transform: translate(-50%, 50%);
      left: 50%;
      width: 94%;
      top: -55px;
      border-radius: 10px;
      padding: 18px 12px;
      background-image: linear-gradient(195deg, #42424a 0%, #191919 100%);
      color: white;
    }
  }
`;

const HeadermakeOrder = styled.div`
  padding: 10px;
  color: white;
  background-color: rgb(225, 223, 223);
  border-radius: 4px;
  .textHeaderStyle {
    color: black;
  }

  @media (max-width: 980px) {
    /* background-color: rgb(26, 32, 53) !important; */
    .textHeaderStyle {
      /* color: white !important; */
    }
  }
`;

const SearchInputMainDiv = styled.div`
  margin-bottom: 10px;
  width: 50%;
  .inputSreachStyle {
    font-size: 15px;
    width: 100%;
    padding: 4px;
  }
  .SearchIconStyle {
    position: absolute;
    transform: translate(50%, -50%);
    left: 0;
    top: 50%;
  }
`;

// const SeeOrderButton = styled.button`
//   background-color: ${(props) => props.color || "#1572e8"};
// `;

const AlignCenter = styled(Select)`
  .css-jedpe8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select {
    text-align: center;
  }
  .MuiSelect-icon {
    right: auto; /* Reset default positioning */
    left: 0px; /* Position arrow on the left */
  }
  .css-jedpe8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-jedpe8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-jedpe8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input {
    padding-left: 32px;
  }
  .css-jedpe8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-jedpe8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-jedpe8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input{
    padding-right : 10px !important; 
  }
`;

export default function OrderMainComponent({ toggleShow }) {
  const dispatch = useDispatch();

  const [activekey, setActiveKey] = useState("seeTable");
  const [seeOrder, setSeeOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [usersData, setUsersData] = useState({});
  const [selectedStatus, setSelectedStatus] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentStatus, setCurrentStatus] = useState("1"); // وضعیت پیش‌فرض
  const [currentSubStatus, setCurrentSubStatus] = useState(null); // null یا 'admin' یا 'user'
  const [trackLoadingProduct, setTrackLoadingProduct] = useState(false);

  // وضعیت‌های مودال
  const [openModal2, setOpenModal2] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);
  // بستن مودال‌ها
  const closeModal2 = () => setOpenModal2(false);
  const closeModal3 = () => setOpenModal3(false);

  const normalizeString = (str) => str.replace(/\s+/g, "").toLowerCase();

  // تابع دریافت سفارش‌ها بر اساس وضعیت
  const fetchOrders = async (status) => {
    try {
      setTrackLoadingProduct(true);
      const ordersData = await dispatch(listorders({ status })).unwrap();

      // دریافت اطلاعات کاربران برای همه سفارش‌ها
      const userPromises = ordersData.map(async (item) => {
        const userDataCome = await dispatch(
          whosOrder({ id: item.createdBy })
        ).unwrap();
        return { id: item.createdBy, userData: userDataCome[0] }; // دسترسی به اولین عنصر آرایه userData
      });

      // منتظر ماندن برای دریافت همه اطلاعات کاربران
      const userDataArray = await Promise.all(userPromises);

      // ایجاد یک نقشه از userId به userData
      const userDataMap = userDataArray.reduce((acc, user) => {
        acc[user.id] = user.userData;
        return acc;
      }, {});

      setUsersData(userDataMap);
      setOrders(ordersData);
    } catch (error) {
      console.error("Error during dispatch:", error);
      setOpenModal3(true);
    } finally {
      setTrackLoadingProduct(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentStatus);
  }, [dispatch, currentStatus]);

  // تابع فیلترینگ سفارش‌ها بر اساس وضعیت و زیر وضعیت
  useEffect(() => {
    if (!orders || !usersData) return;

    let filtered = orders;

    if (currentStatus === "1" && currentSubStatus) {
      // اگر وضعیت=1 و زیر وضعیت انتخاب شده است
      if (currentSubStatus === "admin") {
        filtered = orders.filter((order) => {
          return (
            !order.reqComment || Object.keys(order.reqComment).length === 0
          );
        });
      } else if (currentSubStatus === "user") {
        filtered = orders.filter((order) => {
          return order.reqComment && Object.keys(order.reqComment).length > 0;
        });
      }
    }

    if (searchTerm) {
      const normalizedSearchTerm = normalizeString(searchTerm);
      filtered = filtered.filter((order) => {
        const user = usersData[order.createdBy];
        if (!user) return false;

        const fullName = `${user.firstName || ""} ${user.lastName || ""}`;
        const normalizedFullName = normalizeString(fullName);

        return normalizedFullName.includes(normalizedSearchTerm);
      });
    }

    setFilteredOrders(filtered);
  }, [orders, usersData, searchTerm, currentStatus, currentSubStatus]);

  // تابع تغییر وضعیت سفارش
  const handleStatusChange = async (orderCode, newStatus) => {
    try {
      await dispatch(
        updateOrderStatus({ code: orderCode, status: newStatus })
      ).unwrap();
      setOpenModal2(true);
      setTimeout(() => {
        setOpenModal2(false);
      }, 3000);
      // بروزرسانی سفارش‌ها پس از تغییر وضعیت
      fetchOrders(currentStatus);
    } catch (error) {
      setOpenModal3(true);
      console.error("Error updating status:", error);
    }
  };

  // تابع مدیریت تغییرات در Dropdown
  const handleDropdownChange = (e) => {
    const value = e.target.value;
    if (value === "1_admin") {
      setCurrentStatus("1");
      setCurrentSubStatus("admin");
    } else if (value === "1_user") {
      setCurrentStatus("1");
      setCurrentSubStatus("user");
    } else {
      setCurrentStatus(value);
      setCurrentSubStatus(null);
    }
  };

  return (
    <section>
      {activekey === "seeTable" && (
        <>
          <HeadermakeOrder className="d-flex flex-row mb-3 justify-content-between">
            <div className="d-block d-lg-none">
              <NavBarToggleBurgerButton func={() => toggleShow("main")} />
            </div>
            <div className="NormalTextSizing text-decoration-underline textHeaderStyle d-flex align-items-center">
              مدیریت سفارشات
            </div>
            <ProfileComponent colorGet={"#191919"} />
          </HeadermakeOrder>
          <div className="d-flex flex-row justify-content-between container align-items-center">
            {/* فیلد جستجو */}
            <SearchInputMainDiv className="me-2 mt-4 position-relative">
              <input
                className="inputSreachStyle"
                type="text"
                placeholder="جستجو..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchIcon className="SearchIconStyle" />
            </SearchInputMainDiv>
            <div>
              <FormControl
                variant="outlined"
                size="small"
                sx={{ minWidth: 150 }}
              >
                <InputLabel sx={{ fontFamily: "unset" }}>
                  فیلتر بر اساس وضعیت
                </InputLabel>
                <AlignCenter
                  sx={{
                    fontFamily: "unset",
                    padding: "0px",
                  }}
                  label="فیلتر بر اساس وضعیت"
                  value={
                    currentStatus === "1"
                      ? currentSubStatus
                        ? `1_${currentSubStatus}`
                        : "1"
                      : currentStatus
                  }
                  onChange={handleDropdownChange}
                >
                  <MenuItem sx={{ fontFamily: "unset" }} value="1">
                    درحال برسی
                  </MenuItem>
                  <MenuItem sx={{ fontFamily: "unset" }} value="1_admin">
                    منتظر تایید مدیر
                  </MenuItem>
                  <MenuItem sx={{ fontFamily: "unset" }} value="1_user">
                    منتظر تایید کاربر
                  </MenuItem>
                  <MenuItem sx={{ fontFamily: "unset" }} value="2">
                    درحال تولید
                  </MenuItem>
                  <MenuItem sx={{ fontFamily: "unset" }} value="3">
                    درحال ارسال
                  </MenuItem>
                  <MenuItem sx={{ fontFamily: "unset" }} value="4">
                    تحویل داده شده
                  </MenuItem>
                  <MenuItem sx={{ fontFamily: "unset" }} value="5">
                    لغو شده
                  </MenuItem>
                </AlignCenter>
              </FormControl>
            </div>
          </div>

          <FixTablePlace className="container">
            <>
              {trackLoadingProduct ? (
                <>
                  <p className="me-2 NormalTextSizing mb-2 fixingTabel">سفارشات</p>
                  <Skeleton
                    animation="wave"
                    variant="rounded"
                    className="w-100"
                    height={250}
                  />
                </>
              ) : (
                <>
                  {filteredOrders && filteredOrders.length > 0 ? (
                    <>
                      <p className="me-2 NormalTextSizing mb-2 fixingTabel">سفارشات</p>
                      <OrderTabel
                        setSeeOrder={setSeeOrder}
                        setActiveKey={setActiveKey}
                        selectedStatus={selectedStatus}
                        setSelectedStatus={setSelectedStatus}
                        handleStatusChange={handleStatusChange}
                        mainArray={filteredOrders}
                        userMainData={usersData}
                      />
                    </>
                  ) : (
                    <p className="me-2 NormalTextSizing mb-2">
                      هیچ سفارشی یافت نشد.
                    </p>
                  )}
                </>
              )}
            </>
          </FixTablePlace>
        </>
      )}
      {activekey === "seeOrder" && (
        <MakeOrder
          toggleShow={toggleShow}
          setActiveKey={setActiveKey}
          seeOrder={seeOrder}
        />
      )}
      {/* مودال‌ها */}
      <ConfirmingModal
        open={openModal2}
        onClose={closeModal2}
        text={"وضعیت با موفقیت تغییر یافت"}
      />
      <ErrorModal
        open={openModal3}
        onClose={closeModal3}
        text={"خطا در انجام عملیات "}
      />
    </section>
  );
}
