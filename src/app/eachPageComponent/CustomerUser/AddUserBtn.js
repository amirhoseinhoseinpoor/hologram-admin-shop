"use client";
import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import styled from "styled-components";
import LoadingCss from "@/app/BaseComponent/LoadingCss";

// import redux
import { useDispatch } from "react-redux";
import { addUser, getuser } from "@/app/Store/thunks";

const AddUserModal = styled(Modal)`
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
const AddUserBtnstyle = styled(Button)`
  border: none;
  color: white;
  padding: 5px !important;
  text-align: center;
  cursor: pointer;
  border-radius: 4px;
  background-image: linear-gradient(195deg, #66bb6a 0%, #43a047 100%);
`;

const BUTTONSSTYLE = styled.div`
  display: flex;
  width: 100%;

  .confirmButtonStyle,
  .cancelButtonStyle {
    font-size: 14px;
    padding: 7px 20px;
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

export default function AddUserBtn({
  closeModalOnTimeout,
  setDataUpdated,
  setConfirmModal,
  setErrorModal,
}) {
  const dispatch = useDispatch();

  const [newUserData, setNewUserData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
    domain: "1",
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [loadingAddUser, setLoadingAddUser] = useState(false);
  const [isButtonDisabled, setisButtonDisabled] = useState(true);
  const [error, seterror] = useState(null);
  const hasError = Boolean(error);

  useEffect(() => {
    if (
      newUserData?.password === newUserData?.confirmPassword &&
      newUserData?.password?.length >= 4 &&
      newUserData?.confirmPassword?.length >= 4 &&
      newUserData?.firstName?.length > 0 &&
      newUserData?.lastName?.length > 0 &&
      newUserData?.username?.length === 11
    ) {
      setisButtonDisabled(false);
    } else {
      setisButtonDisabled(true);
    }
  }, [newUserData]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setNewUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleAddModalClose = () => setShowAddModal(false);
  const handleAddModalShow = () => setShowAddModal(true);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const dataComeAPI = await dispatch(getuser()).unwrap();
  //     setDataCome(dataComeAPI);
  //   }
  //   fetchData();

  // }, [dispatch]);

  const handleAddUser = async (event) => {
    event.preventDefault();
    try {
      setLoadingAddUser(true);
      const gettingResponseAPI = await dispatch(addUser(newUserData)).unwrap();

      if (gettingResponseAPI) {
        setDataUpdated(true);
        setConfirmModal(true);
        closeModalOnTimeout();
      } else {
        setErrorModal(true);
      }

      handleAddModalClose();
    } catch (error) {
      seterror(error);
      console.error("Error adding user:", error);
    } finally {
      setLoadingAddUser(false);
    }
  };

  return (
    <section>
      <AddUserBtnstyle
        className="NormalTextSizing"
        variant="primary"
        onClick={handleAddModalShow}
      >
        اضافه کردن
      </AddUserBtnstyle>
      <AddUserModal show={showAddModal} onHide={handleAddModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>اضافه کردن کاربر جدید</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            {error && (
              <>
                <p style={{ color: "#e91e63" }} className="text-center">
                  {error}
                </p>
              </>
            )}
            <div className="form-group">
              <label className="mb-1 me-1" htmlFor="firstName">
                نام
              </label>
              <input
                style={{ border: hasError ? "1.2px solid #FF4F3F" : "" }}
                type="text"
                id="firstName"
                name="firstName"
                placeholder="نام"
                className="form-control"
                value={newUserData.firstName}
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
                name="lastName"
                placeholder="نام خانوادگی"
                className="form-control"
                value={newUserData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
            {/* <div className="form-group">
            <label className="mb-1 me-1" htmlFor="age">سن</label>
              <input
                type="number"
                id="age"
                name="age"
                placeholder="سن"
                className="form-control"
                value={newUserData.age}
                onChange={handleInputChange}
              />
            </div> */}

            <div className="form-group">
              <label className="mb-1 me-1" htmlFor="username">
                شماره همراه
              </label>
              <input
                style={{ border: hasError ? "1.2px solid #FF4F3F" : "" }}
                type="number"
                id="username"
                name="username"
                placeholder="شماره همراه"
                className="form-control"
                value={newUserData.username}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="mb-1 me-1" htmlFor="password">
                رمز
              </label>
              <input
                style={{ border: hasError ? "1.2px solid #FF4F3F" : "" }}
                type="password"
                id="password"
                name="password"
                placeholder="رمز"
                className="form-control"
                value={newUserData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="mb-1 me-1" htmlFor="confirmPassword">
                تکرار رمز
              </label>
              <input
                style={{ border: hasError ? "1.2px solid #FF4F3F" : "" }}
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="تکرار رمز"
                className="form-control"
                value={newUserData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* <div className="form-group">  
              <label className="mb-1 me-1" htmlFor="gender">جنسیت</label>  
              <select  
                id="gender"  
                name="gender"  
                className="form-control"  
                value={newUserData.gender}  
                onChange={handleInputChange}  
              >  
                <option value="" disabled>انتخاب کنید</option>  
                <option value="m">مرد</option>  
                <option value="f">زن</option>  
              </select>  
            </div>  */}

            {/* <div className="form-group">
              <label className="mb-1 me-1" htmlFor="domain">
                امکان دسترسی
              </label>
              <select
                id="domain"
                name="domain"
                className="form-control"
                value={newUserData.domain}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>
                  انتخاب کنید
                </option>
                <option value="2">سایت و ادمین</option>
                <option value="1">سایت</option>
              </select>
            </div> */}

            {/* <div className="form-group">
              <label className="mb-1 me-1" htmlFor="roleId">
                نوع کاربر
              </label>
              <select
                id="roleId"
                name="roleId"
                className="form-control"
                value={newUserData.roleId}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>
                  انتخاب کنید
                </option>
                <option value="1">مدیر</option>
                <option value="2">ادمین</option>
                <option value="3">مشتری</option>
              </select>
            </div> */}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <BUTTONSSTYLE className="flex gap-2 justify-content-end">
            <Button
              className="cancelButtonStyle"
              variant="secondary"
              onClick={handleAddModalClose}
            >
              لغو
            </Button>
            <Button
              variant="primary"
              onClick={handleAddUser}
              disabled={isButtonDisabled}
              className="confirmButtonStyle"
              style={{
                border: "unset",
                backgroundColor: isButtonDisabled ? "#868686" : "",
                border: isButtonDisabled ? "#868686" : "",
                cursor: isButtonDisabled ? "not-allowed" : "pointer",
              }}
            >
              {loadingAddUser ? (
                <>
                  <LoadingCss />
                </>
              ) : (
                <>ذخیره</>
              )}
            </Button>
          </BUTTONSSTYLE>
        </Modal.Footer>
      </AddUserModal>
    </section>
  );
}
