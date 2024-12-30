// src/components/MonthlyVisitsChart.js

'use client';

import React, { useEffect, useState } from 'react';
// import redux 
import { useSelector } from 'react-redux';
import { token } from '@/app/Store/slice';

import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import styled from 'styled-components';

const ChartContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px; /* می‌توانید این مقدار را به نیاز خود تنظیم کنید */
`;

// ثبت کامپوننت‌های مورد نیاز Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// تعریف نام ماه‌های تقویم فارسی
const persianMonths = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
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
        console.error('توکن احراز هویت یافت نشد.');
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/analytics/monthly-visits`,
          {
            headers: {
              Authorization: `Bearer ${tokenCome?.token}`,
            },
            params: {
              year: new Date().getFullYear(), // دریافت داده‌ها برای سال جاری
            },
          }
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
        console.error('خطا در دریافت داده‌های بازدید ماهانه:', err);
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
        label: 'تعداد بازدیدکنندگان',
        data: monthlyData.map((item) => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          // تنظیم فونت برای راهنما
          font: {
            family: 'IRANSansXVF, sans-serif', // اعمال فونت سفارشی
            size: 14, // افزایش اندازه فونت
          },
        },
      },
      title: {
        display: true,
        text: 'تعداد بازدیدکنندگان ماهانه',
        font: {
          family: 'IRANSansXVF, sans-serif', // اعمال فونت سفارشی
          size: 18, // افزایش اندازه فونت
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            family: 'IRANSansXVF, sans-serif', // اعمال فونت سفارشی
            size: 14, // افزایش اندازه فونت
          },
        },
        title: {
          display: true,
          text: 'ماه',
          font: {
            family: 'IRANSansXVF, sans-serif', // اعمال فونت سفارشی
            size: 16, // افزایش اندازه فونت
          },
        },
      },
      y: {
        ticks: {
          font: {
            family: 'IRANSansXVF, sans-serif', // اعمال فونت سفارشی
            size: 14, // افزایش اندازه فونت
          },
        },
        title: {
          display: true,
          text: 'تعداد بازدید',
          font: {
            family: 'IRANSansXVF, sans-serif', // اعمال فونت سفارشی
            size: 16, // افزایش اندازه فونت
          },
        },
      },
    },
  };

  if (loading) return <p>در حال بارگذاری داده‌های بازدیدکنندگان ماهانه...</p>;
  if (error) return <p>خطا در بارگذاری داده‌ها. لطفاً دوباره تلاش کنید.</p>;

  return (
    <ChartContainer>
      <Bar data={chartData} options={options} />
    </ChartContainer>
  );
};

export default MonthlyVisitsChart;
