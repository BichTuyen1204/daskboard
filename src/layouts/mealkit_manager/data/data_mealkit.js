/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import { Icon } from "@mui/material";
import { Link } from "react-router-dom";
import ProductService from "api/ProductService";

export default function DataTable() {
  const [mealkit, setMealkit] = useState([]);
  const jwtToken = sessionStorage.getItem("jwtToken");

  useEffect(() => {
    const getAllMealkit = async () => {
      if (jwtToken) {
        try {
          const response = await ProductService.allMealkit(jwtToken);
          setMealkit(response);
        } catch (error) {
          console.error("Can't access the server", error);
        }
      }
    };

    getAllMealkit();
  }, [jwtToken]);

  const mapTypeToLabel = (type) => {
    const typeMap = {
      VEG: "Vegetable",
      MEAT: "Meat",
      MK: "Mealkit",
      SS: "Season",
    };
    return typeMap[type] || type;
  };

  const mapStatus = (typeStatus) => {
    const typeMapStatus = {
      IN_STOCK: "In stock",
      OUT_OF_STOCK: "Out of stock",
      NO_LONGER_IN_SALE: "No longer in sale",
    };
    return typeMapStatus[typeStatus] || typeStatus;
  };
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
    { Header: "history", accessor: "history", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const rows = mealkit.map((item) => ({
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
        {mapTypeToLabel(item.type)}
      </MDTypography>
    ),
    status: (
      <MDTypography variant="caption" fontWeight="medium" style={{ fontSize: "0.8em" }}>
        {mapStatus(item.status)}
      </MDTypography>
    ),
    quantity: (
      <MDTypography variant="caption" fontWeight="medium" style={{ fontSize: "0.8em" }}>
        {item.available_quantity}
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
            View history
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

  return { columns, rows };
}
