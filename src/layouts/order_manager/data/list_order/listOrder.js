import { useState, useEffect } from "react";
import OrderService from "api/OrderService";
import MDTypography from "components/MDTypography";
import { useNavigate } from "react-router-dom";

export default function listOrder(page, rowsPerPage) {
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const jwtToken = sessionStorage.getItem("jwtToken");
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!jwtToken) {
        return;
      }
      try {
        const response = await OrderService.getAllOrder(page, rowsPerPage);
        if (response && Array.isArray(response.content)) {
          setOrders(response.content);
          setTotalPages(response.total_page || 1);
        } else {
          setOrders([]);
          setTotalPages(1);
        }
      } catch (error) {
        setOrders([]);
        setTotalPages(1);
      }
    };

    fetchOrders();
  }, [jwtToken, page, rowsPerPage]);

  useEffect(() => {
    const getProfile = async () => {
      if (!jwtToken) return;

      try {
        const response = await AccountService.getProfile(jwtToken);
        if (response) {
          setAccount(response);
        } else {
          setAccount(null);
        }
      } catch (error) {
        setAccount(null);
      }
    };

    getProfile();
  }, [jwtToken]);

  useEffect(() => {
    if (account !== null && account?.type == null) {
      alert("Your session has expired. Please log in again.");
      navigate("/sign-in", { replace: true });
    }
  }, [account, navigate]);

  const columns = [
    { Header: "Receiver", accessor: "receiver", align: "left" },
    { Header: "Address", accessor: "delivery_address", align: "left" },
    { Header: "Order Date", accessor: "order_date", align: "left" },
    { Header: "Phone", accessor: "phonenumber", align: "center" },
    { Header: "Total Price", accessor: "total_price", align: "center" },
    { Header: "Coupon", accessor: "coupon_sale", align: "center" },
    { Header: "Status", accessor: "order_status", align: "left" },
  ];

  const rows = orders.map((item) => ({
    receiver: <MDTypography variant="caption">{item.receiver}</MDTypography>,
    order_date: (
      <MDTypography variant="caption">
        {(() => {
          const utcDate = new Date(item.order_date);
          utcDate.setHours(utcDate.getHours() + 7);
          return utcDate.toLocaleString("vi-VN");
        })()}
      </MDTypography>
    ),
    delivery_address: <MDTypography variant="caption">{item.delivery_address}</MDTypography>,
    phonenumber: <MDTypography variant="caption">{item.phonenumber}</MDTypography>,
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
        {item.order_status.replace("_", " ")}
      </MDTypography>
    ),
  }));

  return { columns, rows, totalPages };
}
