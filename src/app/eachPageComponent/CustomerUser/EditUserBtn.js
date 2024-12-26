"use client";
import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import styled from "styled-components";
// import redux
import { useDispatch } from "react-redux";
import { editUser, deleteUser } from "@/app/Store/thunks";
// import base component
import AreYouShureModal from "@/app/BaseComponent/AreYouSureModal";;

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

const EditUserBtn = styled.button`
  border: none;
  color: white;
  padding: 5px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
  background-image: linear-gradient(195deg, #66bb6a 0%, #43a047 100%);
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

function EditUserBtnfunction({ data, setDataUpdated, setConfirmModal }) {
  const dispatch = useDispatch();
  const [showEditModal, setShowEditModal] = useState(false);
  const [userData, setUserData] = useState({});
  const [factorType, setFactorType] = useState("");
  const [whereLogin, setWhereLogin] = useState("");
  const [rolesChange, setrolesChange] = useState("");
  const [deleteCode, setDeleteCode] = useState("");

  // modals state
  const [openModal, setOpenModal] = useState(false);
  const closeModal = () => setOpenModal(false);

//   const handleDomainChange = (event) => {
//     setWhereLogin(event.target.value);
//   };

//   const handleRoleChange = (event) => {
//     setrolesChange(event.target.value);
//   };

  const handleActiveStateChange = (event) => {
    setFactorType(event.target.value);
  };

  useEffect(() => {
    setUserData(data || {});
    setFactorType(data?.active);
    setWhereLogin(data?.domain);
    setrolesChange(data?.userRoles[0]?.role?.name || 3);
  }, [data, showEditModal]);

  useEffect(() => {
    if (rolesChange == "admin") {
      setrolesChange(2);
    } else if (rolesChange == "master") {
      setrolesChange(1);
    } else if (rolesChange == "customer") {
      setrolesChange(3);
    }
  }, [rolesChange]);

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

  const handleDeleteUser = async () => {
    const deleteUserApiCall = await dispatch(
      deleteUser({ code: deleteCode })
    ).unwrap();

    setOpenModal(false);
    setDataUpdated(true);
    if (deleteUserApiCall.statusCode == 200) {
      setConfirmModal(true);
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();

    const sendingEditUser = await dispatch(
      editUser({
        code: userData?.code,
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
        active: factorType,
        domain: whereLogin,
        roleIds: [rolesChange],
      })
    ).unwrap();

    setDataUpdated(true);
    console.log(sendingEditUser);
    handleEditModalClose();
  };

  return (
    <>
      <EditUserBtn
        className="NormalTextSizing"
        onClick={handleEditModalShow}
      >
        ویرایش
      </EditUserBtn>
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
              <label className="mb-1 me-1" htmlFor="age">
                شماره همراه
              </label>
              <input
                type="number"
                id="age"
                className="form-control"
                placeholder="شماره همراه"
                name="age"
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
              <Button variant="primary" type="submit">
                ذخیره
              </Button>
              <DeleteButtonStyle
                type="button"
                onClick={(e) =>
                  areYouShureFunction(e, { code: userData?.code })
                }
              >
                حذف اکانت
              </DeleteButtonStyle>
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
