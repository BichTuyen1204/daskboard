/* eslint-disable react/prop-types */
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import AccountService from "api/AccountService";
import { Icon } from "@mui/material";

export default function data(pageShipper, selectedType, rowsPerPageShipper) {
  const [shipper, setShipper] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const jwtToken = sessionStorage.getItem("jwtToken");

  useEffect(() => {
    const getCallShipper = async () => {
      if (!jwtToken) return;
      console.log("JWT Token: ", jwtToken);

      try {
        const response = await AccountService.getCallShipper(
          selectedType,
          pageShipper,
          rowsPerPageShipper
        );
        if (Array.isArray(response.content)) {
          setShipper(response.content);
          setTotalPages(response.total_page || 1);
        } else {
          setShipper([]);
          setTotalPages(1);
        }
      } catch (error) {
        setShipper([]);
        setTotalPages(1);
      }
    };
    getCallShipper();
  }, [jwtToken, selectedType, pageShipper, rowsPerPageShipper]);

  const hasNextPageShipper = pageShipper < totalPages;

  const Username = ({ username }) => (
    <MDBox lineHeight={1} textAlign="center">
      <MDTypography display="block" variant="button" fontWeight="medium" fontSize="0.8em">
        {username}
      </MDTypography>
    </MDBox>
  );

  const ID = ({ id }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="button" fontWeight="medium" fontSize="0.8em">
        {id}
      </MDTypography>
    </MDBox>
  );

  const Email = ({ email }) => (
    <MDBox lineHeight={1} textAlign="center">
      <MDTypography display="block" variant="button" fontWeight="medium" fontSize="0.8em">
        {email}
      </MDTypography>
    </MDBox>
  );

  const Status = ({ status }) => (
    <MDBox lineHeight={1} textAlign="center">
      <MDTypography display="block" variant="button" fontWeight="medium" fontSize="0.8em">
        <span style={{ green }}>{status}</span>
      </MDTypography>
    </MDBox>
  );

  const Order = ({ order }) => (
    <MDBox lineHeight={1} textAlign="center">
      <MDTypography display="block" variant="button" fontWeight="medium" fontSize="0.8em">
        {order}
      </MDTypography>
    </MDBox>
  );

  const Start = ({ start }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="button" fontWeight="medium" fontSize="0.8em">
        {start}
      </MDTypography>
    </MDBox>
  );

  const End = ({ end }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="button" fontWeight="medium" fontSize="0.8em">
        {end}
      </MDTypography>
    </MDBox>
  );

  const mapStatusToLabel = (status) => {
    const statusMap = {
      ACCEPTED: "ACCEPTED",
      REJECTED: "REJECTED",
      ON_SHIPPING: "ON SHIPPING",
      DELIVERED: "DELIVERED",
      ASSIGN: "ASSIGN",
      IDLE: "IDLE",
    };
    return statusMap[status] || status;
  };

  const columns = [
    { Header: "id of shipper", accessor: "id", width: "25%", align: "left" },
    { Header: "name of shipper", accessor: "username", align: "center" },
    { Header: "email", accessor: "email", align: "center" },
    { Header: "status", accessor: "status", align: "center" },
    { Header: "current order", accessor: "order", align: "center" },
    { Header: "start time", accessor: "start", align: "center" },
    { Header: "end time", accessor: "end", align: "center" },
  ];

  const rows = Array.isArray(shipper)
    ? shipper.map((item) => ({
        id: <ID id={item.id} />,
        username: <Username username={item.name} />,
        email: <Email email={item.email} />,
        status: <Status status={mapStatusToLabel(item.status)} />,
        order: <Order order={item.current_order} />,
        start: <Start start={item.start_shift} />,
        end: <End end={item.end_shift} />,
      }))
    : [];

  return { columns, rows, hasNextPageShipper };
}
