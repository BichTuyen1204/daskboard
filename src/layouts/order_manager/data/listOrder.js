/* eslint-disable react/prop-types */
import OrderService from "api/OrderService";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function data() {
  const [order, setOrder] = useState([]);
  const jwtToken = sessionStorage.getItem("jwtToken");

  useEffect(() => {
    const getAllOrder = async () => {
      if (!jwtToken) {
        return;
      } else {
        try {
          const response = await OrderService.getAllOrder(jwtToken);
          console.log("Order Response:", response);
          if (Array.isArray(response)) {
            setOrder(response);
          } else {
            console.error("Expected an array but got:", response);
            setOrder([]);
          }
        } catch (error) {
          error;
        }
      }
    };
    getAllOrder();
  }, [jwtToken]);

  const Creation_date = ({ date }) => (
    <MDBox lineHeight={1} textAlign="left" fontSize="0.8em">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {date}
      </MDTypography>
    </MDBox>
  );

  const Name = ({ name }) => (
    <MDBox lineHeight={1} textAlign="left" fontSize="0.8em">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {name}
      </MDTypography>
    </MDBox>
  );

  const columns = [
    { Header: "receiver", accessor: "name", width: "", align: "left" },
    { Header: "order date", accessor: "order_date", width: "", align: "left" },
    { Header: "address", accessor: "address", width: "", align: "left" },
    { Header: "phone number", accessor: "phone", width: "", align: "left" },
    { Header: "payment status", accessor: "payment_status", width: "", align: "left" },
    { Header: "payment method", accessor: "payment_method", width: "", align: "left" },
    { Header: "total price", accessor: "total_price", width: "", align: "left" },
    { Header: "Coupon", accessor: "coupon", width: "", align: "left" },
    { Header: "status", accessor: "status", width: "", align: "left" },
    { Header: "action", accessor: "action", width: "", align: "left" },
  ];

  const rows = order.map((item) => ({
    name: <Name name={item.receiver} />,
    order_date: <Creation_date date={item.order_date} />,
    address: (
      <MDTypography
        component="a"
        href="#"
        variant="caption"
        color="text"
        fontWeight="medium"
        style={{
          fontSize: "0.8em",
        }}
      >
        {item.delivery_address}
      </MDTypography>
    ),
    phone: (
      <MDTypography
        component="a"
        href="#"
        variant="caption"
        color="text"
        fontWeight="medium"
        style={{
          fontSize: "0.8em",
        }}
      >
        {item.phonenumber}
      </MDTypography>
    ),
    payment_status: (
      <MDTypography
        component="a"
        href="#"
        variant="caption"
        color="text"
        fontWeight="medium"
        style={{
          fontSize: "0.8em",
        }}
      >
        {item.payment_status}
      </MDTypography>
    ),
    payment_method: (
      <MDTypography
        component="a"
        href="#"
        variant="caption"
        color="text"
        fontWeight="medium"
        style={{
          fontSize: "0.8em",
        }}
      >
        {item.payment_method}
      </MDTypography>
    ),
    total_price: (
      <MDTypography
        component="a"
        href="#"
        variant="caption"
        color="text"
        fontWeight="medium"
        style={{
          fontSize: "0.8em",
        }}
      >
        {item.total_price}
      </MDTypography>
    ),
    coupon: (
      <MDTypography
        component="a"
        href="#"
        variant="caption"
        color="text"
        fontWeight="medium"
        style={{
          fontSize: "0.8em",
        }}
      >
        {item.coupon_sale}
      </MDTypography>
    ),
    status: (
      <MDTypography
        component="a"
        href="#"
        variant="caption"
        fontWeight="medium"
        style={{
          fontSize: "0.8em",
          color: "green",
        }}
      >
        {item.order_status}
      </MDTypography>
    ),
    discount_percentage: (
      <MDTypography
        component="a"
        href="#"
        variant="caption"
        color="text"
        fontWeight="medium"
        style={{
          fontSize: "0.8em",
        }}
      >
        {item.order_status}
      </MDTypography>
    ),
    order_status: (
      <MDTypography
        component="a"
        href="#"
        variant="caption"
        color="text"
        fontWeight="medium"
        style={{
          fontSize: "0.8em",
        }}
      ></MDTypography>
    ),
    action: (
      <MDBox display="flex" justifyContent="center">
        <MDTypography
          component="button"
          variant="caption"
          color="white"
          fontWeight="medium"
          style={{
            backgroundColor: "#1976d2",
            fontSize: "0.8em",
            border: "none",
            borderRadius: "2px",
            padding: "5px 10px",
            cursor: "pointer",
          }}
        >
          <Link to="/order_detail" style={{ color: "white" }}>
            View
          </Link>
        </MDTypography>
      </MDBox>
    ),
  }));
  return { columns, rows };
}
