import React, { useState } from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import styled from "styled-components";
import { formatPersianDate } from "@/app/utils/persionDateUtils";
import { Modal, Box } from "@mui/material";
// import icons
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const SeeOrderButton = styled.button`
  background-color: ${(props) => props.color || "#1572e8"};
  background-image: linear-gradient(195deg, #66bb6a 0%, #43a047 100%);
`;

const StyledTable = styled.table`
  @media (min-width: 980px) {
    border-collapse: separate;
    border-radius: 12px;
    overflow: hidden;
    width: 100%;

    th,
    td {
      padding: 10px;
      text-align: center;
    }
    th {
      padding-top: 55px;
    }
  }
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

    @media (min-width: 980px) {
      .MuiInputBase-inputSizeSmall {
        padding: 4px !important;
      }
    }
  }
`;

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function OrderTabelDesctop({
  setSeeOrder,
  setActiveKey,
  mainArray,
  userMainData,
  handleStatusChange,
  setSelectedStatus,
  selectedStatus,
}) {
  const [openModals, setOpenModals] = useState({});

  const handleCloseModal = (itemCode) => {
    setOpenModals((prev) => ({ ...prev, [itemCode]: false }));
  };

  const handleOpenModal = (itemCode) => {
    setOpenModals((prev) => ({ ...prev, [itemCode]: true }));
  };

  return (
    <>
      <div className="d-lg-block d-none">
        <StyledTable className="table table-striped">
          <thead className="text-center">
            <tr className="table-head">
              <th>ردیف</th>
              <th>نام</th>
              <th>نام خانوادگی</th>
              <th>شماره همراه</th>
              <th>تاریخ</th>
              <th>سفارش</th>
              <th>عملیات</th>
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
                  <Modal
                    open={openModals[item.code] || false}
                    onClose={() => handleCloseModal(item.code)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={modalStyle}>
                      <p className="mb-3 NormalTextSizing">وضعیت سفارش :</p>
                      <FormControl
                        variant="outlined"
                        size="small"
                        sx={{ minWidth: 100 }}
                      >
                        <InputLabel sx={{ fontFamily: "unset" }}>
                          وضعیت
                        </InputLabel>
                        <Select
                          sx={{
                            fontFamily: "unset",
                            padding: "0px",
                          }}
                          label="Status"
                          value={selectedStatus[item.code] || item.status || ""}
                          onChange={(e) => {
                            const newStatus = e.target.value;
                            setSelectedStatus((prevStatus) => ({
                              ...prevStatus,
                              [item.code]: newStatus, // Update status in state
                            }));
                            handleStatusChange(item.code, newStatus);
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
                    </Box>
                  </Modal>

                  <div onClick={() => handleOpenModal(item.code)}>
                    <MoreHorizIcon style={{ cursor: "pointer" }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
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
                <p className="NormalTextSizing">سفارش :</p>
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
                <p className="NormalTextSizing">عملیات :</p>
                <div className="SecondValueTabel">
                  {/* Status Select */}
                  

                  <Modal
                    open={openModals[item.code] || false}
                    onClose={() => handleCloseModal(item.code)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={modalStyle}>
                      <p className="mb-3 NormalTextSizing">وضعیت سفارش :</p>
                      <FormControl
                        variant="outlined"
                        size="small"
                        sx={{ minWidth: 100 }}
                      >
                        <InputLabel sx={{ fontFamily: "unset" }}>
                          وضعیت
                        </InputLabel>
                        <Select
                          sx={{
                            fontFamily: "unset",
                            padding: "0px",
                          }}
                          label="Status"
                          value={selectedStatus[item.code] || item.status || ""}
                          onChange={(e) => {
                            const newStatus = e.target.value;
                            setSelectedStatus((prevStatus) => ({
                              ...prevStatus,
                              [item.code]: newStatus, // Update status in state
                            }));
                            handleStatusChange(item.code, newStatus);
                          }}
                        >
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
                    </Box>
                  </Modal>

                  <div onClick={() => handleOpenModal(item.code)}>
                    <MoreHorizIcon style={{ cursor: "pointer" }} />
                  </div>
                </div>
              </div>
            </MAINTABELSTYLE>
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
