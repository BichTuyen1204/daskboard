/* eslint-disable react/prop-types */
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import AccountService from "api/AccountService";

export default function data() {
  const [staff, setStaff] = useState([]);
  const jwtToken = sessionStorage.getItem("jwtToken");

  // useEffect(() => {
  //   const getAllStaff = async () => {
  //     if (jwtToken) {
  //       try {
  //         const response = await AccountService.getAllStaff(jwtToken);
  //         setStaff(response);
  //       } catch (error) {
  //         console.error("Can't access the server", error);
  //       }
  //     }
  //   };
  //   getAllStaff();
  // }, [jwtToken]);

  const Email = ({ email }) => (
    <MDBox lineHeight={1} textAlign="center">
      <MDTypography display="block" variant="button" fontWeight="medium" fontSize="0.8em">
        {email}
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

  const Phone = ({ phone_number }) => (
    <MDBox lineHeight={1} textAlign="center">
      <MDTypography display="block" variant="button" fontWeight="medium" fontSize="0.8em">
        {phone_number}
      </MDTypography>
    </MDBox>
  );

  const columns = [
    { Header: "ID", accessor: "id", width: "25%", align: "left" },
    { Header: "email", accessor: "email", align: "center" },
    { Header: "phone number", accessor: "phone_number", align: "center" },
    { Header: "View detail", accessor: "action", align: "center" },
  ];

  const rows = staff.map((item) => ({
    id: <ID id={item.id} />,
    email: <Email email="abc@gmail.com" />,
    phone_number: <Phone phone_number="0999999999" />,
    action: (
      <MDBox display="flex" justifyContent="center">
        <MDTypography
          component="button"
          variant="caption"
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
          <Link style={{ color: "white" }} to="/profile_detail">
            View
          </Link>
        </MDTypography>
      </MDBox>
    ),
  }));

  return { columns, rows };
}
