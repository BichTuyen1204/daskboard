/* eslint-disable react/prop-types */
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import AccountService from "api/AccountService";
import { Icon } from "@mui/material";

export default function data(pageReject, selectedType, rowsPerPageReject) {
  const [shipper, setReject] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const jwtToken = sessionStorage.getItem("jwtToken");

  useEffect(() => {
    const getCallReject = async () => {
      if (!jwtToken) return;
      console.log("JWT Token: ", jwtToken);

      try {
        const response = await AccountService.getCallShipper(
          selectedType,
          pageReject,
          rowsPerPageReject
        );
        if (Array.isArray(response.content)) {
          setReject(response.content);
          setTotalPages(response.total_page || 1);
        } else {
          setReject([]);
          setTotalPages(1);
        }
      } catch (error) {
        setReject([]);
        setTotalPages(1);
      }
    };
    getCallReject();
  }, [jwtToken, selectedType, pageReject, rowsPerPageReject]);

  const hasNextPageReject = pageReject < totalPages;

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
        <span style={{ color: "red" }}>{status}</span>
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

  const Order = ({ order }) => (
    <MDBox lineHeight={1} textAlign="center">
      <MDTypography display="block" variant="button" fontWeight="medium" fontSize="0.8em">
        {order}
      </MDTypography>
    </MDBox>
  );

  const mapStatusToLabel = (status) => {
    const statusMap = {
      REJECTED: "REJECTED",
    };
    return statusMap[status] || status;
  };

  const columns = [
    { Header: "id of shipper", accessor: "id", align: "left" },
    { Header: "name of shipper", accessor: "username", with: "25%", align: "left" },
    { Header: "email", accessor: "email", align: "center" },
    { Header: "status", accessor: "status", align: "center" },
    { Header: "current order", accessor: "order", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const rows = Array.isArray(shipper)
    ? shipper.map((item) => ({
        id: <ID id={item.id} />,
        username: <Username username={item.name} />,
        email: <Email email={item.email} />,
        status: <Status status={mapStatusToLabel(item.status)} />,
        order: <Order order={item.current_order} />,
        action: (
          <MDBox display="flex" justifyContent="center">
            <Link to={`/choose_shipper/${item.current_order}`} style={{ textDecoration: "none" }}>
              <MDTypography
                variant="caption"
                style={{
                  backgroundColor: "#1976d2",
                  fontWeight: "500",
                  color: "white",
                  padding: "8px 10px",
                  borderRadius: "2px",
                  cursor: "pointer",
                }}
              >
                Choose order shipper
              </MDTypography>
            </Link>
          </MDBox>
        ),
      }))
    : [];

  return { columns, rows, hasNextPageReject };
}
