// export default {
//   sales: {
//     labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
//     datasets: { label: "Website", data: [50, 155, 300, 320, 500, 650] },
//   },
//   tasks: {
//     labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
//     datasets: { label: "Desktop apps", data: [50, 40, 300, 220, 500, 250, 400, 230, 500] },
//   },
// };

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

          // Sắp xếp theo thời gian (nếu cần)
          const sortedData = rawData.sort((a, b) => new Date(a.month) - new Date(b.month));

          // Lấy labels (tháng) và datasets (doanh thu)
          const labels = sortedData.map((item) => item.month);
          const dataValues = sortedData.map((item) => item.revenue);
          console.log("🔥 API Response:", salesData);

          // Cập nhật state
          setSalesData({
            labels: labels,
            datasets: [
              {
                label: "Doanh thu 6 tháng gần nhất",
                data: dataValues,
                backgroundColor: "rgba(54, 162, 235, 0.6)", // Màu cột
                borderColor: "rgba(54, 162, 235, 1)", // Màu viền
                borderWidth: 1,
              },
            ],
          });
        } else {
          console.warn("⚠️ API không trả về dữ liệu revenue");
          setSalesData({ labels: [], datasets: [] });
        }
      } catch (error) {
        console.error("❌ Lỗi khi fetch dữ liệu:", error);
        setSalesData({ labels: [], datasets: [] });
      }
    };
    fetchRevenueData();
  }, [jwtToken]);

  return { sales: salesData };
};

export default reportsLineChartData;
