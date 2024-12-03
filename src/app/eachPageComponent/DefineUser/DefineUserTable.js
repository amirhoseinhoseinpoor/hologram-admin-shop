"use client";
import content from "/public/json/tabelContent.json";
import React, { useEffect, useState } from "react";
// import redux
import { useDispatch, useSelector } from "react-redux";
import { getuser } from "@/app/Store/thunks";

// import base component
import NavBarToggleBurgerButton from "@/app/BaseComponent/NavBarToggleBurgerButton";
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

      {/* <div className="d-flex flex-row mb-3 justify-content-between">
        <div>مدیریت کاربر</div>
        <div>
          <DefineUserBtn />
        </div>
      </div> */}
      <table className="table table-striped">
        <thead>
          <tr className="table-head text-center">
            <th>ردیف</th>
            <th>نام</th>
            <th>نام خانوادگی</th>
            <th>شماره همراه</th>
            <th>وضعیت</th>
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
                  <EditUserBtnfunction setDataUpdated={setDataUpdated} data={dataCome[--index]}/>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </section>
  );
}
