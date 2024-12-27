import React from "react";
import ActiveUsersCard from "./Cards/ActiveUsersCard";
import ProductCountCard from "./Cards/ProductCountCard";
import AllOrderCard from "./Cards/AllOrderCard";
import ActiveOrdersCard from "./Cards/ActiveOrdersCard";
import { Box } from "@mui/material";
// import base component
import ProfileComponent from "@/app/BaseComponent/ProfileComponent";
import MonthlyVisitsChart from "./MonthlyVisitsChart";
import NavBarToggleBurgerButton from "@/app/BaseComponent/NavBarToggleBurgerButton";
import styled from "styled-components";

const HeadermakeOrder = styled.div`
  padding: 10px;
  color: white;
  background-color:rgb(225, 223, 223);
  border-radius: 4px;
  margin : 7px 15px;
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

const CardResponssive = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 15px;
  width: fit-content;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export default function DoshbordMainComponent({ toggleShow }) {
  return (
    <>
      <HeadermakeOrder className="d-flex flex-row mb-3 justify-content-between">
        <div className="d-block d-lg-none">
          <NavBarToggleBurgerButton func={() => toggleShow("main")} />
        </div>
        <div className="NormalTextSizing text-decoration-underline textHeaderStyle d-flex align-items-center">
          داشبورد
        </div>
        <ProfileComponent colorGet={"#191919"} />
      </HeadermakeOrder>
      <Box sx={{ p: 2 }}>
        <CardResponssive className="mb-3">
          <ActiveUsersCard />
          <ProductCountCard />
          <AllOrderCard />
          <ActiveOrdersCard />
        </CardResponssive>

        <MonthlyVisitsChart />
      </Box>
    </>
  );
}
