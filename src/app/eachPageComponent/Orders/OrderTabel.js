import React, { useState } from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import styled from "styled-components";
import { formatPersianDate } from "@/app/utils/persionDateUtils";
import { Modal, Box } from "@mui/material";
// import icons
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { NavDropdown } from "react-bootstrap";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AssignmentIcon from "@mui/icons-material/Assignment";
// improt areyou sure moda

// const SeeOrderButton = styled.button`
//   background-color: ${(props) => props.color || "#1572e8"};
//   background-image: linear-gradient(195deg, #66bb6a 0%, #43a047 100%);
// `;

const NavBarInsideDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* padding-bottom: 10px; */
  /* border-bottom: 1.4px solid #e1e5ea; */
`;

const NavDropDown = styled(NavDropdown)`
  .dropdown-menu {
    border: 1px solid gray;
    width: 230px;
    padding: 12px;
    margin-top: 3px;
    border-radius: 4px;
    box-shadow: 1px 1px 5px gray;
  }
  .dropdown-toggle::after {
    display: none;
  }
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

const AlignCenter = styled(Select)`
  .css-jedpe8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select {
    text-align: center;
  }
  .MuiSelect-icon {
    right: auto !important; /* Reset default positioning */
    left: 0px !important; /* Position arrow on the left */
  }
  .css-jedpe8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-jedpe8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-jedpe8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input {
    padding-left: 32px;
  }
  .css-jedpe8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-jedpe8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-jedpe8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input {
    padding-right: 10px !important;
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
    .tabelheaderStyle {
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
  areYouShureFunction,
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
              <th>کدرهگیری</th>
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
                  {/* <SeeOrderButton
                    onClick={() => {
                      setActiveKey("seeOrder");
                      setSeeOrder(item);
                    }}
                  >
                    مشاهده سفارش
                  </SeeOrderButton> */}
                  <p
                    style={{color: "#43A047" , cursor : "pointer"}}
                    onClick={() => {
                      setActiveKey("seeOrder");
                      setSeeOrder(item);
                    }}
                  >
                    {item.code}
                  </p>
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
                        <AlignCenter
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
                        </AlignCenter>
                      </FormControl>
                    </Box>
                  </Modal>

                  {/* <div onClick={() => handleOpenModal(item.code)}>
                    <MoreHorizIcon style={{ cursor: "pointer" }} />
                  </div> */}

                  <NavDropDown
                    title={
                      <>
                        <MoreHorizIcon
                          style={{
                            color: "#191919",
                            cursor: "pointer",
                            fontSize: "28px",
                            cursor: "pointer",
                          }}
                        />
                      </>
                    }
                    id="basic-nav-dropdown"
                  >
                    <NavBarInsideDiv>
                      <div
                        onClick={() => handleOpenModal(item.code)}
                        style={{
                          borderBottom: "1px solid black",
                          cursor: "pointer",
                        }}
                        className="d-flex flex-row gap-2 align-items-center pb-2"
                      >
                        <div style={{ color: "#F3802C" }}>
                          <AssignmentIcon className="subitem" />
                        </div>
                        <p className="VodeoDisSizing  text-end">تغیروضعیت</p>
                      </div>
                      <div
                        onClick={() => {
                          setActiveKey("seeOrder");
                          setSeeOrder(item);
                        }}
                        style={{
                          borderBottom: "1px solid black",
                          cursor: "pointer",
                        }}
                        className="d-flex flex-row gap-2 align-items-center pb-2 mt-2"
                      >
                        <div style={{ color: "#F3802C" }}>
                          <EditIcon className="subitem" />
                        </div>
                        <p className="VodeoDisSizing  text-end">ویرایش</p>
                      </div>

                      <div
                        onClick={() => areYouShureFunction(item.code)}
                        style={{
                          cursor: "pointer",
                        }}
                        className="d-flex flex-row gap-2 align-items-center mt-2"
                      >
                        <div style={{ color: "#F3802C" }}>
                          <DeleteIcon className="text-danger subitem" />
                        </div>
                        <p className="VodeoDisSizing text-end">حذف</p>
                      </div>
                    </NavBarInsideDiv>
                    <div className="d-flex justify-content-end"></div>
                  </NavDropDown>
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
                <p className="NormalTextSizing tabelheaderStyle">نام :</p>

                <div className="SecondValueTabel">
                  {userMainData[item.createdBy]?.firstName}
                </div>
              </div>

              <div className="eachTabelStyle">
                <p className="NormalTextSizing tabelheaderStyle">
                  نام خانوادگی :
                </p>
                <div
                  className="SecondValueTabel"
                  style={{ verticalAlign: "middle" }}
                >
                  {userMainData[item.createdBy]?.lastName}
                </div>
              </div>
              <div className="eachTabelStyle">
                <p className="NormalTextSizing tabelheaderStyle">
                  شماره همراه :
                </p>

                <div
                  className="SecondValueTabel"
                  style={{ verticalAlign: "middle" }}
                >
                  {userMainData[item.createdBy]?.username}
                </div>
              </div>

              <div className="eachTabelStyle">
                <p className="NormalTextSizing tabelheaderStyle">تاریخ :</p>
                <div
                  className="SecondValueTabel"
                  style={{ verticalAlign: "middle" }}
                >
                  {formatPersianDate(item.date)}
                </div>
              </div>

              <div className="eachTabelStyle">
                <p className="NormalTextSizing tabelheaderStyle">کد رهگیری :</p>
                <div
                  className="SecondValueTabel"
                  style={{ verticalAlign: "middle" }}
                >
                  {/* <SeeOrderButton
                    onClick={() => {
                      setActiveKey("seeOrder");
                      setSeeOrder(item);
                    }}
                  >
                    مشاهده سفارش
                  </SeeOrderButton> */}
                  {item.code}
                </div>
              </div>

              <div className="eachTabelStyle">
                <p className="NormalTextSizing tabelheaderStyle">عملیات :</p>
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
                        <AlignCenter
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
                        </AlignCenter>
                      </FormControl>
                    </Box>
                  </Modal>

                  {/* <div onClick={() => handleOpenModal(item.code)}>
                    <MoreHorizIcon style={{ cursor: "pointer" }} />
                  </div> */}

                  <NavDropDown
                    title={
                      <>
                        <MoreHorizIcon
                          style={{
                            color: "#191919",
                            cursor: "pointer",
                            fontSize: "28px",
                            cursor: "pointer",
                          }}
                        />
                      </>
                    }
                    id="basic-nav-dropdown"
                  >
                    <NavBarInsideDiv>
                      <div
                        onClick={() => handleOpenModal(item.code)}
                        style={{
                          borderBottom: "1px solid black",
                          cursor: "pointer",
                        }}
                        className="d-flex flex-row gap-2 align-items-center pb-2"
                      >
                        <div style={{ color: "#F3802C" }}>
                          <AssignmentIcon className="subitem" />
                        </div>
                        <p className="VodeoDisSizing  text-end">تغیروضعیت</p>
                      </div>
                      <div
                        onClick={() => {
                          setActiveKey("seeOrder");
                          setSeeOrder(item);
                        }}
                        style={{
                          borderBottom: "1px solid black",
                          cursor: "pointer",
                        }}
                        className="d-flex flex-row gap-2 align-items-center pb-2 mt-2"
                      >
                        <div style={{ color: "#F3802C" }}>
                          <EditIcon className="subitem" />
                        </div>
                        <p className="VodeoDisSizing  text-end">ویرایش</p>
                      </div>

                      <div
                        onClick={() => areYouShureFunction(product)}
                        style={{
                          cursor: "pointer",
                        }}
                        className="d-flex flex-row gap-2 align-items-center mt-2"
                      >
                        <div style={{ color: "#F3802C" }}>
                          <DeleteIcon className="text-danger subitem" />
                        </div>
                        <p className="VodeoDisSizing text-end">حذف</p>
                      </div>
                    </NavBarInsideDiv>
                    <div className="d-flex justify-content-end"></div>
                  </NavDropDown>
                </div>
              </div>
            </MAINTABELSTYLE>
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
