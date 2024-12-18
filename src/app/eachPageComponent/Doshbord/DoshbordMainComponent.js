import React from "react";
import ActiveUsersCard from "./Cards/ActiveUsersCard";
import ProductCountCard from "./Cards/ProductCountCard";
import AllOrderCard from "./Cards/AllOrderCard";
import ActiveOrdersCard from "./Cards/ActiveOrdersCard";
import { Box } from "@mui/material";
// import base component
import MonthlyVisitsChart from "./MonthlyVisitsChart";
import NavBarToggleBurgerButton from "@/app/BaseComponent/NavBarToggleBurgerButton";
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
        <div className="NormalTextSizing textHeaderStyle d-flex align-items-center">
          داشبورد
        </div>
      </HeadermakeOrder>
      <Box sx={{ p: 2 }}>
        <CardResponssive className="mb-3">
          <ActiveUsersCard />
          <ProductCountCard />
          <AllOrderCard />
          <ActiveOrdersCard/>
        </CardResponssive>

        <MonthlyVisitsChart />
      </Box>
    </>
  );
}
