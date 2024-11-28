import content from "/public/json/tabelContent.json";
import React from "react";
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
          <tr className="table-head">
            <th>ردیف</th>
            <th>نام</th>
            <th>نام خانوادگی</th>
            <th>سن</th>
            <th>کد ملی</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {content.map((item, index) => (
            <React.Fragment key={index}>
              <tr>
                <td>{++index}</td>
                <td>{item.firstName}</td>
                <td>{item.lastName}</td>
                <td>{item.age}</td>
                <td>{item.cardId}</td>
                <td>
                  <EditUserBtnfunction />
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </section>
  );
}
