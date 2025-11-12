"use client";
import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import styled from "styled-components";
// import redux
import { useDispatch } from "react-redux";
import {
  editUser,
  deleteUser,
  gettingAllRoles,
  editUserPassword,
} from "@/app/Store/thunks";
// import base component
import AreYouShureModal from "@/app/BaseComponent/AreYouSureModal";
import { NavDropdown } from "react-bootstrap";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import LoadingCss from "@/app/BaseComponent/LoadingCss";
import DeleteIcon from "@mui/icons-material/Delete";
import LockIcon from "@mui/icons-material/Lock";

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

const NavBarInsideDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const EditUserModal = styled(Modal)`
  .modal-dialog {
    max-width: 500px;
  }
  .modal-content {
    background-color: #f0f0f0;
  }
  .modal-header {
    border-bottom: 1px solid #ddd;
    justify-content: space-between;
    button {
      margin: 0;
    }
  }
  .modal-title {
    font-weight: bold;
  }
  .modal-body {
    padding: 20px;
  }
  .form-group {
    margin-bottom: 14px;
  }

  .form-control {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px 12px;
  }
  .form-control:focus {
    box-shadow: none;
    border: 1px solid black;
  }
`;

const DeleteButtonStyle = styled.button`
  border: none;
  padding: 3px 5px !important;
  background-color: unset !important;
  border-radius: 4px;
  color: red !important;

  @media (max-width: 768px) {
    padding: 3px 3px !important;
  }
`;

const RoleDivGridStyle = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 6px;
  background-color: white;
  padding: 10px;
  border-radius: 4px;
`;

const BUTTONSSTYLE = styled.div`
  display: flex;
  width: 100%;

  .confirmButtonStyle,
  .cancelButtonStyle {
    font-size: 14px;
    padding: 8px 25px;
    border-radius: 10px;
    font-weight: 500;
    transition: 160ms ease;
  }

  .confirmButtonStyle {
    background: #43a047;
    color: #fff;
    border: none;

    &:hover {
      background: #3a8c3e;
      transform: translateY(-1px);
    }
  }

  .cancelButtonStyle {
    background: #fafafa;
    border: 1px solid #d0d0d0;
    color: #444;

    &:hover {
      background: #f0f0f0;
      border-color: #bdbdbd;
      transform: translateY(-1px);
    }
  }
`;

function EditUserBtnfunction({
  data,
  setDataUpdated,
  setConfirmModal,
  closeModalOnTimeout,
}) {
  const dispatch = useDispatch();

  const [rolesData, setRolesData] = useState(null);
  const [selectedValues, setSelectedValues] = useState([]);
  const [loadingConfirmEdit, setLoadingConfirmEdit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [updateData, setUpdateData] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [userData, setUserData] = useState({});
  const [factorType, setFactorType] = useState("");
  const [whereLogin, setWhereLogin] = useState("");

  const [deleteCode, setDeleteCode] = useState("");

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [firstPassword, setfirstPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");

  const [hideAcceseebility, setHideAcceseebility] = useState(true);

  const [error, seterror] = useState(null);
  const hasError = Boolean(error);

  useEffect(() => {
    if (
      firstPassword === secondPassword &&
      firstPassword.length >= 4 &&
      secondPassword.length >= 4
    ) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [firstPassword, secondPassword]);

  useEffect(() => {
    if (whereLogin == 1) {
      setHideAcceseebility(false);
    } else {
      setHideAcceseebility(true);
    }
  }, [whereLogin]);

  // modals state
  const [openModal, setOpenModal] = useState(false);
  const closeModal = () => setOpenModal(false);

  const [modalEditPassword, setModalEditPassword] = useState(false);

  const handleCloseEditModalPassword = () => setModalEditPassword(false);

  const handleDomainChange = (event) => {
    setWhereLogin(event.target.value);
  };

  const handleActiveStateChange = (event) => {
    setFactorType(event.target.value);
  };

  useEffect(() => {
    setUserData(data || {});
    setFactorType(data?.active);
    setWhereLogin(data?.domain);

    setSelectedValues(data?.userRoles?.map((item) => item.role.id) || [3]);
  }, [data]);

  const handleEditModalClose = () => {
    setShowEditModal(false);
  };

  const handleEditModalShow = () => setShowEditModal(true);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleInputChangeFirstPassword = (event) => {
    const value = event.target.value;
    setfirstPassword(value);
  };

  const handelInputChangeSecondPassword = (event) => {
    const value = event.target.value;
    setSecondPassword(value);
  };

  const areYouShureFunction = (e, { code }) => {
    e.preventDefault();
    setDeleteCode(code);
    setOpenModal(true);
  };

  const handleDeleteUser = async () => {
    try {
      setLoadingDelete(true);

      const deleteUserApiCall = await dispatch(
        deleteUser({ code: deleteCode })
      ).unwrap();

      setOpenModal(false);
      setDataUpdated(true);
      if (deleteUserApiCall.statusCode == 200) {
        setConfirmModal(true);
        seterror(null);
        closeModalOnTimeout();
      }
    } catch (error) {
      seterror(error);
      console.error("Error deleting user:", error);
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoadingConfirmEdit(true);
      const sendingEditUser = await dispatch(
        editUser({
          code: userData?.code,
          firstName: userData.firstName,
          lastName: userData.lastName,
          username: userData.username,
          active: factorType,
          domain: whereLogin,
          roleIds: selectedValues,
        })
      ).unwrap();

      if (sendingEditUser.statusCode == 200) {
        setConfirmModal(true);
      }

      setDataUpdated(true);
      seterror(null);

      closeModalOnTimeout();
      handleEditModalClose();
    } catch (error) {
      seterror(error);
      console.error("Error editing user:", error);
    } finally {
      setLoadingConfirmEdit(false);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    try {
      setLoadingConfirmEdit(true);

      const SendingEditUserAPI = await dispatch(
        editUserPassword({ code: userData?.code, password: secondPassword })
      );

      if (SendingEditUserAPI.statusCode == 200) {
        setConfirmModal(true);
      }

      setDataUpdated(true);
      closeModalOnTimeout();
      handleCloseEditModalPassword();
    } catch (error) {
      console.error("Error editing user:", error);
    } finally {
      setLoadingConfirmEdit(false);
    }
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

  useEffect(() => {
    const GettingRoles = async () => {
      const ReturnDataApi = await dispatch(gettingAllRoles()).unwrap();
      setRolesData(ReturnDataApi);
      setUpdateData(false);
    };
    GettingRoles();
  }, [dispatch, updateData]);

  return (
    <>
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
            onClick={handleEditModalShow}
            style={{
              borderBottom: "1px solid black",
              cursor: "pointer",
            }}
            className="d-flex flex-row gap-2 align-items-center pb-1"
          >
            <div style={{ color: "#F3802C" }}>
              <EditIcon className="subitem" />
            </div>
            <p className="NormalTextSizing text-end">ویرایش</p>
          </div>

          <div
            onClick={() => setModalEditPassword(true)}
            style={{
              borderBottom: "1px solid black",
              cursor: "pointer",
            }}
            className="d-flex flex-row gap-2 align-items-center pb-1 pt-1"
          >
            <div style={{ color: "#F3802C" }}>
              <LockIcon className="subitem" />
            </div>
            <p className="NormalTextSizing text-end">تغییر رمز</p>
          </div>

          <div
            onClick={(e) => areYouShureFunction(e, { code: userData?.code })}
            style={{
              cursor: "pointer",
            }}
            className="d-flex flex-row gap-2 align-items-center mt-2"
          >
            <div style={{ color: "#F3802C" }}>
              <DeleteIcon className="text-danger subitem" />
            </div>
            <p className="NormalTextSizing text-end">
              {loadingDelete ? <LoadingCss /> : "حذف اکانت"}
            </p>
          </div>
        </NavBarInsideDiv>
        <div className="d-flex justify-content-end"></div>
      </NavDropDown>

      <EditUserModal show={showEditModal} onHide={handleEditModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>ویرایش کاربر</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <>
              <p
                className="d-flex justify-content-center mb-2"
                style={{ color: "#e91e63" }}
              >
                {error}
              </p>
            </>
          )}
          <form onSubmit={handleEditSubmit}>
            <div className="form-group">
              <label className="mb-1 me-1" htmlFor="firstName">
                نام
              </label>
              <input
                style={{ border: hasError ? "1.2px solid #FF4F3F" : "" }}
                type="text"
                id="firstName"
                className="form-control"
                placeholder="نام"
                name="firstName"
                value={userData.firstName || ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="mb-1 me-1" htmlFor="lastName">
                نام خانوادگی
              </label>
              <input
                style={{ border: hasError ? "1.2px solid #FF4F3F" : "" }}
                type="text"
                id="lastName"
                className="form-control"
                placeholder="نام خانوادگی"
                name="lastName"
                value={userData.lastName || ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="mb-1 me-1" htmlFor="username">
                شماره همراه
              </label>
              <input
                style={{ border: hasError ? "1.2px solid #FF4F3F" : "" }}
                type="number"
                id="username"
                className="form-control"
                placeholder="شماره همراه"
                name="username"
                value={userData.username || ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="mb-1 me-1" htmlFor="factorType">
                وضعیت
              </label>
              <select
                style={{
                  border: hasError ? "1.2px solid #FF4F3F" : "",
                  boxShadow: "unset",
                }}
                id="factorType"
                value={factorType}
                name="active"
                onChange={handleActiveStateChange}
                className="form-select mb-2"
              >
                <option value="true">فعال</option>
                <option value="false">غیرفعال</option>
              </select>
            </div>
            <div className="form-group">
              <label className="mb-1 me-1" htmlFor="whereLogin">
                نوع دسترسی
              </label>
              <select
                id="whereLogin"
                value={whereLogin}
                name="whereLogin"
                onChange={handleDomainChange}
                className="form-select mb-2"
                style={{
                  border: hasError ? "1.2px solid #FF4F3F" : "",
                  boxShadow: "unset",
                }}
              >
                <option value="1">سایت</option>
                <option value="2">ادمین و سایت</option>
              </select>
            </div>

            {/* <div className="form-group">
              <label className="mb-1 me-1" htmlFor="rolesChange">
                دسترسی
              </label>
              <select
                id="rolesChange"
                value={rolesChange}
                name="rolesChange"
                onChange={handleRoleChange}
                className="form-select mb-2"
                style={{ boxShadow: "unset" }}
              >
                <option value="1">مدیر</option>
                <option value="2">ادمین</option>
                <option value="3">مشتری</option>
              </select>
            </div> */}
            {hideAcceseebility && (
              <div className="form-group">
                <label className="mb-1 me-1">سطح دسترسی</label>
                <RoleDivGridStyle className="mt-2">
                  {rolesData?.map((item, index) => (
                    <label
                      key={index}
                      className="d-flex flex-row align-items-center gap-2"
                    >
                      <input
                        style={{
                          border: hasError ? "1.2px solid #FF4F3F" : "",
                        }}
                        type="checkbox"
                        value={item.id}
                        onChange={handleChange}
                        checked={selectedValues.includes(item.id)}
                      />
                      <div>{item.name}</div>
                    </label>
                  ))}
                </RoleDivGridStyle>
              </div>
            )}

            <div className="d-flex flex-row justify-content-between">
              <BUTTONSSTYLE className="justify-content-end">
                <Button
                  className="confirmButtonStyle"
                  variant="primary"
                  type="submit"
                >
                  {loadingConfirmEdit ? <LoadingCss /> : "ذخیره"}
                </Button>
                {/* <DeleteButtonStyle
                type="button"
                
              >
                {loadingDelete ? <LoadingCss /> : "حذف اکانت"}
              </DeleteButtonStyle> */}
              </BUTTONSSTYLE>
            </div>
          </form>
        </Modal.Body>
      </EditUserModal>

      <EditUserModal
        show={modalEditPassword}
        onHide={() => setModalEditPassword(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>تغییر رمز اکانت</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {error && (
            <>
              <p
                className="d-flex justify-content-center mb-2"
                style={{ color: "#e91e63" }}
              >
                {error}
              </p>
            </>
          )}
          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label
                className="mb-1 me-1 NormalTextSizing"
                htmlFor="firstPassword"
              >
                پسورد جدید
              </label>
              <input
                style={{ border: hasError ? "1.2px solid #FF4F3F" : "" }}
                type="password"
                id="firstPassword"
                className="form-control NormalTextSizing"
                placeholder="پسورد جدید"
                name="firstName"
                value={firstPassword}
                onChange={handleInputChangeFirstPassword}
                required
              />
            </div>
            <div className="form-group">
              <label
                className="mb-1 me-1 NormalTextSizing"
                htmlFor="secondPassword"
              >
                تایید پسورد
              </label>
              <input
                style={{ border: hasError ? "1.2px solid #FF4F3F" : "" }}
                type="password"
                id="secondPassword"
                className="form-control NormalTextSizing"
                placeholder="تایید پسورد"
                name="secondPassword"
                value={secondPassword}
                onChange={handelInputChangeSecondPassword}
                required
              />
            </div>

            <div className="d-flex flex-row justify-content-between">
              <BUTTONSSTYLE className="justify-content-end">
                <Button
                  className="NormalTextSizing confirmButtonStyle"
                  disabled={isButtonDisabled}
                  style={{
                    backgroundColor: isButtonDisabled ? "#868686" : "",
                    border: isButtonDisabled ? "#868686" : "",
                    cursor: isButtonDisabled ? "not-allowed" : "pointer",
                  }}
                  variant="primary"
                  type="submit"
                >
                  {loadingConfirmEdit ? <LoadingCss /> : "ذخیره"}
                </Button>
              </BUTTONSSTYLE>
            </div>
          </form>
        </Modal.Body>
      </EditUserModal>

      {/* modals */}
      <AreYouShureModal
        open={openModal}
        onClose={closeModal}
        text={"ایا از حذف کاربر مطمئن هستید"}
        func={handleDeleteUser}
      />
    </>
  );
}

export default EditUserBtnfunction;
