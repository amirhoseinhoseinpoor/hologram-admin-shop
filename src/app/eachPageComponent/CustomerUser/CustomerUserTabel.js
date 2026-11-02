"use client";

import { SearchInputMainDiv } from "@/app/BaseComponent/SearchField";
import { HeadermakeOrder } from "@/app/BaseComponent/PageHeader";
import { useEffect, useState } from "react";
// import redux
import { useDispatch } from "react-redux";
import { getuser } from "@/app/Store/thunks";
// import base component
import NavBarToggleBurgerButton from "@/app/BaseComponent/NavBarToggleBurgerButton";
import ConfirmingModal from "@/app/BaseComponent/ConfirmingModal";
import ErrorModal from "@/app/BaseComponent/ErrorModal";
import ProfileComponent from "@/app/BaseComponent/ProfileComponent";
import EmptyState from "@/app/BaseComponent/EmptyState";
import { Skeleton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import styled from "styled-components";
// import components
import EditUserBtnfunction from "./EditUserBtn";
import AddUserBtn from "./AddUserBtn";

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
`;

export default function CustomerUserTabel({ toggleShow }) {
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

  function closeModalOnTimeout() {
    setTimeout(() => {
      setOpenModal2(false);
    }, 3000);
  }

  // helper for trim & lowerCase
  const normalizeString = (str) => str.replace(/\s+/g, "").toLowerCase();

  // fetch data whenever domain or dataUpdated changes
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setTrackLoading(true);
        const dataResponse = await dispatch(getuser({ domain: 1 })).unwrap();
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
          closeModalOnTimeout={() => closeModalOnTimeout()}
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
                  کاربر های سایت
                </p>
                <table className="table table-striped tabelStyle">
                  <thead>
                    <tr>
                      <th>ردیف</th>
                      <th>نام</th>
                      <th>نام خانوادگی</th>
                      <th>شماره همراه</th>
                      <th>وضعیت</th>
                      <th>عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.firstName}</td>
                        <td>{item.lastName}</td>
                        <td>{item.username}</td>
                        <td>{item.active ? "فعال" : "غیرفعال"}</td>
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
                        {item.userRoles[0]?.role?.name === "admin" && "ادمین"}
                        {item.userRoles[0]?.role?.name === "master" && "مدیر"}
                        {item.userRoles[0]?.role?.name === "customer" &&
                          "مشتری"}
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
                title="هیچ کاربری یافت نشد"
                description="کاربران مشتری شما اینجا نمایش داده می‌شوند."
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
