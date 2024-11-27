import { useEffect, useState } from "react";
import React from "react";
import MakeOrder from "./MakeOrderComponents/MakeOrder";
import { useDispatch } from "react-redux";
import { listorders, whosOrder, updateOrderStatus } from "@/app/Store/thunks";
import ConfirmingModal from "@/app/BaseComponent/ConfirmingModal";
import ErrorModal from "@/app/BaseComponent/ErrorModal";
import SearchIcon from "@mui/icons-material/Search";
import styled from "styled-components";
// import base components
import NavBarToggleBurgerButton from "@/app/BaseComponent/NavBarToggleBurgerButton";
// import component
import OrderTabel from "./OrderTabel";

const HeadermakeOrder = styled.div`
  background-color: white;
  padding: 10px;
  color: white;
  .textHeaderStyle {
    color: black;
  }

  @media (max-width: 980px) {
    background-color: rgb(26, 32, 53) !important;
    .textHeaderStyle {
      color: white !important;
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

const SeeOrderButton = styled.button`
  background-color: ${(props) => props.color || "#1572e8"};
`;

export default function OrderMainComponent({ toggleShow }) {
  const dispatch = useDispatch();

  const [activekey, setActiveKey] = useState("seeTable");
  const [seeOrder, setSeeOrder] = useState(null);
  const [orders, setOrders] = useState(null);
  const [ordersCanceled, setOrdersCanceled] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState(null);
  const [filteredOrdersUSER, setFilteredOrdersUSER] = useState(null);
  const [usersData, setUsersData] = useState({});
  const [usersDataCanceled, setUsersDataCanceled] = useState({});
  const [selectedStatus, setSelectedStatus] = useState({});
  const [waitingForAdmin, setWaitingForAdmin] = useState(null);
  const [WaitingForUser, setWaitingForUser] = useState(null);

  // modal state
  const [openModal2, setOpenModal2] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);
  // Close modal
  const closeModal2 = () => setOpenModal2(false);
  const closeModal3 = () => setOpenModal3(false);

  // console.log(usersData);
  // console.log(orders);

  const normalizeString = (str) => str.replace(/\s+/g, "").toLowerCase();

  // Add useEffect to handle filtering whenever orders, usersData, or searchTerm changes
  useEffect(() => {
    if (!orders || !usersData) return;

    // If there's no search term, show all orders
    if (!searchTerm) {
      setFilteredOrders(waitingForAdmin);
      setFilteredOrdersUSER(WaitingForUser);
      return;
    }

    // Filter orders based on user's firstName and lastName
    const filtered = waitingForAdmin.filter((order) => {
      const user = usersData[order.createdBy];
      if (!user) return false;

      const fullName = `${user.firstName || ""} ${user.lastName || ""}`;
      const normalizedFullName = normalizeString(fullName);
      const normalizedSearchTerm = normalizeString(searchTerm);

      return normalizedFullName.includes(normalizedSearchTerm);
    });
    const filteredUSER = WaitingForUser.filter((order) => {
      const user = usersData[order.createdBy];
      if (!user) return false;

      const fullName = `${user.firstName || ""} ${user.lastName || ""}`;
      const normalizedFullName = normalizeString(fullName);
      const normalizedSearchTerm = normalizeString(searchTerm);

      return normalizedFullName.includes(normalizedSearchTerm);
    });
    setFilteredOrders(filtered);
    setFilteredOrdersUSER(filteredUSER);

  }, [orders, usersData, searchTerm, waitingForAdmin , WaitingForUser]);

  const handleCancelOrders = () => {
    const fetchData = async (status) => {
      try {
        const ordersData = await dispatch(listorders({ status })).unwrap();

        // Fetch user data for all orders
        const userPromises = ordersData.map(async (item) => {
          const userDataCome = await dispatch(
            whosOrder({ id: item.createdBy })
          ).unwrap();

          // Return the user data
          return { id: item.createdBy, userData: userDataCome[0] }; // Access the first item of the userData array
        });

        // Wait for all user data to be fetched
        const userDataArray = await Promise.all(userPromises);

        // Create a mapping of userId to userData
        const userDataMap = userDataArray.reduce((acc, user) => {
          acc[user.id] = user.userData; // Store the first element directly instead of the array
          return acc;
        }, {});

        setUsersDataCanceled(userDataMap); // Set the user data map
        setOrdersCanceled(ordersData); // Set orders
      } catch (error) {
        console.error("Error during dispatch:", error);
      }
    };
    fetchData(5);
  };

  useEffect(() => {
    const fetchData = async (status) => {
      try {
        const ordersData = await dispatch(listorders({ status })).unwrap();

        const userPromises = ordersData.map(async (item) => {
          const userDataCome = await dispatch(
            whosOrder({ id: item.createdBy })
          ).unwrap();

          // Return the user data
          return { id: item.createdBy, userData: userDataCome[0] }; // Access the first item of the userData array
        });

        // Wait for all user data to be fetched
        const userDataArray = await Promise.all(userPromises);

        // Create a mapping of userId to userData
        const userDataMap = userDataArray.reduce((acc, user) => {
          acc[user.id] = user.userData; // Store the first element directly instead of the array
          return acc;
        }, {});

        setUsersData(userDataMap);
        setOrders(ordersData);

        // Separate orders with and without request comment
        const waitingForAdmin = ordersData.filter((order) => {
          // Check if the requestComment is an empty object
          return (
            !order.reqComment || Object.keys(order.reqComment).length === 0
          );
        });
        const withComment = ordersData.filter((order) => {
          return order.reqComment && Object.keys(order.reqComment).length > 0;
        });

        setWaitingForAdmin(waitingForAdmin);
        setWaitingForUser(withComment);
      } catch (error) {
        console.error("Error during dispatch:", error);
      }
    };

    fetchData(1);
  }, [dispatch]);

  function closeModalOnTimeout() {
    setTimeout(() => {
      setOpenModal2(false);
    }, 3000);
  }

  // Handle status change
  const handleStatusChange = async (orderCode, newStatus) => {
    try {
      await dispatch(
        updateOrderStatus({ code: orderCode, status: newStatus })
      ).unwrap();
      setOpenModal2(true);
      closeModalOnTimeout();
    } catch (error) {
      setOpenModal3(true);
      console.error("Error updating status:", error);
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
            <div className="NormalTextSizing textHeaderStyle d-flex align-items-center">
              مدیریت سفارشات
            </div>
          </HeadermakeOrder>
          {/* Add a search input field */}
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

          {filteredOrders && filteredOrders.length > 0 && (
            <>
              <p className="me-2 NormalTextSizing mb-2">
                سفارشات در انتظار برسی
              </p>
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
          )}

          {filteredOrdersUSER && filteredOrdersUSER.length > 0 && (
            <>
              <p className="me-2 NormalTextSizing mb-2">
                سفارشات در انتظار کاربر
              </p>
              <OrderTabel
                setSeeOrder={setSeeOrder}
                setActiveKey={setActiveKey}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                handleStatusChange={handleStatusChange}
                mainArray={filteredOrdersUSER}
                userMainData={usersData}
              />
            </>
          )}

          <div className="container mt-4 mb-4">
            <SeeOrderButton
              color="#6861ce"
              onClick={handleCancelOrders}
              type="button"
            >
              دیدن سفارشات لغو شده
            </SeeOrderButton>
          </div>
          {/* orders canceled */}
          {ordersCanceled && (
            <>
              <OrderTabel
                setSeeOrder={setSeeOrder}
                setActiveKey={setActiveKey}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                handleStatusChange={handleStatusChange}
                mainArray={filteredOrders}
                userMainData={usersDataCanceled}
              />
            </>
          )}
        </>
      )}
      {activekey === "seeOrder" && (
        <MakeOrder
          toggleShow={toggleShow}
          setActiveKey={setActiveKey}
          seeOrder={seeOrder}
        />
      )}
      {/* modals */}
      <ConfirmingModal
        open={openModal2}
        onClose={closeModal2}
        text={"وضعیت با موفقیت تغییر یافت"}
      />
      <ErrorModal
        open={openModal3}
        onClose={closeModal3}
        text={"خطا در تغییر وضعیت "}
      />
    </section>
  );
}
