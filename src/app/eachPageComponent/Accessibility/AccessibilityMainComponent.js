import { PrimaryButton } from "@/app/BaseComponent/Buttons";
import AddIcon from "@mui/icons-material/Add";
import { HeadermakeOrder } from "@/app/BaseComponent/PageHeader";
import { useState, useEffect } from "react";
import ProfileComponent from "@/app/BaseComponent/ProfileComponent";
import NavBarToggleBurgerButton from "@/app/BaseComponent/NavBarToggleBurgerButton";
import styled from "styled-components";
// import redux
import { useDispatch } from "react-redux";
import {
  gettingAllRoles,
  deleteRole,
  updatePermissionRole,
  createPermissionRole,
} from "@/app/Store/thunks";

import { Modal, Box } from "@mui/material";
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

const SectionMain = styled.section`
  /* padding: 10px; */
  /* border-radius: 4px;
  border: 2px solid #ccc; */

  /* .addRoleButtonStyle {
    background-color: var(--c-primary);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 4px 12px;
    cursor: pointer;
  } */
  /* .headerBAckGroundColor {
    background-color: #f3f4f6;
    border-radius: 4px;
    padding: 8px;
  } */
`;

const AddRoleButton = PrimaryButton;

const ModalHimselfStyle = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavBarInsideDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* padding-bottom: 10px; */
  /* border-bottom: 1.4px solid #e1e5ea; */
`;

const HeaderModalShowAccessMainDiv = styled.div`
  background-color: #f3f4f6;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  padding: 10px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  position: sticky;
  top: 0;
  z-index: 10;
`;

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  maxHeight: "80vh", // important!
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 8,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

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

const BUTTONSSTYLE = styled.div`
  .cancelButtonStyle {
    color: var(--c-danger);
    background-color: unset;
    border: 1px solid var(--c-danger);
    padding-right: 10px;
    padding-left: 10px;
    border-radius: 4px;
  }

  .deleteButtonStyle {
    color: var(--c-danger) !important;
    background-color: transparent;
  }
  .confirmButtonStyle {
    padding: 4px 20px;
    color: white;
    background-color: var(--c-primary);
    border: none;
    border-radius: 4px;
  }
  .editRole {
    background-color: #f3f4f6;
    border-top: 1px solid gray;
    border-bottom-left-radius: 4px !important;
    border-bottom-right-radius: 4px !important;
  }
`;

const BorderStyleAccessbility = styled.label`
  /* border-top: 1px solid gray !important; */
  width: 100% !important;
  /* justify-content: center; */
  padding-top: 4px;
`;

const FixTablePlace = styled.div`
  @media (min-width: 980px) {
    position: relative;
    overflow: hidden;
    background: var(--c-surface);
    border: 1px solid var(--c-border);
    border-radius: var(--r-md);
    box-shadow: var(--shadow-sm);
    .pTagForStyle {
      padding: 16px 20px;
      margin: 0 !important;
      font-size: 15px;
      font-weight: 600;
      color: var(--c-ink);
      background-color: var(--c-surface);
      border-bottom: 1px solid var(--c-border);
    }
    .tabelStyle {
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
      }
    }
  }

  .SeeAccessButtom {
    cursor: pointer;
    color: var(--c-primary);
  }
`;

const ModalContainer = styled(Box)`
  width: 450px;
  max-width: 90%;
  background: #ffffff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0px 8px 30px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.25s ease-out;
  max-height: 80vh;
  display: flex;
  flex-direction: column;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, -48%);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }
`;

const ModalHeader = styled.div`
  background: #f5f5f5;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  p {
    margin: 0;
    font-size: 1rem;
    font-weight: bold;
  }
`;
const PermissionTag = styled.div`
  background: #f3f4f6;
  padding: 10px 14px;
  width: 100%;
  border-radius: 9px;
  border: 1px solid #e2e3e5;
  text-align: right;
  font-size: 0.88rem;
  transition: 0.2s;

  &:hover {
    background: #eaecef;
  }
`;

const CheckboxRow = styled.label`
  width: 100%;
  background: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  gap: 10px;
  align-items: center;
  transition: 0.2s;

  &:hover {
    background: #f0f0f0;
  }
`;

const ModalFooter = styled.div`
  background: #f5f5f5;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;

  .confirm {
    background: var(--c-primary);
    border: none;
    padding: 8px 20px;
    border-radius: 6px;
    color: white;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      background: #388e3c;
    }
  }

  .cancel {
    border: 1px solid var(--c-danger);
    color: var(--c-danger);
    background: white;
    padding: 8px 20px;
    border-radius: 6px;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      background: #ffe7ef;
    }
  }
`;

export default function Accessibility({ toggleShow }) {
  const dispatch = useDispatch();

  const [rolesData, setRolesData] = useState(null);
  const [updateData, setUpdateData] = useState(false);
  const [dataForDelete, setDataForDelete] = useState(null);
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectedValueCreateAccess, setSelectedValueCreateAccess] = useState(
    [],
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
    const selectedRole = rolesData[index - 1];

    const permissions =
      selectedRole?.permissions?.map((p) => p.permission.id) || [];

    setSelectedValues(permissions); // Preload selected values from the role's permissions
    setModalchangeAccess(index);
  };

  const handlechangeAccessCreate = () => {
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
        deleteRole({ id: dataForDelete }),
      ).unwrap();
      if (dataReturnAPI) {
        setOpenModal2(true);
        setTimeout(() => {
          setOpenModal2(false);
        }, 3000);
      }
    } catch {
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
        }),
      ).unwrap();

      if (dataReturnAPI) {
        setOpenModal2(true);
        setTimeout(() => {
          setOpenModal2(false);
        }, 3000);
      }
    } catch {
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
        }),
      ).unwrap();
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
        <div className="textHeaderStyle d-flex align-items-center">
          سطح دسترسی ها
        </div>
        <ProfileComponent />
      </HeadermakeOrder>

      <div className="container">
        <div className="d-flex justify-content-end mb-4">
          <AddRoleButton
            onClick={() => {
              handlechangeAccessCreate();
            }}
          >
            <AddIcon />
            افزودن نقش جدید
          </AddRoleButton>
        </div>
        <SectionMain>
          <div className="d-flex justify-content-end headerBAckGroundColor">
            <ModalHimselfStyle
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
                    color={`var(--c-danger)`}
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

                <div
                  className="d-flex flex-column gap-2 justify-content-center align-items-center p-3"
                  style={{ flex: 1, overflowY: "auto" }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((value) => (
                    <BorderStyleAccessbility
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
                        {value === 13 && "تماس با ما"}
                      </div>
                    </BorderStyleAccessbility>
                  ))}
                </div>
                <BUTTONSSTYLE>
                  <div className="editRole">
                    <div className="d-flex flex-row pt-2 pb-2 justify-content-around">
                      <button
                        className="NormalTextSizing confirmButtonStyle"
                        type="button"
                        onClick={handleCreateNewAccess}
                      >
                        {loadingUpdateAccess ? <LoadingCss /> : "ذخیره"}
                      </button>
                      <button
                        className="NormalTextSizing cancelButtonStyle"
                        type="button"
                        onClick={handleCloseModalCreateAccess}
                      >
                        انصراف
                      </button>
                    </div>
                  </div>
                </BUTTONSSTYLE>
              </Box>
            </ModalHimselfStyle>
          </div>

          <div>
            <FixTablePlace className="table table-striped">
              <p className="me-2 NormalTextSizing mb-2 pTagForStyle">
                سطح دسترسی ها
              </p>

              <table className="table table-striped tabelStyle">
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
                          <ModalHimselfStyle
                            open={modalPermision === index}
                            onClose={handleCloseModal}
                          >
                            <ModalContainer sx={modalStyle}>
                              <ModalHeader>
                                <p>دسترسی‌ها</p>
                                <CustomCloseButton
                                  onClick={handleCloseModal}
                                  color="var(--c-danger)"
                                />
                              </ModalHeader>

                              <div
                                className="p-3 d-flex flex-column gap-2"
                                style={{
                                  flex: 1,
                                  overflowY: "auto",
                                }}
                              >
                                {item?.permissions?.map((eachPer, i) => (
                                  <PermissionTag key={i}>
                                    {eachPer?.permission?.name}
                                  </PermissionTag>
                                ))}
                              </div>
                            </ModalContainer>
                          </ModalHimselfStyle>
                        </div>
                      </td>

                      <td>
                        <ModalHimselfStyle
                          open={modalchangeAccess === index}
                          onClose={handleclosemodalChangeAccess}
                        >
                          <ModalContainer sx={modalStyle}>
                            <ModalHeader>
                              <p>ویرایش </p>
                              <p>{item.name}</p>
                              <CustomCloseButton
                                onClick={handleclosemodalChangeAccess}
                                color="var(--c-danger)"
                              />
                            </ModalHeader>

                            <div
                              className="p-3 d-flex flex-column gap-2"
                              style={{
                                flex: 1,
                                overflowY: "auto",
                              }}
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(
                                (value) => (
                                  <CheckboxRow key={value}>
                                    <input
                                      type="checkbox"
                                      value={value}
                                      onChange={handleChange}
                                      checked={selectedValues.includes(value)}
                                    />
                                    <div>
                                      {value === 1 && "داشبورد"}
                                      {value === 2 && "محصولات"}
                                      {value === 3 && "سفارشات"}
                                      {value === 4 && "ساخت هدر"}
                                      {value === 5 && "مقالات"}
                                      {value === 6 && "افتخارات"}
                                      {value === 7 && "نمایشگاه‌ها"}
                                      {value === 8 && "بنر"}
                                      {value === 9 && "ویدیو"}
                                      {value === 10 && "کاربر سیستم"}
                                      {value === 11 && "کاربر سایت"}
                                      {value === 12 && "سطح دسترسی‌ها"}
                                      {value === 13 && "تماس با ما"}
                                    </div>
                                  </CheckboxRow>
                                ),
                              )}
                            </div>

                            <ModalFooter>
                              <button
                                className="confirm"
                                onClick={handleUpdatePermissionRole}
                              >
                                {loadingUpdateAccess ? <LoadingCss /> : "ذخیره"}
                              </button>

                              <button
                                className="cancel"
                                onClick={handleclosemodalChangeAccess}
                              >
                                انصراف
                              </button>
                            </ModalFooter>
                          </ModalContainer>
                        </ModalHimselfStyle>

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
                              <div style={{ color: "var(--c-warning)" }}>
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
              </table>
            </FixTablePlace>
          </div>
        </SectionMain>
      </div>
      {/* modlas */}
      <AreYouShureModal
        open={openModal}
        onClose={closeModal}
        text={"آیا از حذف دسترسی مطمئن هستید؟"}
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
        text={"خطا در انجام عملیات، لطفاً دوباره تلاش کنید"}
      />
    </section>
  );
}
