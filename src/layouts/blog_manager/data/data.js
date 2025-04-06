/* eslint-disable react/prop-types */
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Icon } from "@mui/material";
import BlogService from "api/BlogService";

export default function data(pageBlog, rowsPerPageBlog, searchQuery) {
  const [blog, setBlog] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const jwtToken = sessionStorage.getItem("jwtToken");

  useEffect(() => {
    const getAllBlog = async () => {
      if (jwtToken) {
        try {
          const response = await BlogService.getAllBlog(pageBlog, rowsPerPageBlog, searchQuery);
          if (Array.isArray(response.content)) {
            setBlog(response.content);
            setTotalPages(response.total_page || 1);
          } else {
            setBlog([]);
            setTotalPages(1);
          }
        } catch (error) {
          setBlog([]);
          setTotalPages(1);
        }
      }
    };
    getAllBlog();
  }, [jwtToken, pageBlog, rowsPerPageBlog, searchQuery]);

  const hasNextPageBlog = pageBlog < totalPages;

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

  return { columns, rows, hasNextPageBlog };
}
