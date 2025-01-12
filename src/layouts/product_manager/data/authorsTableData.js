/* eslint-disable react/prop-types */
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import beef from "assets/images/beef.jpg";
import { Icon } from "@mui/material";

export default function data() {
  const Author = ({ image }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} size="sm" />
    </MDBox>
  );

  const CostPrice = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left" fontSize="0.8em">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  const Name = ({ name }) => (
    <MDBox lineHeight={1} textAlign="left" fontSize="0.8em">
      <MDTypography display="block" variant="caption" fontWeight="medium">
        {name}
      </MDTypography>
    </MDBox>
  );

  return {
    columns: [
      { Header: "image", accessor: "image", width: "5%", align: "left" },
      { Header: "name of product", accessor: "name", width: "25%", align: "left" },
      { Header: "cost price", accessor: "cost_price", align: "center" },
      { Header: "selling price", accessor: "selling_price", align: "center" },
      { Header: "quantity", accessor: "status", align: "center" },
      { Header: "expiry date", accessor: "expiry_date", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    rows: [
      {
        image: <Author image={beef} />,
        name: <Name name="Beef 500g" />,
        cost_price: <CostPrice title="Manager" />,
        status: (
          // <MDBox ml={-1}>
          //   <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
          // </MDBox>
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
            style={{
              fontSize: "0.8em",
            }}
          >
            255
          </MDTypography>
        ),
        expiry_date: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
            style={{
              fontSize: "0.8em",
            }}
          >
            23/04/18
          </MDTypography>
        ),
        selling_price: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
            style={{
              fontSize: "0.8em",
            }}
          >
            $500
          </MDTypography>
        ),
        action: (
          <MDBox display="flex" justifyContent="center" gap={1}>
            {/* Nút Edit */}
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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#f0f4ff")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "white")}
            >
              <Icon fontSize="small" color="inherit" style={{ marginRight: "5px" }}>
                edit
              </Icon>
            </MDTypography>
            {/* Nút Delete */}
            <MDTypography
              component="button"
              variant="caption"
              fontWeight="medium"
              style={{
                backgroundColor: "white",
                color: "#d32f2f",
                fontSize: "0.8em",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#ffe6e6")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "white")}
            >
              <Icon fontSize="small" color="inherit" style={{ marginRight: "5px" }}>
                delete
              </Icon>
            </MDTypography>
          </MDBox>
        ),
      },
    ],
  };
}
