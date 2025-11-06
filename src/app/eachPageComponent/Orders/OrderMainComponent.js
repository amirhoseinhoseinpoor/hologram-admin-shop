// src/app/eachPageComponent/Orders/OrderMainComponent.jsx

import React, { useEffect, useState } from "react";
import MakeOrder from "./MakeOrderComponents/MakeOrder";
// Import Redux hooks and thunks
import { useDispatch } from "react-redux";
import {
  listorders,
  whosOrder,
  updateOrderStatus,
  deleteOrder,
} from "@/app/Store/thunks";
import SearchIcon from "@mui/icons-material/Search";
import styled from "styled-components";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Skeleton,
} from "@mui/material";

// Import base components
import ProfileComponent from "@/app/BaseComponent/ProfileComponent";
import NavBarToggleBurgerButton from "@/app/BaseComponent/NavBarToggleBurgerButton";
import ConfirmingModal from "@/app/BaseComponent/ConfirmingModal";
import ErrorModal from "@/app/BaseComponent/ErrorModal";
import AreYouShureModal from "@/app/BaseComponent/AreYouSureModal";
// Import components
import OrderTabel from "./OrderTabel";
import Pagination from "@/app/BaseComponent/Pagination";

// Styled Components
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
  margin: 7px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .textHeaderStyle {
    color: black;
  }

  @media (max-width: 980px) {
    /* Responsive styles if needed */
    .textHeaderStyle {
      /* Additional styles */
    }
  }
`;

const SearchInputMainDiv = styled.div`
  margin-bottom: 10px;
  width: 50%;
  position: relative;

  .inputSreachStyle {
    font-size: 15px;
    width: 100%;
    padding: 5px 4px 5px 30px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .SearchIconStyle {
    position: absolute;
    transform: translate(50%, -50%);
    left: 0;
    top: 50%;
  }
`;

const AlignCenter = styled(Select)`
  .MuiSelect-select {
    text-align: center;
  }
  .MuiSelect-icon {
    right: auto; /* Reset default positioning */
    left: 0px; /* Position arrow on the left */
  }
  .MuiSelect-select {
    padding-left: 32px;
    padding-right: 10px !important;
  }
`;

const SortControls = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 10px;

  select {
    padding: 5px 10px;
    margin-left: 10px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }
`;

export default function OrderMainComponent({ toggleShow }) {
  const dispatch = useDispatch();

  // Component States
  const [activekey, setActiveKey] = useState("seeTable");
  const [seeOrder, setSeeOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [usersData, setUsersData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentStatus, setCurrentStatus] = useState("1"); // Default status
  const [currentSubStatus, setCurrentSubStatus] = useState(null); // null or 'admin' or 'user'
  const [trackLoadingProduct, setTrackLoadingProduct] = useState(false);
  const [dataForDelete, setDataForDelete] = useState(null);
  const [updateData, setUpdateData] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Define as per requirement
  const [totalPages, setTotalPages] = useState(1);

  // Sorting states
  const [sortField, setSortField] = useState("createdAt"); // default sort field
  const [sortOrder, setSortOrder] = useState("desc"); // default sort order

  // Status selection states
  const [selectedStatus, setSelectedStatus] = useState({}); // Initialize as an empty object

  // Modal states
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);
  // Close modals
  const closeModal = () => setOpenModal(false);
  const closeModal2 = () => setOpenModal2(false);
  const closeModal3 = () => setOpenModal3(false);

  // Function to normalize strings for search
  const normalizeString = (str) => str.replace(/\s+/g, "").toLowerCase();

  // Fetch Orders Function
  const fetchOrders = async (status, page = 1, limit = itemsPerPage) => {
    try {
      setTrackLoadingProduct(true);
      const ordersData = await dispatch(
        listorders({ status, sortBy: sortField, sortOrder, page, limit })
      ).unwrap();
 

      // Fetch user data for all orders
      const userPromises = ordersData.data.map(async (item) => {
        const userDataCome = await dispatch(
          whosOrder({ id: item.createdBy })
        ).unwrap();
        return { id: item.createdBy, userData: userDataCome[0] }; // Access the first element of userData array
      });

      // Wait for all user data to be fetched
      const userDataArray = await Promise.all(userPromises);

      // Create a map from userId to userData
      const userDataMap = userDataArray.reduce((acc, user) => {
        acc[user.id] = user.userData;
        return acc;
      }, {});

      setUsersData(userDataMap);
      setOrders(ordersData.data);
      setTotalPages(ordersData.totalPages);
    } catch (error) {
      console.error("Error during dispatch:", error);
      setOpenModal3(true);
    } finally {
      setTrackLoadingProduct(false);
      setUpdateData(false);
    }
  };

  // Fetch orders on component mount and when dependencies change
  useEffect(() => {
    fetchOrders(currentStatus, currentPage, itemsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, currentStatus, currentPage, sortField, sortOrder, updateData]);

  // Filtering and Pagination
  useEffect(() => {
    // Since sorting is handled server-side, no client-side sorting is needed
    // However, we'll handle search filtering here

    let filtered = orders;

    // Apply sub-status filters
    if (currentStatus === "1" && currentSubStatus) {
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

    // Apply search filter
    if (searchTerm) {
      const normalizedSearchTerm = normalizeString(searchTerm);
      filtered = filtered.filter((order) => {
        const user = usersData[order.createdBy];
        if (!user) return false;

        const fullName = `${user.firstName || ""} ${user.lastName || ""} ${user.username || ""}`;
        const normalizedFullName = normalizeString(fullName);

        return normalizedFullName.includes(normalizedSearchTerm);
      });
    }

    // setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    // setCurrentPage(1); 
    setFilteredOrders(filtered);
  }, [
    orders,
    usersData,
    searchTerm,
    currentStatus,
    currentSubStatus,
    itemsPerPage,
  ]);


  useEffect(() => {
    if (seeOrder) {
      const updatedOrder = orders?.find(
        (order) => order.code === seeOrder?.code
      );     
      setSeeOrder(updatedOrder);
      
    }
  }, [updateData , seeOrder ,orders]);

  
  // Handle Sorting Change
  const handleSortChange = (e) => {
    const value = e.target.value;
    if (value === "createdAt_asc") {
      setSortField("createdAt");
      setSortOrder("asc");
    } else if (value === "createdAt_desc") {
      setSortField("createdAt");
      setSortOrder("desc");
    } else if (value === "firstName_asc") {
      setSortField("firstName");
      setSortOrder("asc");
    } else if (value === "firstName_desc") {
      setSortField("firstName");
      setSortOrder("desc");
    } else if (value === "lastName_asc") {
      setSortField("lastName");
      setSortOrder("asc");
    } else if (value === "lastName_desc") {
      setSortField("lastName");
      setSortOrder("desc");
    }
  };

  // Handle Status Change
  const handleStatusChange = async (orderCode, newStatus) => {
    try {
      await dispatch(
        updateOrderStatus({ code: orderCode, status: newStatus })
      ).unwrap();
      setOpenModal2(true);
      setTimeout(() => {
        setOpenModal2(false);
      }, 3000);
      // Refresh orders after status change
      fetchOrders(currentStatus, currentPage, itemsPerPage);
    } catch (error) {
      setOpenModal3(true);
      console.error("Error updating status:", error);
    }
  };

  // Handle Dropdown Change for Status Filtering
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

  // Handle Delete Confirmation
  const areYouShureFunction = (itemCode) => {
    setDataForDelete(itemCode);
    setOpenModal(true);
  };

  // Handle Delete Operation
  const handleDelete = async () => {
    try {
      const fetchData = await dispatch(
        deleteOrder({ code: dataForDelete })
      ).unwrap();
      if (
        fetchData.firstData.statusCode === 200 &&
        fetchData.secondData.statusCode === 200
      ) {
        setOpenModal2(true);
        setTimeout(() => {
          setOpenModal2(false);
        }, 3000);
      }
    } catch (error) {
      setOpenModal3(true);
    } finally {
      setOpenModal(false);
      setUpdateData(true);
    }
  };

  // Handle Page Change from Pagination Component
  const handlePageChange = (page) => {
    setCurrentPage(page);
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
            {/* Search Field */}
            <SearchInputMainDiv className="me-2 mt-4">
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

          {/* Sorting Controls */}
          {/* <SortControls className="container">
            <label htmlFor="sort">مرتب‌سازی بر اساس:</label>
            <select
              id="sort"
              onChange={handleSortChange}
              value={`${sortField}_${sortOrder}`}
            >
              <option value="createdAt_desc">تاریخ (نزولی)</option>
              <option value="createdAt_asc">تاریخ (صعودی)</option>
              <option value="firstName_asc">نام (الفبایی صعودی)</option>
              <option value="firstName_desc">نام (الفبایی نزولی)</option>
              <option value="lastName_asc">نام خانوادگی (الفبایی صعودی)</option>
              <option value="lastName_desc">نام خانوادگی (الفبایی نزولی)</option>
            </select>
          </SortControls> */}

          <FixTablePlace className="container">
            <>
              {trackLoadingProduct ? (
                <>
                  <p className="me-2 NormalTextSizing mb-2 fixingTabel">
                    سفارشات
                  </p>
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
                      <p className="me-2 NormalTextSizing mb-2 fixingTabel">
                        سفارشات
                      </p>
                      <OrderTabel
                        areYouShureFunction={areYouShureFunction}
                        setSeeOrder={setSeeOrder}
                        setActiveKey={setActiveKey}
                        selectedStatus={selectedStatus}
                        setSelectedStatus={setSelectedStatus}
                        handleStatusChange={handleStatusChange}
                        mainArray={filteredOrders}
                        userMainData={usersData}
                        setUpdateData={setUpdateData}
                        updateData={updateData}
                      />
                      {/* Pagination Component */}
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
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
          setUpdateData={setUpdateData}
          toggleShow={toggleShow}
          setActiveKey={setActiveKey}
          seeOrder={seeOrder}
        />
      )}
      {/* Modals */}
      <AreYouShureModal
        open={openModal}
        onClose={closeModal}
        text={"ایا از حذف سفارش مطمئن هستید؟"}
        func={handleDelete}
      />
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
