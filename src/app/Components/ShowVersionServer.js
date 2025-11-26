"use client";
import styled from "styled-components";

const MainP = styled.p`
  text-align: center;
  /* 
  position: fixed;
  bottom: 0%;
  left: -2%;
  transform: translate(50% , -50%); */
`;

export default function ShowVersionServer() {
  return (
    <>
      <MainP className="smallest">
        نسخه : {process.env.NEXT_PUBLIC_ADMIN_VERSION}
      </MainP>
    </>
  );
}
