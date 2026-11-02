import { HeadermakeOrder } from "@/app/BaseComponent/PageHeader";
import ActiveUsersCard from "./Cards/ActiveUsersCard";
import ProductCountCard from "./Cards/ProductCountCard";
import AllOrderCard from "./Cards/AllOrderCard";
import ActiveOrdersCard from "./Cards/ActiveOrdersCard";
// import base component
import ProfileComponent from "@/app/BaseComponent/ProfileComponent";
import MonthlyVisitsChart from "./MonthlyVisitsChart";
import NavBarToggleBurgerButton from "@/app/BaseComponent/NavBarToggleBurgerButton";
import styled from "styled-components";

const CardResponssive = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const ChartCard = styled.section`
  padding: 20px;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-md);
  box-shadow: var(--shadow-sm);

  h2 {
    margin-bottom: 16px;
    font-size: 16px;
    font-weight: 600;
    color: var(--c-ink);
  }
`;

export default function DoshbordMainComponent({ toggleShow }) {
  return (
    <>
      <HeadermakeOrder>
        <div className="d-block d-lg-none">
          <NavBarToggleBurgerButton func={() => toggleShow("main")} />
        </div>
        <div className="textHeaderStyle d-flex align-items-center">
          داشبورد
        </div>
        <ProfileComponent />
      </HeadermakeOrder>

      <CardResponssive>
        <ActiveUsersCard />
        <ProductCountCard />
        <AllOrderCard />
        <ActiveOrdersCard />
      </CardResponssive>

      <ChartCard>
        <h2>بازدیدکنندگان ماهانه</h2>
        <MonthlyVisitsChart />
      </ChartCard>
    </>
  );
}
