// src/components/MonthlyVisitsChart.js

"use client";

import { useEffect, useState } from "react";
// import redux
import { useSelector } from "react-redux";
import { token } from "@/app/Store/slice";

import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import styled from "styled-components";

const ChartContainer = styled.div`
  position: relative;
  width: 100%;
  height: 360px;

  @media (max-width: 768px) {
    height: 280px;
  }
`;

const StateText = styled.p`
  padding: 48px 0;
  text-align: center;
  color: var(--c-muted);
`;

// ثبت کامپوننت‌های مورد نیاز Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

// تعریف نام ماه‌های تقویم فارسی
const persianMonths = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

const MonthlyVisitsChart = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // انتخاب توکن از استور Redux
  const tokenCome = useSelector(token);

  useEffect(() => {
    const fetchMonthlyVisits = async () => {
      if (!tokenCome) {
        console.error("توکن احراز هویت یافت نشد.");
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/analytics/monthly-visits`,
          {
            headers: {
              Authorization: `Bearer ${tokenCome}`,
            },
            params: {
              year: new Date().getFullYear(), // دریافت داده‌ها برای سال جاری
            },
          },
        );

        // فرض می‌کنیم که response.data یک آرایه از { month: number, count: number } است
        // اطمینان از نمایندگی همه ۱۲ ماه تقویم فارسی
        const dataMap = new Map();
        response.data.forEach((item) => {
          dataMap.set(item.month, item.count);
        });

        const completeData = persianMonths.map((monthName, index) => ({
          month: index + 1,
          count: dataMap.get(index + 1) || 0,
        }));

        setMonthlyData(completeData);
        setLoading(false);
      } catch (err) {
        console.error("خطا در دریافت داده‌های بازدید ماهانه:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchMonthlyVisits();
  }, [tokenCome]);

  // آماده‌سازی داده‌ها برای نمودار
  const chartData = {
    labels: monthlyData.map((item) => persianMonths[item.month - 1]),
    datasets: [
      {
        label: "تعداد بازدیدکنندگان",
        data: monthlyData.map((item) => item.count),
        backgroundColor: "#2f5bd9",
        hoverBackgroundColor: "#2548b4",
        borderRadius: 6,
        maxBarThickness: 36,
      },
    ],
  };

  const font = { family: "IRANSansXVF, sans-serif", size: 12 };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { titleFont: font, bodyFont: font, rtl: true },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font, color: "#6b7280" },
      },
      y: {
        beginAtZero: true,
        grid: { color: "#eef0f4" },
        border: { display: false },
        ticks: { font, color: "#6b7280", precision: 0 },
      },
    },
  };

  if (loading) return <StateText>در حال بارگذاری داده‌ها...</StateText>;
  if (error)
    return <StateText>خطا در بارگذاری داده‌ها. لطفاً دوباره تلاش کنید.</StateText>;

  return (
    <ChartContainer>
      <Bar data={chartData} options={options} />
    </ChartContainer>
  );
};

export default MonthlyVisitsChart;
