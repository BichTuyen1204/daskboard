/* eslint-disable react/prop-types */
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Icon } from "@mui/material";
import BlogService from "api/BlogService";

export default function data() {
  const [blog, setBlog] = useState([]);
  const jwtToken = sessionStorage.getItem("jwtToken");

  useEffect(() => {
    const getAllBlog = async () => {
      if (jwtToken) {
        try {
          const response = await BlogService.getAllBlog(jwtToken);
          if (Array.isArray(response)) {
            setBlog(response);
          } else {
            setBlog([]);
          }
        } catch (error) {
          if (error.response?.status === 401) {
            console.error("Unauthorized: Please log in again.");
            alert("Session expired. Please log in again.");
            setCustomer([]);
          } else {
            console.error("Can't access the server", error);
            setCustomer([]);
          }
        }
      }
    };
    getAllBlog();
  }, [jwtToken]);

  const Description = ({ description }) => (
    <MDBox
      lineHeight={1}
      textAlign="left"
      fontSize="0.8em"
      sx={{
        width: "200px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      <MDTypography variant="caption" fontWeight="medium">
        {description}
      </MDTypography>
    </MDBox>
  );

  const Title = ({ title }) => (
    <MDBox lineHeight={1} textAlign="left" fontSize="0.8em">
      <MDTypography display="block" variant="caption" fontWeight="medium">
        {title}
      </MDTypography>
    </MDBox>
  );

  const columns = [
    { Header: "id", accessor: "id", width: "5%", align: "left" },
    { Header: "title", accessor: "title", width: "50%", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const rows = blog.map((item) => ({
    id: (
      <MDTypography
        component="a"
        href="#"
        variant="caption"
        fontWeight="medium"
        style={{
          fontSize: "0.8em",
        }}
      >
        {item.id}
      </MDTypography>
    ),
    title: <Title title={item.title} />,
    action: (
      <MDBox display="flex" justifyContent="center">
        <>
          <Link to={`/view_blog/${item.id}`}>
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
          <Link to={`/edit_blog/${item.id}`} style={{ textDecoration: "none", marginLeft: "15px" }}>
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
