import React, { useState, useEffect } from "react";
import ProfileComponent from "@/app/BaseComponent/ProfileComponent";
import NavBarToggleBurgerButton from "@/app/BaseComponent/NavBarToggleBurgerButton";
import styled from "styled-components";
// import redux
import { useDispatch, useSelector } from "react-redux";
import {
  gettingAllRoles,
  deleteRole,
  updatePermissionRole,
  createPermissionRole,
} from "@/app/Store/thunks";

import { Modal, Box } from "@mui/material";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
// import icons
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { NavDropdown } from "react-bootstrap";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

// import base component
import AreYouShureModal from "@/app/BaseComponent/AreYouSureModal";
import ConfirmingModal from "@/app/BaseComponent/ConfirmingModal";
import ErrorModal from "@/app/BaseComponent/ErrorModal";
import CustomCloseButton from "@/app/BaseComponent/CustomCloseButton";
import LoadingCss from "@/app/BaseComponent/LoadingCss";

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

const HeaderModalShowAccessMainDiv = styled.div`
  background-color: rgb(225, 223, 223);
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  .HeaderModalShowAccess {
    padding: 10px;
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

const BUTTONSSTYLE = styled.div`
  .cancelButtonStyle {
    color: #e91e63;
    background-color: unset;
    border: 1px solid #e91e63;
    padding-right: 10px;
    padding-left: 10px;
    border-radius: 4px;
  }

  .deleteButtonStyle {
    color: #ff4f3f !important;
    background-color: transparent;
  }
  .confirmButtonStyle {
    padding: 4px 20px;
    color: white;
    background-color: #43a047;
    border: none;
    border-radius: 4px;
  }
`;

export default function Accessibility({ toggleShow }) {
  const dispatch = useDispatch();

  const [rolesData, setRolesData] = useState(null);
  const [updateData, setUpdateData] = useState(false);
  const [dataForDelete, setDataForDelete] = useState(null);
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectedValueCreateAccess, setSelectedValueCreateAccess] = useState(
    []
  );
  const [nameCreateNewAccess, setNameCreateNewAccess] = useState("");

  const handleNameCreateNewAccess = (event) => {
    setNameCreateNewAccess(event.target.value);
  };
  const [storeRoleId, setStoreRoleId] = useState(null);
  const [loadingUpdateAccess, setLoadingUpdateAccess] = useState(false);

  // modals state
  const [modalPermision, setModalPermision] = useState(null);
  const handleCloseModal = () => setModalPermision(null);
  const [errormodal, setErrormodal] = useState(false);
  const handleCloseErrorModal = () => setErrormodal(false);
  const [openModal, setOpenModal] = useState(false);
  const closeModal = () => setOpenModal(false);
  const [openModal2, setOpenModal2] = useState(false);
  const closeModal2 = () => setOpenModal2(false);

  const [modalchangeAccess, setModalchangeAccess] = useState(null);

  const handleclosemodalChangeAccess = () => {
    setModalchangeAccess(null);
    setSelectedValues([]);
  };

  const [modalCreateAccess, setModalCreateAccess] = useState(null);

  const handleCloseModalCreateAccess = () => {
    setModalCreateAccess(null);
    setSelectedValueCreateAccess([]);
  };

  const handlechangeAccess = (index) => {
    console.log(index);

    const selectedRole = rolesData[--index];
    console.log(selectedRole);

    const permissions =
      selectedRole?.permissions?.map((p) => p.permission.id) || [];
    console.log(permissions);

    setSelectedValues(permissions); // Preload selected values from the role's permissions
    setModalchangeAccess(++index);
  };

  const handlechangeAccessCreate = () => {
    // console.log(index);

    // const selectedRole = rolesData[--index];
    // console.log(selectedRole);

    // const permissions =
    //   selectedRole?.permissions?.map((p) => p.permission.id) || [];
    // console.log(permissions);

    // setSelectedValueCreateAccess(permissions);
    setModalCreateAccess(true);
  };

  const handleChange = (event) => {
    const value = Number(event.target.value);

    if (event.target.checked) {
      // Add to selectedValues if checked
      setSelectedValues((prev) => [...prev, value]);
    } else {
      // Remove from selectedValues if unchecked
      setSelectedValues((prev) => prev.filter((v) => v !== value));
    }
  };

  const handleChangeCreateAccess = (event) => {
    const value = Number(event.target.value);

    if (event.target.checked) {
      // Add to selectedValues if checked
      setSelectedValueCreateAccess((prev) => [...prev, value]);
    } else {
      // Remove from selectedValues if unchecked
      setSelectedValueCreateAccess((prev) => prev.filter((v) => v !== value));
    }
  };

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
      const dataReturnAPI = await dispatch(
        deleteRole({ id: dataForDelete })
      ).unwrap();
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

  const handleUpdatePermissionRole = async () => {
    try {
      setLoadingUpdateAccess(true);
      const dataReturnAPI = await dispatch(
        updatePermissionRole({
          roleId: storeRoleId,
          permissionIds: selectedValues,
        })
      ).unwrap();

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
      setLoadingUpdateAccess(false);
      handleclosemodalChangeAccess();
      setUpdateData(true);
      setOpenModal(false);
    }
  };

  const handleCreateNewAccess = async () => {
    try {
      setLoadingUpdateAccess(true);
      const dataReturnAPI = await dispatch(
        createPermissionRole({
          name: nameCreateNewAccess,
          permissionIds: selectedValueCreateAccess,
        })
      ).unwrap();
      console.log(dataReturnAPI);
      if (dataReturnAPI) {
        setOpenModal2(true);
        setTimeout(() => {
          setOpenModal2(false);
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      setErrormodal(true);
    } finally {
      setLoadingUpdateAccess(false);
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
              onClick={() => {
                handlechangeAccessCreate();
              }}
              type="buttton"
              className="addRoleButtonStyle NormalTextSizing"
            >
              ساخت دسترسی
            </button>
            <Modal
              open={modalCreateAccess}
              onClose={handleCloseModalCreateAccess}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={modalStyle}>
                <HeaderModalShowAccessMainDiv className="d-flex flex-row justify-content-between align-items-center mb-2">
                  <p className="NormalTextSizing HeaderModalShowAccess">
                    ساخت دسترسی
                  </p>
                  <CustomCloseButton
                    onClick={handleCloseModalCreateAccess}
                    color={`#e91e63`}
                  />
                </HeaderModalShowAccessMainDiv>

                <div className="d-flex flex-row gap-2 align-items-center">
                  <label
                    style={{ textWrap: "nowrap" }}
                    className="NormalTextSizing me-2"
                    htmlFor="CreateNewAccessName"
                  >
                    نام دسترسی
                  </label>
                  <input
                    onChange={handleNameCreateNewAccess}
                    value={nameCreateNewAccess}
                    style={{
                      border: "1px solid gray",
                      borderRadius: "4px",
                      padding: "5px",
                    }}
                    className="w-100 ms-2"
                    type="text"
                    id="CreateNewAccessName"
                    minlength="4"
                    required
                  />
                </div>

                <div className="d-flex flex-column gap-2 justify-content-center align-items-center p-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((value) => (
                    <label
                      key={value}
                      className="d-flex flex-row align-items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        value={value}
                        onChange={handleChangeCreateAccess}
                      />
                      <div>
                        {value === 1 && "داشبورد"}
                        {value === 2 && "محصولات"}
                        {value === 3 && "سفارشات"}
                        {value === 4 && "ساخت هدر"}
                        {value === 5 && "مقالات"}
                        {value === 6 && "افتخارات"}
                        {value === 7 && "نمایشگاه ها"}
                        {value === 8 && "بنر"}
                        {value === 9 && "ویدیو"}
                        {value === 10 && "کاربر سیستم"}
                        {value === 11 && "کاربر سایت"}
                        {value === 12 && "سطح دسترسی ها"}
                      </div>
                    </label>
                  ))}
                </div>
                <BUTTONSSTYLE className="d-flex flex-row mt-3 mb-3 justify-content-around">
                  <button
                    className="NormalTextSizing confirmButtonStyle"
                    type="button"
                    onClick={handleCreateNewAccess}
                  >
                    {loadingUpdateAccess ? <LoadingCss /> : "ویرایش"}
                  </button>
                  <button
                    className="NormalTextSizing cancelButtonStyle"
                    type="button"
                    onClick={handleCloseModalCreateAccess}
                  >
                    انصراف
                  </button>
                </BUTTONSSTYLE>
              </Box>
            </Modal>
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
                            <HeaderModalShowAccessMainDiv className="d-flex flex-row justify-content-between align-items-center">
                              <p className="NormalTextSizing HeaderModalShowAccess">
                                دسترسی ها
                              </p>
                              <CustomCloseButton
                                onClick={handleCloseModal}
                                color={`#e91e63`}
                              />
                            </HeaderModalShowAccessMainDiv>
                            <div className="d-flex flex-column gap-2 justify-content-center align-items-center p-3">
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
                      <Modal
                        open={modalchangeAccess === index || false}
                        onClose={handleclosemodalChangeAccess}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                      >
                        <Box sx={modalStyle}>
                          <HeaderModalShowAccessMainDiv className="d-flex flex-row justify-content-between align-items-center">
                            <p className="NormalTextSizing HeaderModalShowAccess">
                              ویرایش
                            </p>
                            <p className="NormalTextSizing HeaderModalShowAccess">
                              {item.name}
                            </p>

                            <CustomCloseButton
                              onClick={handleclosemodalChangeAccess}
                              color={`#e91e63`}
                            />
                          </HeaderModalShowAccessMainDiv>
                          <div className="d-flex flex-column gap-2 justify-content-center align-items-center p-3">
                            {/* {item?.permissions?.map((eachPer, index) => (
                              <p key={index} className="NormalTextSizing">
                                {eachPer?.permission?.name}
                              </p>
                            ))} */}

                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
                              (value) => (
                                <label
                                  key={value}
                                  className="d-flex flex-row align-items-center gap-2"
                                >
                                  <input
                                    type="checkbox"
                                    value={value}
                                    onChange={handleChange}
                                    checked={selectedValues.includes(value)} // Prefill based on selected values
                                  />
                                  <div>
                                    {value === 1 && "داشبورد"}
                                    {value === 2 && "محصولات"}
                                    {value === 3 && "سفارشات"}
                                    {value === 4 && "ساخت هدر"}
                                    {value === 5 && "مقالات"}
                                    {value === 6 && "افتخارات"}
                                    {value === 7 && "نمایشگاه ها"}
                                    {value === 8 && "بنر"}
                                    {value === 9 && "ویدیو"}
                                    {value === 10 && "کاربر سیستم"}
                                    {value === 11 && "کاربر سایت"}
                                    {value === 12 && "سطح دسترسی ها"}
                                  </div>
                                </label>
                              )
                            )}
                          </div>
                          <BUTTONSSTYLE className="d-flex flex-row mt-3 mb-3 justify-content-around">
                            <button
                              className="NormalTextSizing confirmButtonStyle"
                              type="button"
                              onClick={handleUpdatePermissionRole}
                            >
                              {loadingUpdateAccess ? <LoadingCss /> : "ویرایش"}
                            </button>
                            <button
                              className="NormalTextSizing cancelButtonStyle"
                              type="button"
                              onClick={handleclosemodalChangeAccess}
                            >
                              انصراف
                            </button>
                          </BUTTONSSTYLE>
                        </Box>
                      </Modal>

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
                            onClick={() => {
                              handlechangeAccess(index);
                              setStoreRoleId(item.id);
                            }}
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
