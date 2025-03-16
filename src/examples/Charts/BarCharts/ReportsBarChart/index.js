import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Divider, Icon } from "@mui/material";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RevenueBarChart = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [predictNextMonth, setPredictNextMonth] = useState("");
  const jwtToken = sessionStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchRevenue = async () => {
      if (!jwtToken) {
        console.error("Token not found. Please log in again.");
        return;
      } else {
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
          console.log("API Response:", response.data);
          setRevenueData(response.data.revenue.last_6_months_revenue);
          console.log(response.data.revenue.last_6_months_revenue);
        } catch (error) {
          console.error("Error fetching revenue data:", error.response?.data || error.message);
        }
      }
    };
    fetchRevenue();
  }, [jwtToken]);

  useEffect(() => {
    const getPredictNextMonth = async () => {
      if (!jwtToken) {
        console.error("Token not found. Please log in again.");
        return;
      }
      try {
        const response = await axios.get(
          "https://culcon-ad-be-30883260979.asia-east1.run.app/api/manager/revenue/predict-next-month",
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        setPredictNextMonth(response.data.predicted_revenue);
      } catch (error) {
        console.error("Error fetching revenue data:", error.response?.data || error.message);
      }
    };

    getPredictNextMonth();
  }, [jwtToken]);

  if (!revenueData.length) {
    return (
      <div style={{ background: "white", padding: "35px", borderRadius: "15px" }}>
        <p style={{ textAlign: "center", fontSize: "0.9em", fontWeight: "450" }}>Loading...</p>
      </div>
    );
  }

  const chartData = {
    labels: revenueData.map((item) => item.month),
    datasets: [
      {
        label: "",
        data: revenueData.map((item) => item.revenue),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: "top",
      },
      tooltip: {
        callbacks: {
          enabled: false,
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
          color: "#F5F5F5",
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
        height: "460px",
        background: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "visible",
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
        <Bar data={chartData} options={options} />
      </div>
      <div style={{ marginTop: "320px", width: "100%", marginLeft: "35px" }}>
        <p style={{ color: "#333", fontWeight: "bold", fontSize: "0.85em" }}>Revenue 6 Months</p>
        <p style={{ color: "#73777B", fontWeight: "150", fontSize: "0.7em", marginTop: "5px" }}>
          Revenue over the last 6 months
        </p>
        <p style={{ color: "#73777B", fontWeight: "150", fontSize: "0.7em" }}>
          The projected revenue for next month is <strong>${predictNextMonth}</strong>
        </p>
        <Divider />
      </div>
    </div>
  );
};

export default RevenueBarChart;
