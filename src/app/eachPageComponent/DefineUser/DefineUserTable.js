"use client";
import React, { useEffect, useState } from "react";
// import redux
import { useDispatch } from "react-redux";
import { getuser } from "@/app/Store/thunks";
// import base component
import NavBarToggleBurgerButton from "@/app/BaseComponent/NavBarToggleBurgerButton";
import ConfirmingModal from "@/app/BaseComponent/ConfirmingModal";
// import components
import DefineUserBtn from "../DefineUser/AddUserBtn";
import EditUserBtnfunction from "./EditUserBtn";
import styled from "styled-components";

const HeadermakeOrder = styled.div`
  background-color: white;
  padding: 10px;
  color: white;
  .textHeaderStyle {
    color: black;
  }

  @media (max-width: 980px) {
    background-color: rgb(26, 32, 53) !important;
    .textHeaderStyle {
      color: white !important;
    }
  }
`;

export default function DefineUser({ toggleShow }) {
  const dispatch = useDispatch();

  const [dataCome, setDataCome] = useState([]);
  const [dataUpdated, setDataUpdated] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  const [openModal2, setOpenModal2] = useState(false);
  const closeModal2 = () => setOpenModal2(false);

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
    const fetchData = async () => {
      const dataComeAPI = await dispatch(getuser()).unwrap();
      setDataCome(dataComeAPI);
      setDataUpdated(false);
    };
    fetchData();
  }, [dispatch, dataUpdated]);

  return (
    <section>
      <HeadermakeOrder className="d-flex flex-row mb-3 justify-content-between">
        <div className="d-block d-lg-none">
          <NavBarToggleBurgerButton func={() => toggleShow("main")} />
        </div>
        <div className="NormalTextSizing textHeaderStyle d-flex align-items-center">
          مدیریت کاربر
        </div>
        <DefineUserBtn />
      </HeadermakeOrder>

      <table className="table table-striped">
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
          {dataCome.map((item, index) => (
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
                  {item.domain == 1 && <p className="NormalTextSizing">سایت</p>}
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
      {/* modals */}
      <ConfirmingModal
        open={openModal2}
        onClose={closeModal2}
        text={"کاربر با موفقیت حذف شد"}
      />
    </section>
  );
}
