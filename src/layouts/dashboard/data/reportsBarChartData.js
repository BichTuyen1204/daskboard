import { useState, useEffect } from "react";

const REACT_APP_BACKEND_API_ENDPOINT = process.env.REACT_APP_BACKEND_API_ENDPOINT;

const reportsBarChartData = () => {
  const [salesData, setSalesData] = useState({
    labels: [],
    datasets: { label: "Sales", data: [] },
  });

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await get(`${REACT_APP_BACKEND_API_ENDPOINT}/api/manager/revenue`);
        const data = await response.json();

        if (data.revenue?.last_7_days_revenue?.length) {
          const sortedData = data.revenue.last_7_days_revenue.sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          );

          const labels = sortedData.map((item) =>
            new Date(item.date).toLocaleDateString("en-US", { weekday: "short" })
          );
          const revenueData = sortedData.map((item) => item.revenue);

          setSalesData({
            labels,
            datasets: [
              {
                label: "Revenue",
                data: revenueData,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          });
        }
      } catch (error) {}
    };

    fetchRevenueData();
  }, []);

  return { salesData };
};

export default reportsBarChartData;
