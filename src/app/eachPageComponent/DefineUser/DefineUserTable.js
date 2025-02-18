"use client";

import React, { useEffect, useState } from "react";
// import redux
import { useDispatch } from "react-redux";
import { getuser } from "@/app/Store/thunks";
// import base component
import NavBarToggleBurgerButton from "@/app/BaseComponent/NavBarToggleBurgerButton";
import CustomCloseButton from "@/app/BaseComponent/CustomCloseButton";
import ConfirmingModal from "@/app/BaseComponent/ConfirmingModal";
import ErrorModal from "@/app/BaseComponent/ErrorModal";
import ProfileComponent from "@/app/BaseComponent/ProfileComponent";
import { Skeleton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import styled from "styled-components";
// import components
import AddUserBtn from "../DefineUser/AddUserBtn";
import EditUserBtnfunction from "./EditUserBtn";
import { Modal, Box } from "@mui/material";


const HeadermakeOrder = styled.div`
  padding: 10px;
  color: white;
  background-color: rgb(225, 223, 223);
  border-radius: 4px;
  margin: 7px 15px;
  .textHeaderStyle {
    color: black;
  }

  @media (max-width: 980px) {
    .textHeaderStyle {
    }
  }
`;

const ResponsiveDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchInputMainDiv = styled.div`
  width: 50%;
  position: relative;
  .inputSreachStyle {
    font-size: 15px;
    width: 100%;
    padding: 4px;
  }
  .SearchIconStyle {
    position: absolute;
    transform: translate(50%, -50%);
    left: 0;
    top: 50%;
    pointer-events: none;
    color: gray;
  }
`;

const MAINTABELSTYLE = styled.div`
  border: 1.5px solid gray;
  padding: 7px;
  border-radius: 4px;
  margin-bottom: 10px;

  .eachTabelStyle {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 10px;
    border-bottom: 1px solid #ccc;
    text-align: center;
    p {
      background-color: #f1f1f1;
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
    margin-top: 60px;
    .pTagForStyle {
      position: absolute;
      transform: translate(-50%, 50%);
      left: 50%;
      width: 94%;
      top: -55px;
      border-radius: 10px;
      padding: 18px 12px;
      background-image: linear-gradient(195deg, #42424a 0%, #191919 100%);
      color: white;
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
        padding-top: 55px;
      }
    }
  }

  .SeeAccessButtom {
    cursor: pointer;
    color: #43a047;
  }
`;

const HeaderModalShowAccessMainDiv = styled.div`
  background-color: rgb(225, 223, 223);
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  .HeaderModalShowAccess {
    padding: 10px;
  }
`;

const SelectFilter = styled.select`
  padding: 6px 10px;
  font-size: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
`;

const SeeAccessTableStyle = styled.p`
  /* border-top: 1px solid gray; */
  width: 100%;
  /* text-align: center; */
  padding-top: 3px;
`;

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
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
  console.log(filteredUsers);

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
        <ProfileComponent colorGet={"#191919"} />
      </HeadermakeOrder>

      {/* Filter Container */}
      <div className="container mt-4 mb-4 d-flex flex-row gap-3 align-items-center">
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

        {/* domain filter */}
        {/* <SelectFilter
          value={selectedDomain}
          onChange={(e) => setSelectedDomain(e.target.value)}
        >
          <option value="2">کاربرهای ادمین</option>
          <option value="1">کاربرهای سایت</option>
        </SelectFilter> */}
      </div>
      {/* add user */}
      <div className="d-flex justify-content-end  mb-3 container">
        <AddUserBtn
          setDataUpdated={setDataUpdated}
          setConfirmModal={() => setOpenModal2(true)}
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

                          <Modal
                            open={modalPermision === index}
                            onClose={handleCloseModal}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                          >
                            <Box sx={modalStyle}>
                              <HeaderModalShowAccessMainDiv className="d-flex flex-row justify-content-between align-items-center">
                                <p className="NormalTextSizing HeaderModalShowAccess">
                                  دسترسی ها
                                </p>
                                <CustomCloseButton
                                  onClick={handleCloseModal}
                                  color={`#e91e63`}
                                />
                              </HeaderModalShowAccessMainDiv>
                              <div className="d-flex flex-column gap-2 justify-content-center align-items-center p-3">
                                {/* {item?.permissions?.map((eachPer, index) => (
                                  <p key={index} className="NormalTextSizing">
                                    {eachPer?.permission?.name}
                                  </p>
                                ))} */}
                                <div className="d-flex flex-column gap-2 justify-content-center align-items-center w-100">
                                  {item.userRoles?.map((item, index) => (
                                    <SeeAccessTableStyle
                                      key={index}
                                      className="NormalTextSizing"
                                    >
                                      {item.role.name}
                                    </SeeAccessTableStyle>
                                  ))}
                                </div>
                              </div>
                            </Box>
                          </Modal>
                        </td>
                        <td>
                          <div className="d-flex flex-row justify-content-center">
                            <EditUserBtnfunction
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
                          style={{ cursor: "pointer", color: "#43a047" }}
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
                                onClick={handleCloseModal}
                                color={`#e91e63`}
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
              <p className="NormalTextSizing text-center">
                هیچ کاربری یافت نشد.
              </p>
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
        text={"خطا در انجام عملیات"}
      />
    </section>
  );
}
