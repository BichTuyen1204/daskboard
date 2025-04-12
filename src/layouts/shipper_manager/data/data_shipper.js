/* eslint-disable react/prop-types */
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import AccountService from "api/AccountService";
import { Icon } from "@mui/material";

export default function data(pageShipper, rowsPerPageShipper) {
  const [shipper, setShipper] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const jwtToken = sessionStorage.getItem("jwtToken");

  useEffect(() => {
    const getCallShipper = async () => {
      if (jwtToken) {
        try {
          const response = await AccountService.getCallShipper(pageShipper, rowsPerPageShipper);
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
      }
    };
    getCallShipper();
  }, [jwtToken, pageShipper, rowsPerPageShipper]);

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

  const Start = ({ start }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="button" fontWeight="medium" fontSize="0.8em">
        {convertTimeOnlyToVN(start)}
      </MDTypography>
    </MDBox>
  );

  const End = ({ end }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="button" fontWeight="medium" fontSize="0.8em">
        {convertTimeOnlyToVN(end)}
      </MDTypography>
    </MDBox>
  );

  const convertTimeOnlyToVN = (timeString) => {
    if (!timeString) return "N/A";
    const fullTime = `1970-01-01T${timeString}`;
    const date = new Date(fullTime);
    if (isNaN(date.getTime())) return "Invalid date";
    date.setHours(date.getHours() + 7);
    return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  };

  const columns = [
    { Header: "id", accessor: "id", width: "25%", align: "left" },
    { Header: "username", accessor: "username", align: "left" },
    { Header: "email", accessor: "email", align: "left" },
    { Header: "start time", accessor: "start", align: "center" },
    { Header: "end time", accessor: "end", align: "center" },
  ];

  const rows = Array.isArray(shipper)
    ? shipper.map((item) => ({
        id: <ID id={item.id} />,
        username: <Username username={item.name} />,
        email: <Email email={item.email} />,
        start: <Start start={item.start_ship} />,
        end: <End end={item.end_shift} />,
      }))
    : [];

  return { columns, rows, hasNextPageShipper };
}
