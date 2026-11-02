// src/app/eachPageComponent/Orders/OrderMainComponent.jsx

import { SearchInputMainDiv } from "@/app/BaseComponent/SearchField";
import { HeadermakeOrder } from "@/app/BaseComponent/PageHeader";
import { useEffect, useState } from "react";
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
import EmptyState from "@/app/BaseComponent/EmptyState";

// Styled Components
const FixTablePlace = styled.div`
  @media (min-width: 980px) {
    position: relative;
    overflow: hidden;
    background: var(--c-surface);
    border: 1px solid var(--c-border);
    border-radius: var(--r-md);
    box-shadow: var(--shadow-sm);
    .fixingTabel {
      padding: 16px 20px;
      margin: 0 !important;
      font-size: 15px;
      font-weight: 600;
      color: var(--c-ink);
      background-color: var(--c-surface);
      border-bottom: 1px solid var(--c-border);
    }
  }
  @media (max-width: 979px) {
    .fixingTabel {
      display: none;
    }
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
  const sortField = "createdAt";
  const sortOrder = "desc";

  // Status selection states
  const [selectedStatus, setSelectedStatus] = useState({}); // Initialize as an empty object

  // Modal states
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [successText, setSuccessText] = useState("عملیات با موفقیت انجام شد");
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
        listorders({ status, sortBy: sortField, sortOrder, page, limit }),
      ).unwrap();

      // Fetch user data for all orders
      const userPromises = ordersData.data.map(async (item) => {
        const userDataCome = await dispatch(
          whosOrder({ id: item.createdBy }),
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
        (order) => order.code === seeOrder?.code,
      );
      setSeeOrder(updatedOrder);
    }
  }, [updateData, seeOrder, orders]);

  // Handle Sorting Change

  // Handle Status Change
  const handleStatusChange = async (orderCode, newStatus) => {
    try {
      await dispatch(
        updateOrderStatus({ code: orderCode, status: newStatus }),
      ).unwrap();
      setSuccessText("وضعیت سفارش با موفقیت تغییر یافت");
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
        deleteOrder({ code: dataForDelete }),
      ).unwrap();
      if (
        fetchData.firstData.statusCode === 200 &&
        fetchData.secondData.statusCode === 200
      ) {
        setSuccessText("سفارش با موفقیت حذف شد");
        setOpenModal2(true);
        setTimeout(() => {
          setOpenModal2(false);
        }, 3000);
      }
    } catch {
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
            <ProfileComponent />
          </HeadermakeOrder>

          <div className="d-flex flex-row flex-wrap gap-3 justify-content-between align-items-end mb-4">
            {/* Search Field */}
            <SearchInputMainDiv>
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
                    در حال بررسی
                  </MenuItem>
                  <MenuItem sx={{ fontFamily: "unset" }} value="1_admin">
                    منتظر تایید مدیر
                  </MenuItem>
                  <MenuItem sx={{ fontFamily: "unset" }} value="1_user">
                    منتظر تایید کاربر
                  </MenuItem>
                  <MenuItem sx={{ fontFamily: "unset" }} value="2">
                    در حال تولید
                  </MenuItem>
                  <MenuItem sx={{ fontFamily: "unset" }} value="3">
                    در حال ارسال
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
                    <EmptyState
                      illustrationUrl="/illustrations/empty-orders.svg"
                      title="هیچ سفارشی یافت نشد"
                      description="سفارشات مشتریان شما اینجا نمایش داده می‌شود."
                      variant="table"
                      illustrationHeight="200px"
                    />
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
        text={"آیا از حذف سفارش مطمئن هستید؟"}
        func={handleDelete}
      />
      <ConfirmingModal
        open={openModal2}
        onClose={closeModal2}
        text={successText}
      />
      <ErrorModal
        open={openModal3}
        onClose={closeModal3}
        text={"خطا در انجام عملیات، لطفاً دوباره تلاش کنید"}
      />
    </section>
  );
}
