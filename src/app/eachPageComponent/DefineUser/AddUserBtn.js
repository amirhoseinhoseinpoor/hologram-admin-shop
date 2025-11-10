"use client";
import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import styled from "styled-components";
// import base component
import LoadingCss from "@/app/BaseComponent/LoadingCss";

// import redux
import { useDispatch } from "react-redux";
import { addUser, getuser, gettingAllRoles } from "@/app/Store/thunks";

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
const RoleDivGridStyle = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 6px;
  background-color: white;
  padding: 10px;
  border-radius: 4px;
`;

export default function AddUserBtn({
  setDataUpdated,
  setConfirmModal,
  setErrorModal,
}) {
  const dispatch = useDispatch();

  const [rolesData, setRolesData] = useState(null);

  const [updateData, setUpdateData] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);

  const [loadingAddUser, setLoadingAddUser] = useState(false);

  const [newUserData, setNewUserData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
    domain: "",
    roleId: [],
  });

  const [isButtonDisabled, setisButtonDisabled] = useState(true);
  const [hideAcceseebility, setHideAcceseebility] = useState(true);

  const [error, seterror] = useState(null);

  useEffect(() => {
    if (
      newUserData?.password === newUserData?.confirmPassword &&
      newUserData?.password?.length >= 4 &&
      newUserData?.confirmPassword?.length >= 4 &&
      newUserData?.firstName?.length > 0 &&
      newUserData?.lastName?.length > 0 &&
      newUserData?.domain &&
      newUserData?.roleId &&
      newUserData?.username?.length === 11
    ) {
      setisButtonDisabled(false);
    } else {
      setisButtonDisabled(true);
    }
  }, [newUserData]);

  useEffect(() => {
    if (newUserData?.domain == 1) {
      setHideAcceseebility(false);
    } else {
      setHideAcceseebility(true);
    }
  }, [newUserData]);

  const [showAddModal, setShowAddModal] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setNewUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleAddModalClose = () => setShowAddModal(false);
  const handleAddModalShow = () => setShowAddModal(true);

  const handleAddUser = async (event) => {
    event.preventDefault();
    try {
      setLoadingAddUser(true);

      const gettingResponseAPI = await dispatch(addUser(newUserData)).unwrap();

      if (gettingResponseAPI) {
        setDataUpdated(true);
        setConfirmModal(true);
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

  useEffect(() => {
    const GettingRoles = async () => {
      const ReturnDataApi = await dispatch(gettingAllRoles()).unwrap();
      setRolesData(ReturnDataApi);
      setUpdateData(false);
    };
    GettingRoles();
  }, [dispatch, updateData]);

  const handleChange = (event) => {
    const value = Number(event.target.value);

    if (event.target.checked) {
      // Add to selectedValues if checked
      setSelectedValues((prev) => [...prev, value]);

      // Update newUserData with the new roleId
      setNewUserData((prevUserData) => ({
        ...prevUserData,
        roleId: [...prevUserData.roleId, value],
      }));
    } else {
      // Remove from selectedValues if unchecked
      setSelectedValues((prev) => prev.filter((v) => v !== value));

      // Update newUserData to remove the unchecked roleId
      setNewUserData((prevUserData) => ({
        ...prevUserData,
        roleId: prevUserData.roleId.filter((id) => id !== value),
      }));
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

            <div className="form-group">
              <label className="mb-1 me-1" htmlFor="confirmPassword">
                تکرار رمز
              </label>
              <input
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

            <div className="form-group">
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
            </div>

            {/* <div className="form-group">
              <label className="mb-1 me-1" htmlFor="roleId">
                سطح دسترسی
              </label>
              <select
                id="roleId"
                name="roleId"
                className="form-control"
                value={newUserData.roleId}
                onChange={handleInputChange}
                required
              >
                {rolesData?.map((item, index) => (
                  <>
                    <option value="1">{item.name}</option>
                  </>
                ))}
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
                        type="checkbox"
                        value={item.id}
                        onChange={handleChange}
                      />
                      <div>{item.name}</div>
                    </label>
                  ))}
                </RoleDivGridStyle>
              </div>
            )}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAddModalClose}>
            لغو
          </Button>
          <Button
            variant="primary"
            onClick={handleAddUser}
            disabled={isButtonDisabled}
            style={{
              backgroundColor: "#191919",
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
        </Modal.Footer>
      </AddUserModal>
    </section>
  );
}
