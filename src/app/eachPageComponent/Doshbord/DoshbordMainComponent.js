import React from "react";
import ActiveUsersCard from "./ActiveUsersCard";
import { Box, Typography } from "@mui/material";
// import base component
import MonthlyVisitsChart from "./MonthlyVisitsChart";
import NavBarToggleBurgerButton from "@/app/BaseComponent/NavBarToggleBurgerButton";
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
      <Box sx={{ p: 4 }}>
       <ActiveUsersCard />
       <MonthlyVisitsChart />
       
      </Box>
    </>
  );
}
