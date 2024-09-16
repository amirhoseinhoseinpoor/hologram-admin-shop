import content from "/public/json/tabelContent.json";
import React from "react";

// import components

import DefineUserBtn from "../DefineUser/AddUserBtn";
import EditUserBtnfunction from "./EditUserBtn";
export default function DefineUser() {
  return (
    <section>
      <div className="d-flex flex-row mb-3 justify-content-between">
        <div>مدیریت کاربر</div>
        <div>
          <DefineUserBtn />
        </div>
      </div>
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
