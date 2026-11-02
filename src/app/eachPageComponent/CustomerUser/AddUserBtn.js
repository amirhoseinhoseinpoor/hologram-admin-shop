"use client";
import { PrimaryButton } from "@/app/BaseComponent/Buttons";
import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import styled from "styled-components";
import LoadingCss from "@/app/BaseComponent/LoadingCss";

// import redux
import { useDispatch } from "react-redux";
import { addUser } from "@/app/Store/thunks";

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
const AddUserBtnstyle = PrimaryButton;

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
    background: var(--c-primary);
    color: #fff;
    border: none;

    &:hover {
      background: var(--c-primary-600);
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
      <AddUserBtnstyle onClick={handleAddModalShow}>
        <AddIcon />
        افزودن کاربر
      </AddUserBtnstyle>
      <AddUserModal show={showAddModal} onHide={handleAddModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>اضافه کردن کاربر جدید</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            {error && (
              <>
                <p style={{ color: "var(--c-danger)" }} className="text-center">
                  {error}
                </p>
              </>
            )}
            <div className="form-group">
              <label className="mb-1 me-1" htmlFor="firstName">
                نام
              </label>
              <input
                style={{ border: hasError ? "1.2px solid var(--c-danger)" : "" }}
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
                style={{ border: hasError ? "1.2px solid var(--c-danger)" : "" }}
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

            <div className="form-group">
              <label className="mb-1 me-1" htmlFor="username">
                شماره همراه
              </label>
              <input
                style={{ border: hasError ? "1.2px solid var(--c-danger)" : "" }}
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
                style={{ border: hasError ? "1.2px solid var(--c-danger)" : "" }}
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
                style={{ border: hasError ? "1.2px solid var(--c-danger)" : "" }}
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
