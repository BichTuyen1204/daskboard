import { useState, useEffect } from "react";
import OrderService from "api/OrderService";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Link } from "react-router-dom";

export default function listOrder(page, rowsPerPage) {
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const jwtToken = sessionStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!jwtToken) {
        console.warn("JWT Token not found!");
        return;
      }
      try {
        const response = await OrderService.getAllOrder(page, rowsPerPage);
        console.log("ALL order:", response);
        if (response && Array.isArray(response.content)) {
          setOrders(response.content);
          setTotalPages(response.total_page || 1);
        } else {
          console.warn("API returned empty or invalid content:", response);
          setOrders([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
        setTotalPages(1);
      }
    };

    fetchOrders();
  }, [jwtToken, page, rowsPerPage]);

  const columns = [
    { Header: "Receiver", accessor: "receiver", align: "center" },
    { Header: "Order Date", accessor: "order_date", align: "center" },
    { Header: "Address", accessor: "delivery_address", align: "center" },
    { Header: "Phone", accessor: "phonenumber", align: "center" },
    { Header: "Payment Status", accessor: "payment_status", align: "center" },
    { Header: "Total Price", accessor: "total_price", align: "center" },
    { Header: "Coupon", accessor: "coupon_sale", align: "center" },
    { Header: "Status", accessor: "order_status", align: "center" },
  ];

  const rows = orders.map((item) => ({
    receiver: <MDTypography variant="caption">{item.receiver}</MDTypography>,
    order_date: (
      <MDTypography variant="caption">
        {new Date(item.order_date).toLocaleString("en-US", {
          timeZone: "Asia/Ho_Chi_Minh",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })}
      </MDTypography>
    ),
    delivery_address: <MDTypography variant="caption">{item.delivery_address}</MDTypography>,
    phonenumber: <MDTypography variant="caption">{item.phonenumber}</MDTypography>,
    payment_status: <MDTypography variant="caption">{item.payment_status}</MDTypography>,
    total_price: <MDTypography variant="caption">${item.total_price}</MDTypography>,
    coupon_sale: <MDTypography variant="caption">{item.coupon_sale || "0"}%</MDTypography>,
    order_status: (
      <MDTypography
        variant="caption"
        style={{
          color:
            item.order_status === "ON_CONFIRM"
              ? "orange"
              : item.order_status === "CANCELLED"
              ? "red"
              : "green",
          fontWeight: "bold",
        }}
      >
        {item.order_status.replace("_", " ").toUpperCase()}{" "}
      </MDTypography>
    ),
  }));

  return { columns, rows, totalPages };
}
