import { useEffect, useState } from "react";
import React from "react";
import MakeOrder from "./MakeOrderComponents/MakeOrder";
import { useDispatch } from "react-redux";
import { listorders, whosOrder, updateOrderStatus } from "@/app/Store/thunks";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import ConfirmingModal from "@/app/BaseComponent/ConfirmingModal";
import ErrorModal from "@/app/BaseComponent/ErrorModal";


export default function OrderMainComponent() {
  const dispatch = useDispatch();

  const [activekey, setActiveKey] = useState("seeTable");
  const [seeOrder, setSeeOrder] = useState(null);
  const [orders, setOrders] = useState(null);
  const [usersData, setUsersData] = useState({}); // To store user data
  const [selectedStatus, setSelectedStatus] = useState({});
    // modal state
    const [openModal2, setOpenModal2] = useState(false);
    const [openModal3, setOpenModal3] = useState(false);
    // Close modal
    const closeModal2 = () => setOpenModal2(false);
    const closeModal3 = () => setOpenModal3(false);

  const formatPersianDate = (isoDate) => {
    const date = new Date(isoDate);
    const persianFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    return persianFormatter.format(date);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersData = await dispatch(listorders()).unwrap();

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

        setUsersData(userDataMap); // Set the user data map
        setOrders(ordersData); // Set orders
      } catch (error) {
        console.error("Error during dispatch:", error);
      }
    };

    fetchData();
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
      setOpenModal3(true)
      console.error("Error updating status:", error);
    }
  };

  return (
    <section>
      {activekey === "seeTable" && (
        <>
          <div className="d-flex flex-row mb-3 justify-content-between">
            <div>مدیریت سفارشات</div>
          </div>
          <table className="table table-striped">
            <thead className="text-center">
              <tr className="table-head">
                <th>ردیف</th>
                <th>نام</th>
                <th>نام خانوادگی</th>
                <th>شماره همراه</th>
                <th>تاریخ</th>
                <th>عملیات</th>
                <th>وضعیت</th>
              </tr>
            </thead>
            <tbody className="table-body text-center">
              {orders?.map((item, index) => (
                <tr key={index}>
                  <td>{++index}</td>
                  <td>{usersData[item.createdBy]?.firstName}</td>
                  <td>{usersData[item.createdBy]?.lastName}</td>
                  <td>{usersData[item.createdBy]?.username}</td>
                  <td>{formatPersianDate(item.date)}</td>
                  <td>
                    <button
                      className="bg-success"
                      onClick={() => {
                        setActiveKey("seeOrder");
                        setSeeOrder(item);
                      }}
                    >
                      مشاهده سفارش
                    </button>
                  </td>
                  <td>
                    {/* Status Select */}
                    <FormControl
                      variant="outlined"
                      size="small"
                      sx={{ minWidth: 100 }}
                    >
                      <InputLabel sx={{ fontFamily: "unset" }}>وضعیت</InputLabel>
                      <Select
                        sx={{
                          fontFamily: "unset",
                          padding: "0px", // Reduce padding for a smaller look
                        }}
                        label="Status"
                        value={selectedStatus[item.code] || item.status || ""}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          setSelectedStatus((prevStatus) => ({
                            ...prevStatus,
                            [item.code]: newStatus, // Update status in state
                          }));
                          handleStatusChange(item.code, newStatus); // Call the status change handler
                        }}
                      >
                        {/* Add your status options here */}
                        <MenuItem sx={{ fontFamily: "unset" }} value="1">
                          معلق
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
                      </Select>
                    </FormControl>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {activekey === "seeOrder" && <MakeOrder seeOrder={seeOrder} />}
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
