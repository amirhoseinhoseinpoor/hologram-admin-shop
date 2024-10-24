"use client";
import React, { useState , useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import styled from "styled-components";

// import redux
import { useDispatch , useSelector } from "react-redux";
import { addUser } from "@/app/Store/thunks";
import { getuser } from "@/app/Store/thunks";



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
  .form-control:focus{
     box-shadow: none; 
     border: 1px solid black;   
  }
`;
const AddUserBtnstyle = styled(Button)`
  background-color: #4caf50; /* Green */
  border: none;
  color: white;
  padding: 8px 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #3e8e41;
  }
`;

export default function AddUserBtn() {
  const dispatch = useDispatch();

  const [newUserData, setNewUserData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    gender: "u",
    domain: "",
    roleIdsC: "",
  });
  const [showAddModal, setShowAddModal] = useState(false);

  const [dataCome , setDataCome] = useState([]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
   
    setNewUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleAddModalClose = () => setShowAddModal(false);
  const handleAddModalShow = () => setShowAddModal(true);

  useEffect(() => {
    const fetchData = async () => {
      const dataComeAPI = await dispatch(getuser()).unwrap();
      setDataCome(dataComeAPI);
    }
    fetchData();
   
  }, [dispatch]);

  const handleAddUser = async (event) => {
    event.preventDefault();
    try {
      await dispatch(addUser(newUserData))
      console.log(newUserData);
      handleAddModalClose();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  console.log(dataCome);
  
  return (
    <section className="mb-3">
      <AddUserBtnstyle variant="primary" onClick={handleAddModalShow}>
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
                <label className="mb-1 me-1" htmlFor="firstName">نام</label>
              <input
                type="text"
                id="firstName" 
                name="firstName"
                placeholder="نام"
                className="form-control"
                value={newUserData.firstName}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="mb-1 me-1" htmlFor="lastName">نام خانوادگی</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="نام خانوادگی"
                className="form-control"
                value={newUserData.lastName}
                onChange={handleInputChange}
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
            <label className="mb-1 me-1" htmlFor="username">شماره همراه</label>
              <input
                type="number"
                id="username"
                name="username"
                placeholder="شماره همراه"
                className="form-control"
                value={newUserData.cardId}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
            <label className="mb-1 me-1" htmlFor="password">رمز</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="رمز"
                className="form-control"
                value={newUserData.password}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">  
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
            </div> 
            
            <div className="form-group">  
              <label className="mb-1 me-1" htmlFor="domain">امکان دسترسی</label>  
              <select  
                id="domain"  
                name="domain"  
                className="form-control"  
                value={newUserData.domain}  
                onChange={handleInputChange}  
              >  
                <option value="" disabled>انتخاب کنید</option>  
                <option value="2">ویرایشگر</option>  
                <option value="1">بیننده</option>  
              </select>  
            </div>

            <div className="form-group">  
              <label className="mb-1 me-1" htmlFor="roleIdsC">نوع کاربر</label>  
              <select  
                id="roleIdsC"  
                name="roleIdsC"  
                className="form-control"  
                value={newUserData.roleIdsC}  
                onChange={handleInputChange}  
              >  
                <option value="" disabled>انتخاب کنید</option>  
                <option value="3">مدیر</option>  
                <option value="2">ادمین</option>  
                <option value="1">مشتری</option>  
              </select>  
            </div>   
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAddModalClose}>
            لغو
          </Button>
          <Button variant="primary" onClick={handleAddUser}>
            اضافه کردن
          </Button>
        </Modal.Footer>
      </AddUserModal>
    </section>
  );
}
