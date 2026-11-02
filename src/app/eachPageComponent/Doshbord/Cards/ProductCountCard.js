import { useState, useEffect } from "react";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import StatCard from "./StatCard";
// imoport redux
import { useDispatch } from "react-redux";
import { countProduct } from "@/app/Store/thunks";

export default function ProductCountCard() {
  const dispatch = useDispatch();

  const [productCount, setProductCount] = useState(null);

  useEffect(() => {
    const fetchApi = async () => {
      const ApiResponseCome = await dispatch(countProduct()).unwrap();
      setProductCount(ApiResponseCome ?? 0);
    };
    fetchApi();
  }, [dispatch]);

  return (
    <StatCard
      label="تعداد محصولات"
      value={productCount}
      icon={<Inventory2Icon />}
    />
  );
}
