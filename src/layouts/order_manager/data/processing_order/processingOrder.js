import { useState, useEffect } from "react";
import OrderService from "api/OrderService";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Link } from "react-router-dom";

export default function processingOrder(pageOnProcessing, rowsPerPageOnProcessing) {
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const jwtToken = sessionStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!jwtToken) return;
      try {
        const response = await OrderService.getAllOrderOnConfirm(
          "ON_PROCESSING",
          pageOnProcessing,
          rowsPerPageOnProcessing
        );

        console.log("Processing Orders Response:", response);

        if (Array.isArray(response.content)) {
          setOrders(response.content);
          setTotalPages(response.total_page || 1);
        } else {
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
  }, [jwtToken, pageOnProcessing, rowsPerPageOnProcessing]);

  const hasNextPageOnProcessing = pageOnProcessing < totalPages;

  const columns = [
    { Header: "Receiver", accessor: "receiver", align: "center" },
    { Header: "Order Date", accessor: "order_date", align: "center" },
    { Header: "Address", accessor: "delivery_address", align: "center" },
    { Header: "Phone", accessor: "phonenumber", align: "center" },
    { Header: "Payment Status", accessor: "payment_status", align: "center" },
    { Header: "Total Price", accessor: "total_price", align: "center" },
    { Header: "Coupon", accessor: "coupon_sale", align: "center" },
    { Header: "Status", accessor: "order_status", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  const rows = orders.map((item) => ({
    receiver: <MDTypography variant="caption">{item.receiver}</MDTypography>,
    order_date: (
      <MDTypography variant="caption">
        {/* {new Date(item.order_date).toLocaleString("en-US", {
          timeZone: "Asia/Ho_Chi_Minh",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })} */}
        {(() => {
          const utcDate = new Date(item.order_date);
          utcDate.setHours(utcDate.getHours() + 7);
          return utcDate.toLocaleString("vi-VN");
        })()}
      </MDTypography>
    ),
    delivery_address: <MDTypography variant="caption">{item.delivery_address}</MDTypography>,
    phonenumber: <MDTypography variant="caption">{item.phonenumber}</MDTypography>,
    payment_status: <MDTypography variant="caption">{item.payment_status}</MDTypography>,
    total_price: <MDTypography variant="caption">${item.total_price}</MDTypography>,
    coupon_sale: <MDTypography variant="caption">{item.coupon_sale || "0"}%</MDTypography>,
    order_status: (
      <MDTypography variant="caption" style={{ color: "green" }}>
        <strong>
          {item.order_status === "ON_PROCESSING" ? "ON PROCESSING" : item.order_status}
        </strong>
      </MDTypography>
    ),
    action: (
      <MDBox display="flex" justifyContent="center">
        <Link to={`/order_processing_to_shipping/${item.id}`} style={{ textDecoration: "none" }}>
          <MDTypography
            variant="caption"
            style={{
              backgroundColor: "#1976d2",
              color: "white",
              padding: "5px 10px",
              borderRadius: "2px",
              cursor: "pointer",
            }}
          >
            View
          </MDTypography>
        </Link>
      </MDBox>
    ),
  }));

  return { columns, rows, hasNextPageOnProcessing };
}
