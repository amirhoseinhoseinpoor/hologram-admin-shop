"use client"
import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import styled from "styled-components"



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
  .form-control:focus{
     box-shadow: none; 
     border: 1px solid black;   
  }
`;

const EditUserBtn = styled.button`
  background-color: #4CAF50; /* Green */
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



function EditUserBtnfunction({ userId, onSubmit }) {
    const [showEditModal, setShowEditModal] = useState(false);
    const [userData, setUserData] = useState({}); // State for user data to be edited
  
    useEffect(() => {
      // ... fetch user data based on userId (replace with your implementation)
      // ... setUserData with fetched user data
    }, [userId]);
  
    const handleEditModalClose = () => {
      setShowEditModal(false);
    };
  
    const handleEditModalShow = () => setShowEditModal(true);
  
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setUserData((prevData) => ({ ...prevData, [name]: value }));
    };
  
    const handleEditSubmit = async (event) => {
      event.preventDefault();
      onSubmit(userData); // Pass updated userData to parent component
      handleEditModalClose();
    };
  
    return (
      <>
        <EditUserBtn onClick={handleEditModalShow}>ویرایش</EditUserBtn>
        <EditUserModal show={showEditModal} onHide={handleEditModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>ویرایش کاربر</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
              <label className="mb-1 me-1" htmlFor="firstName">نام</label>
                <input
                  type="text"
                  id='firstName'
                  className="form-control"
                  placeholder="نام"
                  name="firstName"
                  value={userData.firstName || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
              <label className="mb-1 me-1" htmlFor="lastName">نام خانوادگی</label>
                <input
                  type="text"
                  id='lastName'
                  className="form-control"
                  placeholder="نام خانوادگی"
                  name="lastName"
                  value={userData.lastName || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
              <label className="mb-1 me-1" htmlFor="age">سن</label>
                <input
                  type="number"
                  id='age'
                  className="form-control"
                  placeholder="سن"
                  name="age"
                  value={userData.age || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
              <label className="mb-1 me-1" htmlFor="cardId">کد ملی</label>
                <input
                  type="text"
                  id='cardId'
                  className="form-control"
                  placeholder="کد ملی"
                  name="cardId"
                  value={userData.cardId || ''}
                  onChange={handleInputChange}
                />
              </div>
              <Button variant="primary" type="submit">
                ذخیره
              </Button>
            </form>
          </Modal.Body>
        </EditUserModal>
      </>
    );
  }

export default EditUserBtnfunction;