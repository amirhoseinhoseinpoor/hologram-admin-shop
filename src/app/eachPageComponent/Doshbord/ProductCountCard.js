import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
// imoport redux
import { useDispatch } from "react-redux";
import { countProduct } from "@/app/Store/thunks";

export default function ProductCountCard() {
  const dispatch = useDispatch();

  const [productCount, setProductCount] = useState(null);

  useEffect(() => {
    const fetchApi = async () => {
      const ApiResponseCome = await dispatch(countProduct()).unwrap();
      setProductCount(ApiResponseCome || null);
    };
    fetchApi();

  }, [dispatch]);

  return (
    <Box
      sx={{
        p: 3,
        border: "1px solid #ddd",
        borderRadius: "10px",
        textAlign: "center",
        boxShadow: "2px 2px 12px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
        width: "250px",
      }}
    >
      <Typography
        className="VodeoDisSizing"
        style={{ fontFamily: "unset" }}
        variant="h6"
        gutterBottom
      >
        تعداد محصولات
      </Typography>
      {!productCount ? (
        <CircularProgress />
      ) : (
        <Typography variant="h3" color="primary">
          {productCount}
        </Typography>
      )}
    </Box>
  );
}
