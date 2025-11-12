"use client";
import styled from "styled-components";

const MainP = styled.p`
  text-align: center;
  position: absolute;
  bottom: 2%;
  right: 2%;
  transform: translate(-50% , 50%);
`;

export default function ShowVersionServer() {
  return (
    <>
      <MainP className="smallest d-none d-lg-block">
        نسخه : {process.env.NEXT_PUBLIC_ADMIN_VERSION}
      </MainP>
    </>
  );
}
