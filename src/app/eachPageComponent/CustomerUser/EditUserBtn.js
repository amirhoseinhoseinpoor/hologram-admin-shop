"use client";
import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import styled from "styled-components";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
// import redux
import { useDispatch } from "react-redux";
import { editUser, deleteUser, editUserPassword } from "@/app/Store/thunks";
// import base component
import AreYouShureModal from "@/app/BaseComponent/AreYouSureModal";
import { NavDropdown } from "react-bootstrap";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LockIcon from "@mui/icons-material/Lock";
import LoadingCss from "@/app/BaseComponent/LoadingCss";

const NavDropDown = styled(NavDropdown)`
  .dropdown-menu {
    border: 1px solid gray;
    width: 150px;
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
  closeModalOnTimeout,
  setConfirmModal,
}) {
  const dispatch = useDispatch();
  const [showEditModal, setShowEditModal] = useState(false);
  const [userData, setUserData] = useState({});
  const [factorType, setFactorType] = useState("");
  const [whereLogin, setWhereLogin] = useState("");
  const [deleteCode, setDeleteCode] = useState("");

  const [loadingConfirmEdit, setLoadingConfirmEdit] = useState(false);

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [firstPassword, setfirstPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);

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

  // modals state
  const [openModal, setOpenModal] = useState(false);
  const closeModal = () => setOpenModal(false);

  const [modalEditPassword, setModalEditPassword] = useState(false);

  const handleCloseEditModalPassword = () => setModalEditPassword(false);

  const handleActiveStateChange = (event) => {
    setFactorType(event.target.value);
  };

  useEffect(() => {
    setUserData(data || {});
    setFactorType(data?.active);
    setWhereLogin(data?.domain);
  }, [data, showEditModal]);

  const handleEditModalClose = () => {
    setShowEditModal(false);
  };

  const handleEditModalShow = () => setShowEditModal(true);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const areYouShureFunction = (e, { code }) => {
    e.preventDefault();
    setDeleteCode(code);
    setOpenModal(true);
  };

  const handleInputChangeFirstPassword = (event) => {
    const value = event.target.value;
    setfirstPassword(value);
  };

  const handelInputChangeSecondPassword = (event) => {
    const value = event.target.value;
    setSecondPassword(value);
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
          <form onSubmit={handleEditSubmit}>
            <div className="form-group">
              <label className="mb-1 me-1" htmlFor="firstName">
                نام
              </label>
              <input
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
                id="factorType"
                value={factorType}
                name="active"
                onChange={handleActiveStateChange}
                className="form-select mb-2"
                style={{ boxShadow: "unset" }}
              >
                <option value="true">فعال</option>
                <option value="false">غیرفعال</option>
              </select>
            </div>
            {/* <div className="form-group">
              <label className="mb-1 me-1" htmlFor="whereLogin">
                نوع دسترسی
              </label>
              <select
                id="whereLogin"
                value={whereLogin}
                name="whereLogin"
                onChange={handleDomainChange}
                className="form-select mb-2"
                style={{ boxShadow: "unset" }}
              >
                <option value="1">سایت</option>
                <option value="2">ادمین و سایت</option>
              </select>
            </div> */}
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
            <div className="d-flex flex-row justify-content-between">
              <BUTTONSSTYLE className="justify-content-end">
                <Button className="confirmButtonStyle" type="submit">
                  {loadingConfirmEdit ? <LoadingCss /> : "ذخیره"}
                </Button>
                {/* <DeleteButtonStyle
                type="button"
                onClick={(e) =>
                  areYouShureFunction(e, { code: userData?.code })
                }
              >
                حذف اکانت
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
          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label
                className="mb-1 me-1 NormalTextSizing"
                htmlFor="firstPassword"
              >
                پسورد جدید
              </label>
              <input
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
