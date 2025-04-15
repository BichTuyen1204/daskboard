import React from "react";
import { Container, Grid, Card, Typography } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import { Link } from "react-router-dom";

const squareData = [
  { id: "AWAIT", label: "Await", color: "#2196f3" },
  { id: "TIMEOUT", label: "Time out", color: "#4caf50" },
  { id: "ACCEPTED", label: "Accepted", color: "#fbc02d" },
  { id: "REJECTED", label: "Rejected", color: "#ec5228" },
  { id: "DELIVERING", label: "Shipping", color: "#3f7d58" },
  { id: "DELIVERED", label: "Shipped", color: "#074799" },
  { id: "CANCELLED", label: "Cancelled", color: "#f44336" },
];

function OrderManagerShipper() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Container maxWidth="lg">
        <MDBox py={4}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Order Manager
          </Typography>

          <Grid container spacing={3}>
            {squareData.map((square) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={square.id}>
                <Link to={`/order_shipper/${square.id}`}>
                  <Card
                    sx={{
                      height: 120,
                      backgroundColor: square.color,
                      borderRadius: 2,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      color: "white",
                      transition: "transform 0.2s, box-shadow 0.3s",
                      boxShadow: 3,
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <Typography variant="h6" fontWeight="medium">
                      <span style={{ color: "white" }}>{square.label}</span>
                    </Typography>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        </MDBox>
      </Container>
    </DashboardLayout>
  );
}

export default OrderManagerShipper;
