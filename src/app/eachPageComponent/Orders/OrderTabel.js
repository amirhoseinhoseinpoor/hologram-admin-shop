import React, { useState } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Modal,
  Box,
} from "@mui/material";
import styled from "styled-components";
import CustomCloseButton from "@/app/BaseComponent/CustomCloseButton";
import { formatPersianDate } from "@/app/utils/persionDateUtils";
// import icons
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { NavDropdown } from "react-bootstrap";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AssignmentIcon from "@mui/icons-material/Assignment";
// improt areyou sure moda

const NavBarInsideDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* padding-bottom: 10px; */
  /* border-bottom: 1.4px solid #e1e5ea; */
`;

const NavDropDown = styled(NavDropdown)`
  .dropdown-menu {
    border: 1px solid var(--c-border);
    width: 150px;
    padding: 12px;
    margin-top: 3px;
    border-radius: 4px;
    box-shadow: var(--shadow-md);
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
  border: 1px solid var(--c-border);
  padding: 12px;
  border-radius: var(--r-md);
  background: var(--c-surface);
  box-shadow: var(--shadow-sm);
  margin-bottom: 10px;

  .eachTabelStyle {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 10px;
    border-bottom: 1px solid var(--c-border);
    text-align: center;
    .tabelheaderStyle {
      background-color: #f9fafb;
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
  width: "min(400px, calc(100vw - 32px))",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: { xs: 3, sm: 4 },
  borderRadius: 3,
  outline: "none",
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
  setUpdateData,
  updateData,
}) {
  const [openModals, setOpenModals] = useState({});

  const handleCloseModal = (itemCode) => {
    setOpenModals((prev) => ({ ...prev, [itemCode]: false }));
  };

  const handleOpenModal = (itemCode) => {
    setOpenModals((prev) => ({ ...prev, [itemCode]: true }));
  };

  const handleDataGoInside = async (item) => {
    setUpdateData(true);
    setActiveKey("seeOrder");
    setSeeOrder(item);
  };

  return (
    <>
      <div className="d-lg-block d-none">
        <StyledTable className="table table-striped">
          <thead className="text-center">
            <tr className="table-head">
              <th className="NormalTextSizing">ردیف</th>
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
                <td
                  style={{ verticalAlign: "middle" }}
                  className="VodeoDisSizing"
                >
                  {index + 1}
                </td>
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
                  <p
                    style={{ color: "var(--c-primary)", cursor: "pointer" }}
                    className="text-decoration-underline"
                    onClick={() => handleDataGoInside(item)}
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
                      <div className="d-flex flex-row justify-content-between align-items-center mb-3">
                        <p className="NormalTextSizing">تغییر وضعیت سفارش</p>
                        <CustomCloseButton
                          color="var(--c-danger)"
                          onClick={() => handleCloseModal(item.code)}
                        />
                      </div>
                      <FormControl variant="outlined" size="small" fullWidth>
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
                            handleCloseModal(item.code);
                          }}
                        >
                          <MenuItem sx={{ fontFamily: "unset" }} value="1">
                            در حال بررسی
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
                    </Box>
                  </Modal>

                  <NavDropDown
                    title={
                      <>
                        <MoreHorizIcon
                          style={{
                            color: "var(--c-ink)",
                            cursor: "pointer",
                            fontSize: "28px",
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
                        <div style={{ color: "var(--c-warning)" }}>
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
                        <div style={{ color: "var(--c-warning)" }}>
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
                        <div style={{ color: "var(--c-warning)" }}>
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
                  <p
                    style={{ color: "var(--c-primary)", cursor: "pointer" }}
                    className="text-decoration-underline"
                    onClick={() => {
                      setActiveKey("seeOrder");
                      setSeeOrder(item);
                    }}
                  >
                    {item.code}
                  </p>
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
                      <div className="d-flex flex-row justify-content-between align-items-center mb-3">
                        <p className="NormalTextSizing">تغییر وضعیت سفارش</p>
                        <CustomCloseButton
                          color="var(--c-danger)"
                          onClick={() => handleCloseModal(item.code)}
                        />
                      </div>
                      <FormControl variant="outlined" size="small" fullWidth>
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
                            handleCloseModal(item.code);
                          }}
                        >
                          <MenuItem sx={{ fontFamily: "unset" }} value="1">
                            در حال بررسی
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
                    </Box>
                  </Modal>

                  <NavDropDown
                    title={
                      <>
                        <MoreHorizIcon
                          style={{
                            color: "var(--c-ink)",
                            cursor: "pointer",
                            fontSize: "28px",
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
                        <div style={{ color: "var(--c-warning)" }}>
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
                        <div style={{ color: "var(--c-warning)" }}>
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
                        <div style={{ color: "var(--c-warning)" }}>
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
