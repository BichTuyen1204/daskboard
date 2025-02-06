/* eslint-disable react/prop-types */
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import AccountService from "api/AccountService";
import MDAvatar from "components/MDAvatar";
import { Icon } from "@mui/material";

export default function data() {
  const [staff, setStaff] = useState([]);
  const jwtToken = sessionStorage.getItem("jwtToken");
  const defaultAvatar =
    "https://i.pinimg.com/originals/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg";

  useEffect(() => {
    const getAllCustomer = async () => {
      if (jwtToken) {
        try {
          const response = await AccountService.getAllCustomer(jwtToken);
          setStaff(response);
        } catch (error) {
          console.error("Can't access the server", error);
        }
      }
    };
    getAllCustomer();
  }, [jwtToken]);

  const Status = ({ status }) => (
    <MDBox lineHeight={1} textAlign="center">
      <MDTypography display="block" variant="button" fontWeight="medium" fontSize="0.8em">
        {status}
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

  const Username = ({ username }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="button" fontWeight="medium" fontSize="0.8em">
        {username}
      </MDTypography>
    </MDBox>
  );

  const columns = [
    { Header: "image", accessor: "image", width: "5%", align: "left" },
    { Header: "ID", accessor: "id", width: "5%", align: "left" },
    { Header: "username", accessor: "username", align: "center" },
    { Header: "status", accessor: "status", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const rows = staff.map((item) => ({
    image: (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDAvatar
          src={
            item.profile_pic && item.profile_pic.trim() !== "defaultProfile"
              ? item.profile_pic
              : "https://i.pinimg.com/originals/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg"
          }
          size="sm"
          alt="Avatar"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://i.pinimg.com/originals/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg";
          }}
        />
      </MDBox>
    ),
    id: <ID id={item.id} />,
    username: <Username username={item.username} />,
    status: <Status status={item.status} />,
    action: (
      <MDBox display="flex" justifyContent="center">
        <>
          <Link to={`/view_customer/${item.id}`}>
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
            to={`/edit_customer/${item.id}`}
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
  }));

  return { columns, rows };
}
