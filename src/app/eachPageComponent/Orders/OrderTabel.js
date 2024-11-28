import React from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import styled from "styled-components";
import { formatPersianDate } from "@/app/utils/persionDateUtils";

const SeeOrderButton = styled.button`
  background-color: ${(props) => props.color || "#1572e8"};
`;

const MAINTABELSTYLE = styled.div`
  border: 1.5px solid gray;
  padding: 7px;
  border-radius: 4px;
  margin-bottom: 10px;

  .eachTabelStyle {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 10px;
    border-bottom: 1px solid #ccc;
    text-align: center;
    p {
      background-color: #f1f1f1;
      padding: 12px 0px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .SecondValueTabel {
    display: flex;
    justify-content: center;
    align-items: center;

    .MuiInputBase-inputSizeSmall {
      padding: 4px !important;
    }
  }
`;

export default function OrderTabelDesctop({
  setSeeOrder,
  setActiveKey,
  mainArray,
  userMainData,
  handleStatusChange,
  setSelectedStatus,
  selectedStatus,
}) {
  return (
    <>
      <div className="d-lg-block d-none">
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
            {mainArray?.map((item, index) => (
              <tr key={index}>
                <td style={{ verticalAlign: "middle" }}>{++index}</td>
                <td style={{ verticalAlign: "middle" }}>
                  {userMainData[item.createdBy]?.firstName}
                </td>
                <td style={{ verticalAlign: "middle" }}>
                  {userMainData[item.createdBy]?.lastName}
                </td>
                <td style={{ verticalAlign: "middle" }}>
                  {userMainData[item.createdBy]?.username}
                </td>
                <td style={{ verticalAlign: "middle" }}>
                  {formatPersianDate(item.date)}
                </td>
                <td style={{ verticalAlign: "middle" }}>
                  <SeeOrderButton
                    onClick={() => {
                      setActiveKey("seeOrder");
                      setSeeOrder(item);
                    }}
                  >
                    مشاهده سفارش
                  </SeeOrderButton>
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
                        درحال برسی
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
      </div>
      {/* responsive */}
      <div className="d-lg-none d-block container">
        {mainArray?.map((item, index) => (
          <React.Fragment key={index}>
            <MAINTABELSTYLE>
              <div className="eachTabelStyle">
                <p className="NormalTextSizing">نام :</p>

                <div className="SecondValueTabel">
                  {userMainData[item.createdBy]?.firstName}
                </div>
              </div>

              <div className="eachTabelStyle">
                <p className="NormalTextSizing">نام خانوادگی :</p>
                <div
                  className="SecondValueTabel"
                  style={{ verticalAlign: "middle" }}
                >
                  {userMainData[item.createdBy]?.lastName}
                </div>
              </div>
              <div className="eachTabelStyle">
                <p className="NormalTextSizing">شماره همراه :</p>

                <div
                  className="SecondValueTabel"
                  style={{ verticalAlign: "middle" }}
                >
                  {userMainData[item.createdBy]?.username}
                </div>
              </div>

              <div className="eachTabelStyle">
                <p className="NormalTextSizing">تاریخ :</p>
                <div
                  className="SecondValueTabel"
                  style={{ verticalAlign: "middle" }}
                >
                  {formatPersianDate(item.date)}
                </div>
              </div>

              <div className="eachTabelStyle">
                <p className="NormalTextSizing">عملیات :</p>
                <div
                  className="SecondValueTabel"
                  style={{ verticalAlign: "middle" }}
                >
                  <SeeOrderButton
                    onClick={() => {
                      setActiveKey("seeOrder");
                      setSeeOrder(item);
                    }}
                  >
                    مشاهده سفارش
                  </SeeOrderButton>
                </div>
              </div>

              <div className="eachTabelStyle">
                <p className="NormalTextSizing">وضعیت :</p>
                <div className="SecondValueTabel">
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
                        درحال برسی
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
                </div>
              </div>
            </MAINTABELSTYLE>
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
