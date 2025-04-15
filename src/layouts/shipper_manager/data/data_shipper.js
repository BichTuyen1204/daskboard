/* eslint-disable react/prop-types */
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import AccountService from "api/AccountService";
import { Icon } from "@mui/material";

export default function data(pageShipper, selectedType, rowsPerPageShipper, searchQuery = "") {
  const [shipper, setShipper] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const jwtToken = sessionStorage.getItem("jwtToken");

  useEffect(() => {
    const getCallShipper = async () => {
      if (!jwtToken) return;
      try {
        const response = await AccountService.getCallShipper(
          selectedType,
          pageShipper,
          rowsPerPageShipper
        );
        if (Array.isArray(response.content)) {
          // Apply client-side filtering if search query is present
          let filteredContent = response.content;
          if (searchQuery && searchQuery.trim() !== "") {
            const query = searchQuery.toLowerCase();
            filteredContent = response.content.filter(
              (item) =>
                (item.id && item.id.toString().includes(query)) ||
                (item.name && item.name.toLowerCase().includes(query)) ||
                (item.email && item.email.toLowerCase().includes(query))
            );
          }
          setShipper(filteredContent);
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
  }, [jwtToken, selectedType, pageShipper, rowsPerPageShipper, searchQuery]);

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
        {status}
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
    { Header: "id of shipper", accessor: "id", align: "left" },
    { Header: "name of shipper", accessor: "username", align: "left" },
    { Header: "email", accessor: "email", align: "left" },
    { Header: "status", accessor: "status", align: "center" },
    { Header: "start time", accessor: "start", align: "center" },
    { Header: "end time", accessor: "end", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const rows = Array.isArray(shipper)
    ? shipper.map((item) => ({
        id: <ID id={item.id} />,
        username: <Username username={item.name} />,
        email: <Email email={item.email} />,
        status: <Status status={mapStatusToLabel(item.status)} />,
        start: <Start start={item.start_shift} />,
        end: <End end={item.end_shift} />,
        action: (
          <MDBox display="flex" justifyContent="center">
            <>
              <Link
                to={`/edit_shipper/${item.id}`}
                style={{ textDecoration: "none", marginLeft: "15px" }}
              >
                <MDTypography
                  component="button"
                  variant="caption"
                  fontWeight="medium"
                  style={{
                    backgroundColor: "white",
                    color: "#1976d2",
                    fontSize: "0.8em",
                    border: "none",
                    padding: "5px 10px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#f0f4ff")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "white")}
                >
                  <Icon fontSize="small" style={{ marginRight: "5px" }}>
                    edit
                  </Icon>
                </MDTypography>
              </Link>
            </>
          </MDBox>
        ),
      }))
    : [];

  return { columns, rows, hasNextPageShipper };
}
