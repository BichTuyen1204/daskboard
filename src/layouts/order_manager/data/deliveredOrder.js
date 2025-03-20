import { useState, useEffect } from "react";
import OrderService from "api/OrderService";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Link } from "react-router-dom";

export default function deliveredOrder(pageDelivered, rowsPerPageDelivered) {
  const [orders, setOrders] = useState([]);
  const [hasNextPageDelivered, setHasNextPageDelivered] = useState(true);
  const jwtToken = sessionStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!jwtToken) return;
      try {
        const response = await OrderService.getAllOrderOnConfirm(
          "SHIPPED",
          pageDelivered,
          rowsPerPageDelivered
        );
        console.log("Confirm Response:", response);

        if (Array.isArray(response)) {
          setOrders(response);
          setHasNextPageDelivered(response.length === rowsPerPageDelivered);
        } else {
          setOrders([]);
          setHasNextPageDelivered(false);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setHasNextPageDelivered(false);
      }
    };
    fetchOrders();
  }, [jwtToken, pageDelivered, rowsPerPageDelivered]);

  const columns = [
    { Header: "Receiver", accessor: "name", align: "left" },
    { Header: "Order Date", accessor: "order_date", align: "left" },
    { Header: "Address", accessor: "address", align: "left" },
    { Header: "Phone", accessor: "phone", align: "left" },
    { Header: "Payment Status", accessor: "payment_status", align: "left" },
    { Header: "Total Price", accessor: "total_price", align: "left" },
    { Header: "Coupon", accessor: "coupon", align: "left" },
    { Header: "Status", accessor: "status", align: "left" },
    { Header: "Action", accessor: "action", align: "left" },
  ];

  const rows = orders.map((item) => ({
    name: <MDTypography variant="caption">{item.receiver}</MDTypography>,
    order_date: <MDTypography variant="caption">{item.order_date}</MDTypography>,
    address: <MDTypography variant="caption">{item.delivery_address}</MDTypography>,
    phone: <MDTypography variant="caption">{item.phonenumber}</MDTypography>,
    payment_status: <MDTypography variant="caption">{item.payment_status}</MDTypography>,
    total_price: <MDTypography variant="caption">{item.total_price}</MDTypography>,
    coupon: <MDTypography variant="caption">{item.coupon_sale}</MDTypography>,
    status: (
      <MDTypography variant="caption" style={{ color: "green" }}>
        {item.order_status}
      </MDTypography>
    ),
    action: (
      <MDBox display="flex" justifyContent="center">
        <Link to={`/order_detail/${item.id}`} style={{ textDecoration: "none" }}>
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

  return { columns, rows, hasNextPageDelivered };
}
