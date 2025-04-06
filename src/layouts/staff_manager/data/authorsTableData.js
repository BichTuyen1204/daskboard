/* eslint-disable react/prop-types */
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import AccountService from "api/AccountService";
import { Icon } from "@mui/material";

export default function data(pageStaff, rowsPerPageStaff, searchId) {
  const [staff, setStaff] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const jwtToken = sessionStorage.getItem("jwtToken");

  useEffect(() => {
    const getAllStaff = async () => {
      if (jwtToken) {
        try {
          const response = await AccountService.getAllStaff(pageStaff, rowsPerPageStaff, searchId);
          console.log("API Response:", response);
          if (Array.isArray(response.content)) {
            setStaff(response.content);
            setTotalPages(response.total_page || 1);
          } else {
            setStaff([]);
            setTotalPages(1);
          }
        } catch (error) {
          console.error("Can't access the server", error);
          setStaff([]);
          setTotalPages(1);
        }
      }
    };
    getAllStaff();
  }, [jwtToken, pageStaff, rowsPerPageStaff, searchId]);

  const hasNextPageStaff = pageStaff < totalPages;

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

  const Type = ({ type }) => (
    <MDBox lineHeight={1} textAlign="center">
      <MDTypography display="block" variant="button" fontWeight="medium" fontSize="0.8em">
        {type}
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

  const columns = [
    { Header: "id", accessor: "id", width: "25%", align: "left" },
    { Header: "username", accessor: "username", align: "center" },
    { Header: "type", accessor: "type", align: "center" },
    { Header: "status", accessor: "status", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const rows = Array.isArray(staff)
    ? staff.map((item) => ({
        id: <ID id={item.id} />,
        username: <Username username={item.username} />,
        type: <Type type={item.type} />,
        status: <Status status={item.status} />,
        action: (
          <MDBox display="flex" justifyContent="center">
            <>
              <Link to={`/view_staff/${item.id}`}>
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
                  View
                </MDTypography>
              </Link>
              <Link
                to={`/edit_staff/${item.id}`}
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

  return { columns, rows, hasNextPageStaff };
}
