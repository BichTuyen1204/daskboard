import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import DataShipper from "layouts/dashboard/order_waiting_shipper/data";
import Projects from "layouts/dashboard/components/Projects";
import ExpectedProduct from "./components/ExpectedProduct";
import AccountService from "api/AccountService";
import { Box, Button, Typography } from "@mui/material";
import { RestaurantMenu } from "@mui/icons-material";
import PredictedProducts from "./components/PredictedProducts";

function Dashboard() {
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const jwtToken = sessionStorage.getItem("jwtToken");

  useEffect(() => {
    if (!jwtToken) {
      navigate("/sign-in", { replace: true });
    }
  }, [jwtToken, navigate]);

  useEffect(() => {
    const getProfile = async () => {
      if (!jwtToken) return;
      try {
        const response = await AccountService.getProfile(jwtToken);
        if (response) {
          setAccount(response);
        } else {
          setAccount(null);
        }
      } catch (error) {
        setAccount(null);
      }
    };

    getProfile();
  }, [jwtToken]);

  useEffect(() => {
    if (account !== null && account?.type == null) {
      alert("Your session has expired. Please log in again.");
      navigate("/sign-in", { replace: true });
    }
  }, [account, navigate]);
  if (!jwtToken || account === null) {
    return null;
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {account.type === 2 ? (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="95vh"
          borderRadius="15px"
          sx={{
            background: "linear-gradient(135deg, #A2D5F2 20%, #89CFF0 80%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: "250px",
              height: "250px",
              background: "rgba(132, 214, 255, 0.98)",
              borderRadius: "50%",
              top: "10%",
              left: "0%",
              filter: "blur(70px)",
              transform: "rotate(20deg)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              width: "180px",
              height: "180px",
              background: "rgba(46, 178, 254, 0)",
              borderRadius: "50%",
              bottom: "15%",
              right: "15%",
              filter: "blur(50px)",
              transform: "rotate(-15deg)",
            }}
          />

          {/* Icon món ăn */}
          <Box sx={{ position: "absolute", top: "20%", left: "47%", fontSize: "50px" }}>
            <RestaurantMenu />
          </Box>

          <Box
            sx={{
              top: "30%",
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(15px)",
              padding: "40px 20px",
              borderRadius: "20px",
              boxShadow: "0px 12px 30px rgba(0, 0, 0, 0.15)",
              textAlign: "center",
              color: "white",
              maxWidth: "100%",
              position: "absolute",
              left: "45%",
              transform: "translateX(-41%)",
            }}
          >
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              WELCOME TO CULINARY CONNECT MANAGE
            </Typography>

            <Typography variant="h5" fontStyle="italic">
              Hi {account.username} 👋
            </Typography>
          </Box>
        </Box>
      ) : account.type === 3 ? (
        <Box
          sx={{
            height: "100vh",
            width: "100%",
            background: "linear-gradient(135deg, #A2D5F2 20%, #89CFF0 80%)",
            borderRadius: "5px",
            overflowY: "auto",
            paddingTop: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <DataShipper />
        </Box>
      ) : (
        <>
          <MDBox py={3}>
            <Grid container spacing={3}></Grid>

            <MDBox mt={4.5}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <MDBox mb={3}>
                    <ReportsBarChart />
                  </MDBox>
                </Grid>

                <Grid item xs={12}>
                  <MDBox mb={3}>
                    <ReportsLineChart />
                  </MDBox>
                </Grid>
              </Grid>
            </MDBox>

            <MDBox>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Projects />
                </Grid>
              </Grid>
            </MDBox>

            <MDBox>
              <Grid container spacing={3} mt={1}>
                <Grid item xs={12}>
                  <ExpectedProduct />
                </Grid>
              </Grid>
            </MDBox>

            <MDBox>
              <Grid container spacing={3} mt={1}>
                <Grid item xs={12}>
                  <PredictedProducts />
                </Grid>
              </Grid>
            </MDBox>
          </MDBox>
          <Footer />
        </>
      )}
    </DashboardLayout>
  );
}

export default Dashboard;
