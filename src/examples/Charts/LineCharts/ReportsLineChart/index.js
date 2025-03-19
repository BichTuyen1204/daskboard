import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Divider } from "@mui/material";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const RevenueLineChart = () => {
  const [revenueLineData, setRevenueLineData] = useState([]);
  const jwtToken = sessionStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchRevenue = async () => {
      if (!jwtToken) {
        console.error("Token not found. Please log in again.");
        return;
      }
      try {
        const response = await axios.get(
          "https://culcon-ad-be-30883260979.asia-east1.run.app/api/manager/revenue",
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const sortedData = response.data.revenue.last_7_days_revenue.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        setRevenueLineData(sortedData);
      } catch (error) {
        console.error("Error fetching revenue data:", error.response?.data || error.message);
      }
    };
    fetchRevenue();
  }, [jwtToken]);

  if (!revenueLineData.length) {
    return (
      <div style={{ background: "white", padding: "35px", borderRadius: "15px" }}>
        <p style={{ textAlign: "center", fontSize: "0.9em", fontWeight: "450" }}>Loading...</p>
      </div>
    );
  }

  const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF", "#FFD700", "#00FFFF"];

  const chartData = {
    labels: revenueLineData.map((item) => item.date),
    datasets: [
      {
        label: "Revenue",
        data: revenueLineData.map((item) => item.revenue),
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        pointBackgroundColor: revenueLineData.map((_, index) => colors[index % colors.length]),
        pointBorderColor: "#fff",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return "$" + tooltipItem.raw.toLocaleString("en-US");
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return "$" + value.toLocaleString("en-US");
          },
          color: "white",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
          drawBorder: false,
          drawOnChartArea: true,
          drawTicks: false,
        },
      },
      x: {
        ticks: {
          color: "white",
        },
        grid: {
          color: "#F5F5F5",
          drawBorder: false,
          drawOnChartArea: false,
          display: false,
        },
      },
    },
  };

  return (
    <div
      style={{
        marginTop: "35px",
        position: "relative",
        width: "100%",
        height: "430px",
        background: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "15px",
      }}
    >
      <div
        style={{
          width: "90%",
          height: "70%",
          padding: "20px",
          background: "#4C585B",
          borderRadius: "12px",
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
          position: "absolute",
          top: "28%",
          left: "50%",
          transform: "translate(-50%, -50%) scale(1.05)",
          zIndex: 2,
        }}
      >
        <Line data={chartData} options={options} />
      </div>
      <div style={{ marginTop: "300px", width: "100%", marginLeft: "35px" }}>
        <p style={{ color: "#333", fontWeight: "bold", fontSize: "0.85em" }}>Revenue 7 days</p>
        <p style={{ color: "#73777B", fontWeight: "150", fontSize: "0.7em", marginTop: "5px" }}>
          Revenue in the last 7 days
        </p>
        <Divider />
      </div>
    </div>
  );
};

export default RevenueLineChart;
