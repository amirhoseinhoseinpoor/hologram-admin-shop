import { useState, useEffect } from "react";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import StatCard from "./StatCard";
// imoport redux
import { useDispatch } from "react-redux";
import { Countorders } from "@/app/Store/thunks";

export default function ActiveOrdersCard() {
  const dispatch = useDispatch();

  const [productCount, setProductCount] = useState(null);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        // Dispatch without status to get all products
        const ApiResponseCome = await dispatch(
          Countorders({ status: 1 }),
        ).unwrap();
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
      label="سفارشات باز"
      value={productCount}
      icon={<PendingActionsIcon />}
    />
  );
}
