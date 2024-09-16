import content from "/public/json/orderMain.json";
import { useState } from "react";
import React from "react";
import MakeOrder from "./MakeOrderComponents/MakeOrder";

export default function OrderMainComponent() {
  const [activekey, setActiveKey] = useState("seeTable");
  const [seeOrder, setSeeOrder] = useState(null);

  return (
    <section>
      {activekey === "seeTable" && (
        <>
          <div className="d-flex flex-row mb-3 justify-content-between">
            <div>مدیریت سفارشات</div>
          </div>
          <table className="table table-striped">
            <thead className="text-center">
              <tr className="table-head">
                <th>ردیف</th>
                <th>نام</th>
                <th>نام خانوادگی</th>
                <th>شماره همراه</th>
                <th>تاریخ</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody className="table-body text-center">
              {content.map((item, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td>{++index}</td>
                    <td>{item.firstName}</td>
                    <td>{item.lastName}</td>
                    <td>{item.username}</td>
                    <td>{item.date}</td>
                    <td>
                      <button
                        onClick={() => {
                          setActiveKey("seeOrder");
                          setSeeOrder(item);
                        }}
                      >
                        مشاهده سفارش
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </>
      )}
      {activekey === "seeOrder" && <MakeOrder seeOrder={seeOrder}  />}
    </section>
  );
}
