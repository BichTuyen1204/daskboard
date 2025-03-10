/* eslint-disable react/prop-types */
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import AccountService from "api/AccountService";
import MDAvatar from "components/MDAvatar";
import { Icon } from "@mui/material";
import { object } from "prop-types";

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
    //Image start
    image: (
      <MDBox
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          width: 35,
          height: 35,
          borderRadius: "50%",
          overflow: "hidden",
          boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.2)",
          marginRight: "10px",
        }}
      >
        <img
          src={
            item.profile_pic && item.profile_pic.trim() !== "defaultProfile"
              ? item.profile_pic
              : "https://i.pinimg.com/originals/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg"
          }
          alt="Avatar"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://i.pinimg.com/originals/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg";
          }}
        />
      </MDBox>
    ),
    //Image end

    //ID start
    id: <ID id={item.id} />,
    //ID end

    //Username start
    username: <Username username={item.username} />,
    //Username end

    //Status start
    status: <Status status={item.status} />,
    //Status end

    //Action start
    action: (
      <MDBox display="flex" justifyContent="center">
        <>
          {/* Button view customer detail start */}
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
          {/* Button view customer detail end */}

          {/* Button edit customer start */}
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
          {/* Button edit customer end */}
        </>
      </MDBox>
    ),
    //Action end
  }));

  return { columns, rows };
}
