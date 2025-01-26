import React, { useState, useEffect } from "react";
import ProfileComponent from "@/app/BaseComponent/ProfileComponent";
import NavBarToggleBurgerButton from "@/app/BaseComponent/NavBarToggleBurgerButton";
import styled from "styled-components";
// import redux
import { useDispatch, useSelector } from "react-redux";
import { gettingAllRoles, deleteRole } from "@/app/Store/thunks";

import { Modal, Box } from "@mui/material";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
// import icons
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { NavDropdown } from "react-bootstrap";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AssignmentIcon from "@mui/icons-material/Assignment";
// import base component
import AreYouShureModal from "@/app/BaseComponent/AreYouSureModal";
import ConfirmingModal from "@/app/BaseComponent/ConfirmingModal";
import ErrorModal from "@/app/BaseComponent/ErrorModal";

const HeadermakeOrder = styled.div`
  padding: 10px;
  color: white;
  background-color: rgb(225, 223, 223);
  border-radius: 4px;
  margin: 7px 15px;
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

const SectionMain = styled.section`
  /* padding: 10px; */
  border-radius: 4px;
  border: 2px solid #ccc;

  .addRoleButtonStyle {
    background-color: #43a047;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 4px 12px;
    cursor: pointer;
  }
  .headerBAckGroundColor {
    background-color: rgb(225, 223, 223);
    border-radius: 4px;
    padding: 8px;
  }
`;

const StyledTable = styled.table`
  @media (min-width: 980px) {
    border-collapse: separate;
    border-radius: 12px;
    /* overflow: hidden; */
    width: 100%;

    th,
    td {
      padding: 10px;
      text-align: center;
    }
    th {
      /* padding-top: 55px; */
    }
  }
  .SeeAccessButtom {
    cursor: pointer;
    color: #43a047;
  }
`;

const NavBarInsideDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* padding-bottom: 10px; */
  /* border-bottom: 1.4px solid #e1e5ea; */
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

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
  borderRadius: 2,
};

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

export default function Accessibility({ toggleShow }) {
  const dispatch = useDispatch();

  const [rolesData, setRolesData] = useState(null);
  const [updateData, setUpdateData] = useState(false);
  const [dataForDelete, setDataForDelete] = useState(null);

  // modals state
  const [modalPermision, setModalPermision] = useState(null);
  const handleCloseModal = () => setModalPermision(null);

  const [errormodal, setErrormodal] = useState(false);
  const handleCloseErrorModal = () => setErrormodal(false);

  const [openModal, setOpenModal] = useState(false);
  const closeModal = () => setOpenModal(false);

  const [openModal2, setOpenModal2] = useState(false);
  const closeModal2 = () => setOpenModal2(false);

  console.log(rolesData);

  const areYouShureFunction = (itemID) => {
    setDataForDelete(itemID);
    setOpenModal(true);
  };

  useEffect(() => {
    const GettingRoles = async () => {
      const ReturnDataApi = await dispatch(gettingAllRoles()).unwrap();
      setRolesData(ReturnDataApi);
      setUpdateData(false);
    };
    GettingRoles();
  }, [dispatch, updateData]);

  const handleDeleteRole = async () => {
    try {
      const dataReturnAPI = await dispatch(deleteRole({id : dataForDelete})).unwrap();
      console.log(dataReturnAPI);
      if (dataReturnAPI) {

        setOpenModal2(true);
        setTimeout(() => {
          setOpenModal2(false);
        }, 3000);
      }
    } catch (error) {
      console.log(error);
      setErrormodal(true);
    } finally {
      setUpdateData(true);
      setOpenModal(false);
    }
  };

  return (
    <section>
      <HeadermakeOrder className="d-flex flex-row mb-3 justify-content-between">
        <div className="d-block d-lg-none">
          <NavBarToggleBurgerButton func={() => toggleShow("main")} />
        </div>

        <ProfileComponent colorGet={"#191919"} />
      </HeadermakeOrder>

      <div className="container">
        <SectionMain>
          <div className="d-flex justify-content-end headerBAckGroundColor">
            <button
              type="buttton"
              className="addRoleButtonStyle NormalTextSizing"
            >
              ساخت دسترسی
            </button>
          </div>
          <div>
            <StyledTable className="table table-striped">
              <thead className="text-center">
                <tr className="table-head">
                  <th className="NormalTextSizing">ردیف</th>
                  <th className="NormalTextSizing">نام</th>
                  <th className="NormalTextSizing">دسترسی ها</th>
                  <th className="NormalTextSizing">عملیات</th>
                </tr>
              </thead>
              <tbody className="table-body text-center">
                {rolesData?.map((item, index) => (
                  <tr key={index}>
                    <td
                      style={{ verticalAlign: "middle" }}
                      className="VodeoDisSizing"
                    >
                      {++index}
                    </td>
                    <td style={{ verticalAlign: "middle" }}>{item.name}</td>
                    <td style={{ verticalAlign: "middle" }}>
                      <div>
                        <p
                          className="SeeAccessButtom"
                          onClick={() => setModalPermision(index)}
                        >
                          مشاهده
                        </p>
                        <Modal
                          open={modalPermision === index}
                          onClose={handleCloseModal}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <Box sx={modalStyle}>
                            <div className="d-flex flex-column gap-2 justify-content-center align-items-center">
                              {item?.permissions?.map((eachPer, index) => (
                                <p key={index} className="NormalTextSizing">
                                  {eachPer?.permission?.name}
                                </p>
                              ))}
                            </div>
                          </Box>
                        </Modal>
                      </div>
                    </td>

                    <td>
                      {/* <Modal
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
                              value={
                                selectedStatus[item.code] || item.status || ""
                              }
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
                      </Modal> */}

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
                            // onClick={() => {
                            //   setActiveKey("seeOrder");
                            //   setSeeOrder(item);
                            // }}
                            style={{
                              borderBottom: "1px solid black",
                              cursor: "pointer",
                            }}
                            className="d-flex flex-row gap-2 align-items-center pb-2"
                          >
                            <div style={{ color: "#F3802C" }}>
                              <EditIcon className="subitem" />
                            </div>
                            <p className="VodeoDisSizing  text-end">ویرایش</p>
                          </div>

                          <div
                            onClick={() => areYouShureFunction(item.id)}
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
        </SectionMain>
      </div>
      {/* modlas */}
      <AreYouShureModal
        open={openModal}
        onClose={closeModal}
        text={"ایا از حذف دسترسی مطمئن هستید؟"}
        func={handleDeleteRole}
      />
      <ConfirmingModal
        open={openModal2}
        onClose={closeModal2}
        text={"عملیات با موفقیت انجام شد"}
      />
      <ErrorModal
        open={errormodal}
        onClose={handleCloseErrorModal}
        text={"خطا در انجام عملیات"}
      />
    </section>
  );
}
