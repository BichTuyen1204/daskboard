import { useState, useEffect } from "react";

const reportsLineChartData = () => {
  const [salesData, setSalesData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchRevenueData = async () => {
      if (!jwtToken) return;
      try {
        const response = await RevenueService.getAllDays();

        if (response?.revenue?.last_6_months_revenue) {
          const rawData = response.revenue.last_6_months_revenue;
          const sortedData = rawData.sort((a, b) => new Date(a.month) - new Date(b.month));
          const labels = sortedData.map((item) => item.month);
          const dataValues = sortedData.map((item) => item.revenue);
          setSalesData({
            labels: labels,
            datasets: [
              {
                label: "Doanh thu 6 tháng gần nhất",
                data: dataValues,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
              },
            ],
          });
        } else {
          setSalesData({ labels: [], datasets: [] });
        }
      } catch (error) {
        setSalesData({ labels: [], datasets: [] });
      }
    };
    fetchRevenueData();
  }, [jwtToken]);

  return { sales: salesData };
};

export default reportsLineChartData;
