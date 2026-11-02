"use client";

import { SearchInputMainDiv } from "@/app/BaseComponent/SearchField";
import { HeadermakeOrder } from "@/app/BaseComponent/PageHeader";
import { useEffect, useState } from "react";
// import redux
import { useDispatch } from "react-redux";
import { getuser } from "@/app/Store/thunks";
// import base component
import NavBarToggleBurgerButton from "@/app/BaseComponent/NavBarToggleBurgerButton";
import CustomCloseButton from "@/app/BaseComponent/CustomCloseButton";
import ConfirmingModal from "@/app/BaseComponent/ConfirmingModal";
import ErrorModal from "@/app/BaseComponent/ErrorModal";
import ProfileComponent from "@/app/BaseComponent/ProfileComponent";
import EmptyState from "@/app/BaseComponent/EmptyState";
import { Skeleton, Modal, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import styled from "styled-components";
// import components
import AddUserBtn from "../DefineUser/AddUserBtn";
import EditUserBtnfunction from "./EditUserBtn";

const MAINTABELSTYLE = styled.div`
  border: 1px solid var(--c-border);
  padding: 12px;
  border-radius: var(--r-md);
  background: var(--c-surface);
  box-shadow: var(--shadow-sm);
  margin-bottom: 10px;

  .eachTabelStyle {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 10px;
    border-bottom: 1px solid var(--c-border);
    text-align: center;
    p {
      background-color: #f9fafb;
      padding: 12px 0px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .SecondValueTabel {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const FixTablePlace = styled.div`
  @media (min-width: 980px) {
    position: relative;
    overflow: hidden;
    background: var(--c-surface);
    border: 1px solid var(--c-border);
    border-radius: var(--r-md);
    box-shadow: var(--shadow-sm);
    .pTagForStyle {
      padding: 16px 20px;
      margin: 0 !important;
      font-size: 15px;
      font-weight: 600;
      color: var(--c-ink);
      background-color: var(--c-surface);
      border-bottom: 1px solid var(--c-border);
    }
    .tabelStyle {
      border-collapse: separate;
      border-radius: 12px;
      /* overflow: hidden; */
      width: 100%;
      th,
      td {
        padding: 10px;
        text-align: center;
      }
      th {
      }
    }
  }

  .SeeAccessButtom {
    cursor: pointer;
    color: var(--c-primary);
  }
`;

const HeaderModalShowAccessMainDiv = styled.div`
  background-color: #f3f4f6;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  .HeaderModalShowAccess {
    padding: 10px;
  }
`;

const ModalHimselfStyle = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContainer = styled(Box)`
  width: 450px;
  max-width: 90%;
  background: #ffffff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0px 8px 30px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.25s ease-out;
  max-height: 80vh;
  display: flex;
  flex-direction: column;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, -48%);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }
`;

const ModalHeader = styled.div`
  background: #f5f5f5;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  p {
    margin: 0;
    font-size: 1rem;
    font-weight: bold;
  }
`;

const PermissionTag = styled.div`
  background: #f3f4f6;
  padding: 10px 14px;
  width: 100%;
  border-radius: 9px;
  border: 1px solid #e2e3e5;
  text-align: right;
  font-size: 0.88rem;
  transition: 0.2s;

  &:hover {
    background: #eaecef;
  }
`;

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  maxHeight: "80vh", // important!
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 8,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

export default function DefineUser({ toggleShow }) {
  const dispatch = useDispatch();

  // list of users (fetched based on domain)
  const [users, setUsers] = useState([]);
  // for re-fetch when user add/edit
  const [dataUpdated, setDataUpdated] = useState(false);

  // filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(null);

  // loading
  const [trackLoading, setTrackLoading] = useState(false);

  // modals
  const [openModal2, setOpenModal2] = useState(false);
  const closeModal2 = () => setOpenModal2(false);

  const [openModal3, setOpenModal3] = useState(false);
  const closeModal3 = () => setOpenModal3(false);

  const [modalPermision, setModalPermision] = useState(null);
  const handleCloseModal = () => setModalPermision(null);

  const [modalPermisionRe, setModalPermisionRe] = useState(null);
  const handleCloseModalRe = () => setModalPermisionRe(null);

  // helper for trim & lowerCase
  const normalizeString = (str) => str.replace(/\s+/g, "").toLowerCase();

  // fetch data whenever domain or dataUpdated changes
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setTrackLoading(true);
        const dataResponse = await dispatch(getuser({ domain: 2 })).unwrap();
        setUsers(dataResponse);
        setDataUpdated(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setOpenModal3(true);
      } finally {
        setTrackLoading(false);
      }
    };
    fetchUsers();
  }, [dispatch, dataUpdated]);

  function closeModalOnTimeout() {
    setTimeout(() => {
      setOpenModal2(false);
    }, 3000);
  }

  // handle search filter
  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(users);
      return;
    }
    const normalizedSearchTerm = normalizeString(searchTerm);
    const filtered = users.filter((user) => {
      const fullName = `${user.firstName || ""} ${user.lastName || ""} ${
        user.username || ""
      }`;
      return normalizeString(fullName).includes(normalizedSearchTerm);
    });
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  return (
    <section>
      <HeadermakeOrder className="d-flex flex-row mb-3 justify-content-between">
        <div className="d-block d-lg-none">
          <NavBarToggleBurgerButton func={() => toggleShow("main")} />
        </div>
        <div className="NormalTextSizing text-decoration-underline textHeaderStyle d-flex align-items-center">
          مدیریت کاربر
        </div>
        <ProfileComponent />
      </HeadermakeOrder>

      {/* toolbar: search + add */}
      <div className="d-flex flex-row flex-wrap gap-3 align-items-center justify-content-between mb-4">
        <SearchInputMainDiv>
          <input
            className="inputSreachStyle"
            type="text"
            placeholder="جستجو..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon className="SearchIconStyle" />
        </SearchInputMainDiv>
        <AddUserBtn
          setDataUpdated={setDataUpdated}
          setConfirmModal={() => setOpenModal2(true)}
          closeModalOnTimeout={() => closeModalOnTimeout()}
          setErrorModal={() => setOpenModal3(true)}
        />
      </div>

      {/* loading spinner */}
      {trackLoading ? (
        <div className="container d-flex justify-content-center align-items-center">
          <Skeleton
            animation="wave"
            variant="rounded"
            className="w-100"
            height={250}
          />
        </div>
      ) : (
        <>
          {filteredUsers && filteredUsers.length > 0 && !trackLoading && (
            <>
              {/* desktop table */}
              <FixTablePlace className="d-none d-lg-block container">
                <p className="me-2 NormalTextSizing mb-2 pTagForStyle">
                  کاربر های ادمین
                </p>
                <table className="table table-striped tabelStyle">
                  <thead>
                    <tr>
                      <th>ردیف</th>
                      <th>نام</th>
                      <th>نام خانوادگی</th>
                      <th>شماره همراه</th>
                      <th>وضعیت</th>
                      <th>نوع دسترسی</th>
                      <th>دسترسی</th>
                      <th>عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((item, index) => (
                      <tr key={index}>
                        <td>{++index}</td>
                        <td>{item.firstName}</td>
                        <td>{item.lastName}</td>
                        <td>{item.username}</td>
                        <td>{item.active ? "فعال" : "غیرفعال"}</td>
                        <td>{item.domain === 1 ? "سایت" : "سایت و ادمین"}</td>
                        <td>
                          <p
                            className="SeeAccessButtom"
                            onClick={() => setModalPermision(index)}
                          >
                            مشاهده
                          </p>

                          <ModalHimselfStyle
                            open={modalPermision === index}
                            onClose={handleCloseModal}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                          >
                            <ModalContainer sx={modalStyle}>
                              <ModalHeader>
                                <p className="NormalTextSizing HeaderModalShowAccess">
                                  دسترسی ها
                                </p>
                                <CustomCloseButton
                                  onClick={handleCloseModal}
                                  color={`var(--c-danger)`}
                                />
                              </ModalHeader>
                              <div
                                style={{
                                  flex: 1,
                                  overflowY: "auto",
                                }}
                                className="d-flex flex-column gap-2 justify-content-center align-items-center p-3"
                              >
                                <div className="d-flex flex-column gap-2 justify-content-center align-items-center w-100">
                                  {item.userRoles?.map((item, index) => (
                                    <PermissionTag
                                      key={index}
                                      className="NormalTextSizing"
                                    >
                                      {item.role.name}
                                    </PermissionTag>
                                  ))}
                                </div>
                              </div>
                            </ModalContainer>
                          </ModalHimselfStyle>
                        </td>
                        <td>
                          <div className="d-flex flex-row justify-content-center">
                            <EditUserBtnfunction
                              closeModalOnTimeout={() => closeModalOnTimeout()}
                              setDataUpdated={setDataUpdated}
                              data={item}
                              setConfirmModal={() => setOpenModal2(true)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </FixTablePlace>

              {/* mobile view */}
              <div className="d-block d-lg-none container">
                {filteredUsers.map((item, idx) => (
                  <MAINTABELSTYLE key={idx}>
                    <div className="eachTabelStyle">
                      <p className="NormalTextSizing">نام :</p>
                      <div className="SecondValueTabel NormalTextSizing">
                        {item.firstName}
                      </div>
                    </div>
                    <div className="eachTabelStyle">
                      <p className="NormalTextSizing">نام خانوادگی :</p>
                      <div className="SecondValueTabel NormalTextSizing">
                        {item.lastName}
                      </div>
                    </div>
                    <div className="eachTabelStyle">
                      <p className="NormalTextSizing">شماره همراه :</p>
                      <div className="SecondValueTabel NormalTextSizing">
                        {item.username}
                      </div>
                    </div>
                    <div className="eachTabelStyle">
                      <p className="NormalTextSizing">وضعیت :</p>
                      <div className="SecondValueTabel NormalTextSizing">
                        {item.active ? "فعال" : "غیرفعال"}
                      </div>
                    </div>
                    <div className="eachTabelStyle">
                      <p className="NormalTextSizing">نوع دسترسی :</p>
                      <div className="SecondValueTabel NormalTextSizing">
                        {item.domain === 1 ? "سایت" : "سایت و ادمین"}
                      </div>
                    </div>

                    <div className="eachTabelStyle">
                      <p className="NormalTextSizing">دسترسی :</p>

                      <div className="SecondValueTabel NormalTextSizing">
                        <div
                          style={{ cursor: "pointer", color: "var(--c-primary)" }}
                          onClick={() => setModalPermisionRe(idx)}
                        >
                          مشاهده
                        </div>
                        <Modal
                          open={modalPermisionRe === idx}
                          onClose={handleCloseModalRe}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <Box sx={modalStyle}>
                            <HeaderModalShowAccessMainDiv className="d-flex flex-row justify-content-between align-items-center">
                              <p className="NormalTextSizing HeaderModalShowAccess">
                                دسترسی ها
                              </p>
                              <CustomCloseButton
                                onClick={handleCloseModalRe}
                                color={`var(--c-danger)`}
                              />
                            </HeaderModalShowAccessMainDiv>
                            <div className="d-flex flex-column gap-2 justify-content-center align-items-center p-3">
                              <div className="d-flex flex-row gap-2 justify-content-center">
                                {item.userRoles?.map((item, index) => (
                                  <div key={index}>{item.role.name}</div>
                                ))}
                              </div>
                            </div>
                          </Box>
                        </Modal>
                      </div>
                    </div>

                    <div className="eachTabelStyle">
                      <p className="NormalTextSizing">عملیات :</p>
                      <div className="SecondValueTabel NormalTextSizing">
                        <EditUserBtnfunction
                          closeModalOnTimeout={() => closeModalOnTimeout()}
                          setDataUpdated={setDataUpdated}
                          data={item}
                          setConfirmModal={() => setOpenModal2(true)}
                        />
                      </div>
                    </div>
                  </MAINTABELSTYLE>
                ))}
              </div>
            </>
          )}

          {/* no user found */}
          {!trackLoading && filteredUsers && filteredUsers.length === 0 && (
            <div className="container mt-4">
              <EmptyState
                illustrationUrl="/illustrations/empty-users.svg"
                title="هیچ کاربر مدیریتی یافت نشد"
                description="کاربران مدیر و ادمین خود را با استفاده از دکمه بالا اضافه کنید."
                variant="table"
                illustrationHeight="200px"
              />
            </div>
          )}
        </>
      )}

      {/* modals */}
      <ConfirmingModal
        open={openModal2}
        onClose={closeModal2}
        text={"عملیات با موفقیت انجام شد"}
      />
      <ErrorModal
        open={openModal3}
        onClose={closeModal3}
        text={"خطا در انجام عملیات، لطفاً دوباره تلاش کنید"}
      />
    </section>
  );
}
