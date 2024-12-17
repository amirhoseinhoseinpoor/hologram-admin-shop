// src/components/ActiveUsersCard.js

import React from "react";
import useActiveUsers from "@/hooks/useActiveUsers";
import { Box, Typography, CircularProgress } from "@mui/material";
import styled from "styled-components";

const TypographyStyle = styled(Typography)`
  font-size: 16px;
  font-weight: 600;
  @media (max-width: 980px) {
    font-size: 15px;
  }
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const TypographyStyleNumber = styled(Typography)`
  font-size: 35px;
  font-weight: 700;
  @media (max-width: 980px) {
    font-size: 30px;
  }
  @media (max-width: 768px) {
    font-size: 25px;
  }
`;

const ActiveUsersCard = () => {
  const { activeUsers, error } = useActiveUsers();

  return (
    <Box
      sx={{
        p: 2,
        border: "1px solid #ddd",
        borderRadius: "10px",
        textAlign: "center",
        boxShadow: "2px 2px 12px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
        width: "100%",
      }}
    >
      <TypographyStyle style={{ fontFamily: "unset" }} variant="h6">
        کاربر های فعال
      </TypographyStyle>
      {error ? (
        <TypographyStyle variant="body1" color="error">
          {error}
        </TypographyStyle>
      ) : activeUsers >= 0 ? (
        <TypographyStyleNumber variant="h3" color="primary">
          {activeUsers}
        </TypographyStyleNumber>
      ) : (
        <CircularProgress />
      )}
      {/* <TypographyStyleNumber variant="h3" color="primary">
        {activeUsers}
      </TypographyStyleNumber> */}
    </Box>
  );
};

export default ActiveUsersCard;
