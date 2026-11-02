import { useState, useEffect } from "react";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import StatCard from "./StatCard";
// imoport redux
import { useDispatch } from "react-redux";
import { Countorders } from "@/app/Store/thunks";

export default function AllOrderCard() {
  const dispatch = useDispatch();

  const [productCount, setProductCount] = useState(null);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        // Dispatch without status to get all products
        const ApiResponseCome = await dispatch(Countorders({})).unwrap();
        setProductCount(ApiResponseCome?.count ?? 0);
      } catch (error) {
        console.error("Error fetching order count:", error);
        setProductCount(0); // Set default value in case of error
      }
    };
    fetchApi();
  }, [dispatch]);
  return (
    <StatCard
      label="کل سفارشات"
      value={productCount}
      icon={<ReceiptLongIcon />}
    />
  );
}
