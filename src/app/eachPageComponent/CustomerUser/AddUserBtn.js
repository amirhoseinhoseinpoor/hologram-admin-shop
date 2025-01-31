"use client";
import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import styled from "styled-components";


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
  padding: 5px;
  text-align: center;
  cursor: pointer;
  border-radius: 4px;
  background-image : linear-gradient(195deg, #66BB6A 0%, #43A047 100%);;
`;



export default function AddUserBtn({
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
    domain: "1",
  });
  
  const [showAddModal, setShowAddModal] = useState(false);

  // const [dataCome , setDataCome] = useState([]);

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
      const gettingResponseAPI = await dispatch(addUser(newUserData)).unwrap();

      if (gettingResponseAPI) {
        setDataUpdated(true);
        setConfirmModal(true);
      } else {
        setErrorModal(true);
      }

      handleAddModalClose();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <section>
      <AddUserBtnstyle
        className="NormalTextSizing"
        variant="primary"
        onClick={handleAddModalShow}
      >
        اضافه کردن کاربر جدید
      </AddUserBtnstyle>
      <AddUserModal show={showAddModal} onHide={handleAddModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>اضافه کردن کاربر جدید</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            {/* Input fields for new user data (replace with appropriate labels) */}
            <div className="form-group">
              <label className="mb-1 me-1" htmlFor="firstName">
                نام
              </label>
              <input
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
          <Button style={{border : "unset"}} variant="secondary" onClick={handleAddModalClose}>
            لغو
          </Button>
          <Button style={{backgroundColor : "#191919" , border : "unset"}} onClick={handleAddUser}>
            اضافه کردن
          </Button>
        </Modal.Footer>
      </AddUserModal>
    </section>
  );
}
