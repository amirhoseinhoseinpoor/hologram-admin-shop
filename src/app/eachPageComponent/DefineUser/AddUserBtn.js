"use client";
import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import styled from "styled-components";






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
  const [newUserData, setNewUserData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    cardId: "",
  });
  console.log(newUserData);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    // Corrected syntax for updating state using spread operator (...)
    setNewUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleAddModalClose = () => setShowAddModal(false);
  const handleAddModalShow = () => setShowAddModal(true);

  const handleAddUser = async () => {
    try {
      //   const response = await fetch('/public/json/tabelContent.json'); // Simulate file reading
      //   const existingUsers = await response.json();

      const updatedUsers = [newUserData];

      const updateResponse = await fetch("/json/tabelContent.json", {
        method: "post", // Simulate data update
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUsers),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to update users.json");
      }

      onAddUser(updatedUsers); // Pass updated users to parent component
      handleAddModalClose();
    } catch (error) {
      console.error("Error adding user:", error);
      // Handle errors appropriately, e.g., display an error message to the user
    }
  };
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
            <div className="form-group">
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
            </div>

            <div className="form-group">
            <label className="mb-1 me-1" htmlFor="cardId">کد ملی</label>
              <input
                type="number"
                id="cardId"
                name="cardId"
                placeholder="کد ملی"
                className="form-control"
                value={newUserData.cardId}
                onChange={handleInputChange}
              />
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
