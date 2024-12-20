"use client";
import React, { useEffect, useState } from "react";
// import redux
import { useDispatch } from "react-redux";
import { getuser } from "@/app/Store/thunks";
// import base component
import NavBarToggleBurgerButton from "@/app/BaseComponent/NavBarToggleBurgerButton";
import ConfirmingModal from "@/app/BaseComponent/ConfirmingModal";
import ErrorModal from "@/app/BaseComponent/ErrorModal";
import ProfileComponent from "@/app/BaseComponent/ProfileComponent";
import LoadingCss from "@/app/BaseComponent/LoadingCss";
// import components
import AddUserBtn from "../DefineUser/AddUserBtn";
import EditUserBtnfunction from "./EditUserBtn";
import SearchIcon from "@mui/icons-material/Search";
import styled from "styled-components";

const HeadermakeOrder = styled.div`
  /* background-color: white; */
  padding: 10px;
  color: white;
  .textHeaderStyle {
    color: black;
  }

  @media (max-width: 980px) {
    /* background-color: rgb(26, 32, 53) !important; */
    .textHeaderStyle {
      /* color: white !important; */
    }
  }
`;

const SearchInputMainDiv = styled.div`
  /* margin-bottom: 10px; */
  width: 50%;
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

    .MuiInputBase-inputSizeSmall {
      padding: 4px !important;
    }
  }
`;

const SeeOrderButton = styled.button`
  background-color: ${(props) => props.color || "#1572e8"};
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
      @media (min-width: 980px) {
        border-collapse: separate;
        border-radius: 12px;
        overflow: hidden;
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
  }
`;

export default function DefineUser({ toggleShow }) {
  const dispatch = useDispatch();

  const [dataCome, setDataCome] = useState([]);
  const [dataComeUser, setDataComeUser] = useState([]);
  const [dataUpdated, setDataUpdated] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(null);
  const [filteredSiteUser, setFilteredSiteUser] = useState(null);
  const [trackLoadingProduct, setTrackLoadingProduct] = useState(false);

  const [openModal2, setOpenModal2] = useState(false);
  const closeModal2 = () => setOpenModal2(false);

  const [openModal3, setOpenModal3] = useState(false);
  const closeModal3 = () => setOpenModal3(false);

  function closeModalOnTimeout() {
    setTimeout(() => {
      setOpenModal2(false);
    }, 2000);
  }

  useEffect(() => {
    if (confirmModal == true) {
      setOpenModal2(true);
      closeModalOnTimeout();
    }
  }, [confirmModal]);

  useEffect(() => {
    if (errorModal == true) {
      setOpenModal2(true);
      closeModalOnTimeout();
    }
  }, [errorModal]);

  const normalizeString = (str) => str.replace(/\s+/g, "").toLowerCase();

  useEffect(() => {
    const fetchData = async () => {
      const dataComeAPI = await dispatch(getuser({ domain: 2 })).unwrap();
      setDataCome(dataComeAPI);
      setDataUpdated(false);
    };
    fetchData();
  }, [dispatch, dataUpdated]);

  const handleSiteUser = async () => {
    if (dataComeUser?.length > 0) {
      setDataComeUser([]);
    } else {
      try {
        setTrackLoadingProduct(true);
        const dataComeApi = await dispatch(getuser({ domain: 1 })).unwrap();
        setDataComeUser(dataComeApi);
        setDataUpdated(false);

        setTrackLoadingProduct(false);
      } catch (error) {
        console.error("Error during dispatch:", error);
        setTrackLoadingProduct(false);
      }
    }
  };

  useEffect(() => {
    if (!dataCome) return;

    if (!searchTerm) {
      setFilteredUsers(dataCome);
      setFilteredSiteUser(dataComeUser);
      return;
    }

    // Filter Users based on user's firstName and lastName and phone
    const filtered = dataCome.filter((user) => {
      if (!user) return false;

      const fullName = `${user.firstName || ""} ${user.lastName || ""} ${
        user.username || ""
      }`;
      const normalizedFullName = normalizeString(fullName);
      const normalizedSearchTerm = normalizeString(searchTerm);

      return normalizedFullName.includes(normalizedSearchTerm);
    });

    const filteredSiteUser = dataComeUser.filter((user) => {
      if (!user) return false;

      const fullName = `${user.firstName || ""} ${user.lastName || ""} ${
        user.username || ""
      }`;
      const normalizedFullName = normalizeString(fullName);
      const normalizedSearchTerm = normalizeString(searchTerm);

      return normalizedFullName.includes(normalizedSearchTerm);
    });

    setFilteredUsers(filtered);
    setFilteredSiteUser(filteredSiteUser);
  }, [searchTerm, dataCome, dataComeUser]);

  return (
    <section>
      <HeadermakeOrder className="d-flex flex-row mb-3 justify-content-between">
        <div className="d-block d-lg-none">
          <NavBarToggleBurgerButton func={() => toggleShow("main")} />
        </div>
        <div className="NormalTextSizing textHeaderStyle d-flex align-items-center">
          مدیریت کاربر
        </div>
        <ProfileComponent colorGet={"#191919"} />
      </HeadermakeOrder>
      {/* Add a search input field */}
      <div className="d-flex flex-row align-items-center mt-4 gap-3 mb-4">
        <SearchInputMainDiv className="me-2  position-relative">
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
          setConfirmModal={setConfirmModal}
          setErrorModal={setErrorModal}
        />
      </div>

      {dataCome.length > 0 && (
        <>
          <FixTablePlace className="d-none d-lg-block container">
            <p className="me-2 NormalTextSizing mb-2 pTagForStyle">
              کاربر های ادمین
            </p>
            <table className="table table-striped tabelStyle">
              <thead>
                <tr className="table-head text-center">
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
              <tbody className="table-body text-center">
                {filteredUsers?.map((item, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td>{++index}</td>
                      <td>{item.firstName}</td>
                      <td>{item.lastName}</td>
                      <td>{item.username}</td>
                      <td>
                        {item.active == true ? (
                          <p className="NormalTextSizing">فعال</p>
                        ) : (
                          <p className="NormalTextSizing">غیرفعال</p>
                        )}
                      </td>

                      <td>
                        {item.domain == 1 && (
                          <p className="NormalTextSizing">سایت</p>
                        )}
                        {item.domain == 2 && (
                          <p className="NormalTextSizing">سایت و ادمین</p>
                        )}
                      </td>
                      <td>
                        {item.userRoles[0]?.role?.name == "admin" && (
                          <p className="NormalTextSizing">ادمین</p>
                        )}
                        {item.userRoles[0]?.role?.name == "master" && (
                          <p className="NormalTextSizing">مدیر</p>
                        )}
                        {item.userRoles[0]?.role?.name == "customer" && (
                          <p className="NormalTextSizing">مشتری</p>
                        )}
                      </td>
                      <td>
                        <div className="d-flex flex-row justify-content-center">
                          <EditUserBtnfunction
                            setDataUpdated={setDataUpdated}
                            data={dataCome[--index]}
                            setConfirmModal={setConfirmModal}
                          />
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </FixTablePlace>

          <div className="d-block d-lg-none container">
            {filteredUsers?.map((item, index) => (
              <React.Fragment key={index}>
                <MAINTABELSTYLE>
                  <div className="eachTabelStyle">
                    <p className="NormalTextSizing">نام :</p>

                    <div className="SecondValueTabel NormalTextSizing">
                      {item.firstName}
                    </div>
                  </div>

                  <div className="eachTabelStyle">
                    <p className="NormalTextSizing">نام خانوادگی :</p>
                    <div
                      className="SecondValueTabel NormalTextSizing"
                      style={{ verticalAlign: "middle" }}
                    >
                      {item.lastName}
                    </div>
                  </div>
                  <div className="eachTabelStyle">
                    <p className="NormalTextSizing">شماره همراه :</p>

                    <div
                      className="SecondValueTabel NormalTextSizing"
                      style={{ verticalAlign: "middle" }}
                    >
                      {item.username}
                    </div>
                  </div>

                  <div className="eachTabelStyle">
                    <p className="NormalTextSizing">وضعیت :</p>
                    {item.active == true ? (
                      <p
                        style={{ backgroundColor: "unset" }}
                        className="NormalTextSizing"
                      >
                        فعال
                      </p>
                    ) : (
                      <p
                        style={{ backgroundColor: "unset" }}
                        className="NormalTextSizing"
                      >
                        غیرفعال
                      </p>
                    )}
                  </div>

                  <div className="eachTabelStyle">
                    <p className="NormalTextSizing">نوع دسترسی :</p>
                    {item.domain == 1 && (
                      <p
                        style={{ backgroundColor: "unset" }}
                        className="NormalTextSizing"
                      >
                        سایت
                      </p>
                    )}
                    {item.domain == 2 && (
                      <p
                        style={{ backgroundColor: "unset" }}
                        className="NormalTextSizing"
                      >
                        سایت و ادمین
                      </p>
                    )}
                  </div>

                  <div className="eachTabelStyle">
                    <p className="NormalTextSizing">دسترسی :</p>
                    {item.userRoles[0]?.role?.name == "admin" && (
                      <p
                        style={{ backgroundColor: "unset" }}
                        className="NormalTextSizing"
                      >
                        ادمین
                      </p>
                    )}
                    {item.userRoles[0]?.role?.name == "master" && (
                      <p
                        style={{ backgroundColor: "unset" }}
                        className="NormalTextSizing"
                      >
                        مدیر
                      </p>
                    )}
                    {item.userRoles[0]?.role?.name == "customer" && (
                      <p
                        style={{ backgroundColor: "unset" }}
                        className="NormalTextSizing"
                      >
                        مشتری
                      </p>
                    )}
                  </div>

                  <div className="eachTabelStyle">
                    <p className="NormalTextSizing">عملیات :</p>
                    <div className="d-flex flex-row justify-content-center">
                      <EditUserBtnfunction
                        setDataUpdated={setDataUpdated}
                        data={dataCome[--index]}
                        setConfirmModal={setConfirmModal}
                      />
                    </div>
                  </div>
                </MAINTABELSTYLE>
              </React.Fragment>
            ))}
          </div>
        </>
      )}

      <div className="container mt-4 mb-4">
        <SeeOrderButton
          color="#6861ce"
          onClick={handleSiteUser}
          type="button"
          style={{
            width: "170px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {trackLoadingProduct ? (
            <LoadingCss />
          ) : dataComeUser?.length ? (
            `پنهان کردن کاربر های سایت`
          ) : (
            `دیدن کاربر های سایت`
          )}
        </SeeOrderButton>
      </div>

      {dataComeUser.length > 0 && (
        <>
          <FixTablePlace className="d-none d-lg-block container">
            <p className="me-2 NormalTextSizing mb-2 pTagForStyle">
              کاربر های سایت
            </p>
            <table className="table table-striped tabelStyle">
              <thead>
                <tr className="table-head text-center">
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
              <tbody className="table-body text-center">
                {filteredSiteUser?.map((item, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td>{++index}</td>
                      <td>{item.firstName}</td>
                      <td>{item.lastName}</td>
                      <td>{item.username}</td>
                      <td>
                        {item.active == true ? (
                          <p className="NormalTextSizing">فعال</p>
                        ) : (
                          <p className="NormalTextSizing">غیرفعال</p>
                        )}
                      </td>

                      <td>
                        {item.domain == 1 && (
                          <p className="NormalTextSizing">سایت</p>
                        )}
                        {item.domain == 2 && (
                          <p className="NormalTextSizing">سایت و ادمین</p>
                        )}
                      </td>
                      <td>
                        {item.userRoles[0]?.role?.name == "admin" && (
                          <p className="NormalTextSizing">ادمین</p>
                        )}
                        {item.userRoles[0]?.role?.name == "master" && (
                          <p className="NormalTextSizing">مدیر</p>
                        )}
                        {item.userRoles[0]?.role?.name == "customer" && (
                          <p className="NormalTextSizing">مشتری</p>
                        )}
                      </td>
                      <td>
                        <div className="d-flex flex-row justify-content-center">
                          <EditUserBtnfunction
                            setDataUpdated={setDataUpdated}
                            data={dataCome[--index]}
                            setConfirmModal={setConfirmModal}
                          />
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </FixTablePlace>

          <div className="d-block d-lg-none container">
            {filteredSiteUser?.map((item, index) => (
              <React.Fragment key={index}>
                <MAINTABELSTYLE>
                  <div className="eachTabelStyle">
                    <p className="NormalTextSizing">نام :</p>

                    <div className="SecondValueTabel NormalTextSizing">
                      {item.firstName}
                    </div>
                  </div>

                  <div className="eachTabelStyle">
                    <p className="NormalTextSizing">نام خانوادگی :</p>
                    <div
                      className="SecondValueTabel NormalTextSizing"
                      style={{ verticalAlign: "middle" }}
                    >
                      {item.lastName}
                    </div>
                  </div>
                  <div className="eachTabelStyle">
                    <p className="NormalTextSizing">شماره همراه :</p>

                    <div
                      className="SecondValueTabel NormalTextSizing"
                      style={{ verticalAlign: "middle" }}
                    >
                      {item.username}
                    </div>
                  </div>

                  <div className="eachTabelStyle">
                    <p className="NormalTextSizing">وضعیت :</p>
                    {item.active == true ? (
                      <p
                        style={{ backgroundColor: "unset" }}
                        className="NormalTextSizing"
                      >
                        فعال
                      </p>
                    ) : (
                      <p
                        style={{ backgroundColor: "unset" }}
                        className="NormalTextSizing"
                      >
                        غیرفعال
                      </p>
                    )}
                  </div>

                  <div className="eachTabelStyle">
                    <p className="NormalTextSizing">نوع دسترسی :</p>
                    {item.domain == 1 && (
                      <p
                        style={{ backgroundColor: "unset" }}
                        className="NormalTextSizing"
                      >
                        سایت
                      </p>
                    )}
                    {item.domain == 2 && (
                      <p
                        style={{ backgroundColor: "unset" }}
                        className="NormalTextSizing"
                      >
                        سایت و ادمین
                      </p>
                    )}
                  </div>

                  <div className="eachTabelStyle">
                    <p className="NormalTextSizing">دسترسی :</p>
                    {item.userRoles[0]?.role?.name == "admin" && (
                      <p
                        style={{ backgroundColor: "unset" }}
                        className="NormalTextSizing"
                      >
                        ادمین
                      </p>
                    )}
                    {item.userRoles[0]?.role?.name == "master" && (
                      <p
                        style={{ backgroundColor: "unset" }}
                        className="NormalTextSizing"
                      >
                        مدیر
                      </p>
                    )}
                    {item.userRoles[0]?.role?.name == "customer" && (
                      <p
                        style={{ backgroundColor: "unset" }}
                        className="NormalTextSizing"
                      >
                        مشتری
                      </p>
                    )}
                  </div>

                  <div className="eachTabelStyle">
                    <p className="NormalTextSizing">عملیات :</p>
                    <div className="d-flex flex-row justify-content-center">
                      <EditUserBtnfunction
                        setDataUpdated={setDataUpdated}
                        data={dataCome[--index]}
                        setConfirmModal={setConfirmModal}
                      />
                    </div>
                  </div>
                </MAINTABELSTYLE>
              </React.Fragment>
            ))}
          </div>
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
