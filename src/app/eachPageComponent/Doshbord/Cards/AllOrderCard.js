import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
// imoport redux
import { useDispatch } from "react-redux";
import { Countorders } from "@/app/Store/thunks";
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

export default function AllOrderCard() {
  const dispatch = useDispatch();

  const [productCount, setProductCount] = useState(null);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        // Dispatch without status to get all products
        const ApiResponseCome = await dispatch(Countorders({})).unwrap();
        setProductCount(ApiResponseCome?.count || null);
      } catch (error) {
        console.error("Error fetching order count:", error);
        setProductCount(0); // Set default value in case of error
      }
    };
    fetchApi();
  }, [dispatch]);
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
      <TypographyStyle
        className="VodeoDisSizing"
        style={{ fontFamily: "unset" }}
        variant="h6"
        gutterBottom
      >
        کل سفارشات
      </TypographyStyle>
      {!productCount ? (
        <CircularProgress />
      ) : (
        <TypographyStyleNumber variant="h4" color="primary">
          {productCount}
        </TypographyStyleNumber>
      )}
    </Box>
  );
}
