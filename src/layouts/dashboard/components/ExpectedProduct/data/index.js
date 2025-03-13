import RevenueService from "api/RevenueService";
import MDTypography from "components/MDTypography";
import { useEffect, useState } from "react";

export default function data() {
  const jwtToken = sessionStorage.getItem("jwtToken");
  const [topProductAllTime, setTopProductAllTime] = useState([]);

  useEffect(() => {
    const fetchRevenueData = async () => {
      if (!jwtToken) return;
      try {
        const response = await RevenueService.getAllDays();
        console.log("Dữ liệu từ API:", response.top_products.top_10_products_all_time);
        setTopProductAllTime(response.top_products.top_10_products_all_time);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };
    fetchRevenueData();
  }, [jwtToken]);

  return {
    columns: [
      { Header: "#", accessor: "index", width: "10%", align: "center" },
      { Header: "Name of Product", accessor: "name", width: "30%", align: "left" },
      { Header: "Total amount", accessor: "total_amount", width: "20%", align: "center" },
    ],

    rows: topProductAllTime.map((product, index) => ({
      index: index + 1,
      name: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {product.product_name}
        </MDTypography>
      ),
      total_amount: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {product.total_quantity}
        </MDTypography>
      ),
    })),
  };
}
