/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import { Icon } from "@mui/material";
import { Link } from "react-router-dom";
import ProductService from "api/ProductService";

export default function DataTable(pageMealkit, rowsPerPageMealkit) {
  const [mealkit, setMealkit] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const jwtToken = sessionStorage.getItem("jwtToken");

  const hasNextPageMealkit = pageMealkit < totalPages;

  useEffect(() => {
    const getAllMealkit = async () => {
      if (!jwtToken) {
        return;
      } else {
        try {
          const response = await ProductService.allMealkit(pageMealkit, rowsPerPageMealkit);
          if (Array.isArray(response.content)) {
            setMealkit(response.content);
            setTotalPages(response.total_page || 1);
          } else {
            setMealkit([]);
            setTotalPages(1);
          }
        } catch (error) {
          setMealkit([]);
          setTotalPages(1);
        }
      }
    };
    getAllMealkit();
  }, [jwtToken, pageMealkit, rowsPerPageMealkit]);

  const CostPrice = ({ title }) => (
    <MDBox lineHeight={1} textAlign="left" fontSize="0.8em">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
    </MDBox>
  );

  const Name = ({ name }) => (
    <MDBox lineHeight={1} textAlign="left" fontSize="0.8em">
      <MDTypography display="block" variant="caption" fontWeight="medium">
        {name}
      </MDTypography>
    </MDBox>
  );

  const columns = [
    { Header: "image", accessor: "image", width: "5%", align: "left" },
    { Header: "name of mealkit", accessor: "name", width: "25%", align: "left" },
    { Header: "cost price", accessor: "cost_price", align: "center" },
    { Header: "quantity", accessor: "quantity", align: "center" },
    { Header: "type", accessor: "type", align: "center" },
    { Header: "status", accessor: "status", align: "center" },
    { Header: "view detail", accessor: "view", align: "center" },
    { Header: "history", accessor: "history", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const rows = mealkit?.map((item) => ({
    image: (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <Link to={`/mealkit_detail/${item.id}`}>
          <MDAvatar style={{ cursor: "pointer" }} src={item.image_url} size="sm" />
        </Link>
      </MDBox>
    ),
    name: <Name name={item.name} />,
    cost_price: <CostPrice title={`$${item.price}`} />,
    type: (
      <MDTypography variant="caption" fontWeight="medium" style={{ fontSize: "0.8em" }}>
        {item.type}
      </MDTypography>
    ),
    status: (
      <MDTypography variant="caption" fontWeight="medium" style={{ fontSize: "0.8em" }}>
        {item.status}
      </MDTypography>
    ),
    quantity: (
      <MDTypography variant="caption" fontWeight="medium" style={{ fontSize: "0.8em" }}>
        {item.available_quantity}
      </MDTypography>
    ),
    view: (
      <MDTypography variant="caption" fontWeight="medium" style={{ fontSize: "0.8em" }}>
        <Link to={`/mealkit_detail/${item.id}`}>
          <MDTypography
            component="button"
            variant="caption"
            color="white"
            fontWeight="medium"
            style={{
              backgroundColor: "#1976d2",
              fontSize: "0.9em",
              border: "none",
              borderRadius: "2px",
              padding: "5px 10px",
              cursor: "pointer",
            }}
          >
            View History
          </MDTypography>
        </Link>
      </MDTypography>
    ),
    history: (
      <MDTypography variant="caption" fontWeight="medium" style={{ fontSize: "0.8em" }}>
        <Link to={`/history_mealkit/${item.id}`}>
          <MDTypography
            component="button"
            variant="caption"
            color="white"
            fontWeight="medium"
            style={{
              backgroundColor: "#1976d2",
              fontSize: "0.9em",
              border: "none",
              borderRadius: "2px",
              padding: "5px 10px",
              cursor: "pointer",
            }}
          >
            View Detail
          </MDTypography>
        </Link>
      </MDTypography>
    ),
    action: (
      <MDBox display="flex" justifyContent="center" gap={1}>
        <Link to={`/edit_mealkit/${item.id}`} style={{ textDecoration: "none" }}>
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
      </MDBox>
    ),
  }));

  return { columns, rows, hasNextPageMealkit };
}
