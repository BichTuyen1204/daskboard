import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import Projects from "layouts/dashboard/components/Projects";
import ExpectedProduct from "./components/ExpectedProduct";
import AccountService from "api/AccountService";
import { Box, Typography } from "@mui/material";
import { RestaurantMenu } from "@mui/icons-material";
function Dashboard() {
  const navigate = useNavigate();
  const [account, setAccount] = useState("");
  const [customer, setCustomer] = useState([]);
  const jwtToken = sessionStorage.getItem("jwtToken");

  useEffect(() => {
    if (!jwtToken) {
      alert("Your session has expired. Please log in again.");
      navigate("/sign-in");
    }
  }, [jwtToken, navigate]);

  // useEffect(() => {
  //   const getAllCustomer = async () => {
  //     if (jwtToken) {
  //       try {
  //         const response = await AccountService.getAllCustomer(jwtToken);
  //         if (Array.isArray(response)) {
  //           setCustomer(response);
  //         } else {
  //           setCustomer([]);
  //         }
  //       } catch (error) {
  //         setCustomer([]);
  //       }
  //     }
  //   };
  //   getAllCustomer();
  // }, [jwtToken]);

  useEffect(() => {
    const getProfile = async () => {
      if (!jwtToken) {
        return;
      } else {
        try {
          const response = await AccountService.getProfile(jwtToken);
          setAccount(response);
        } catch (error) {}
      }
    };
    getProfile();
  }, [jwtToken]);

  // useEffect(() => {
  //   if (account?.type === null) {
  //     alert("Your session has expired. Please log in again.");
  //     navigate("/logout", { replace: true });
  //   }
  // }, [account, navigate]);

  return account.type === 2 ? (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{
        background: "linear-gradient(135deg, #A2D5F2 20%, #89CFF0 80%)", // Màu xanh nhẹ nhàng
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Hiệu ứng food paint */}
      <Box
        sx={{
          position: "absolute",
          width: "250px",
          height: "250px",
          background: "rgba(132, 214, 255, 0.98)",
          borderRadius: "50%",
          top: "10%",
          left: "10%",
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

      {/* Thêm icon food trải random */}
      <Box sx={{ position: "absolute", top: "20%", left: "55%", fontSize: "50px" }}>
        <RestaurantMenu />
      </Box>

      {/* Hiệu ứng thẻ glassmorphism */}
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
          maxWidth: "90%",
          position: "absolute",
          left: "55%",
          transform: "translateX(-45%)",
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
  ) : (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Order Confirm"
                count={281}
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Profit Today"
                count="$2,300"
                percentage={{
                  color: "success",
                  amount: "+3%",
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Revenue Today"
                count="$3,400"
                percentage={{
                  color: "success",
                  amount: "+1%",
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Followers"
                count={customer ? customer.length : 0}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>

        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            {/* Revenue days start */}
            <Grid item xs={12} md={12} lg={12}>
              <MDBox mb={3}>
                <ReportsBarChart />
              </MDBox>
            </Grid>
            {/* Revenue days end */}

            {/* Revenue months start */}
            <Grid item xs={12} md={12} lg={12}>
              <MDBox mb={3}>
                <ReportsLineChart />
              </MDBox>
            </Grid>
            {/* Revenue months end */}
          </Grid>
        </MDBox>

        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <Projects />
            </Grid>
          </Grid>
        </MDBox>

        <MDBox>
          <Grid container spacing={3} mt={1}>
            <Grid item xs={12} md={12} lg={12}>
              <ExpectedProduct />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
