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
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import ExpectedProduct from "./components/ExpectedProduct";
import RevenueService from "api/RevenueService";

function Dashboard() {
  const [revenue7Days, setRevenue7Days] = useState([]);
  const [revenue6Months, setRevenue6Months] = useState([]);
  const { sales } = reportsLineChartData;
  const navigate = useNavigate();
  const jwtToken = sessionStorage.getItem("jwtToken");
  const [expected, setExpected] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      navigate("/sign-in", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const fetchRevenueData = async () => {
      if (!jwtToken) return;
      try {
        const response = await RevenueService.getAllDays();
        setRevenue7Days(response.revenue.last_7_days_revenue);
        console.log("Data 6 months:", response.revenue.last_6_months_revenue);
        setRevenue6Months(response.revenue.last_6_months_revenue);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };
    fetchRevenueData();
  }, [jwtToken]);

  const revenueChartData = {
    labels: revenue7Days.map((item) => item.date),
    datasets: [
      {
        label: "Revenue",
        data: revenue7Days.map((item) => item.revenue),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const revenueMonthData = {
    labels:
      Array.isArray(revenue6Months) && revenue6Months.length
        ? revenue6Months.map((item) => item.month)
        : ["No Data"],
    datasets: [
      {
        label: "Revenue",
        data:
          Array.isArray(revenue6Months) && revenue6Months.length
            ? revenue6Months.map((item) => item.revenue)
            : [0],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  useEffect(() => {
    const getPredictNextMonth = async () => {
      if (!jwtToken) return;
      try {
        const response = await RevenueService.getPredictNextMonth();
        setExpected(response);
      } catch (error) {
        console.error(error);
      }
    };
    getPredictNextMonth();
  }, [jwtToken]);

  return (
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
                count="+91"
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
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
                <ReportsLineChart
                  color="success"
                  title="Revenue 6 Months"
                  description="Revenue over the last 6 months"
                  des={
                    <>
                      {/* Sales are expected to reach (<strong>${expected.predicted_revenue}</strong>) */}
                      this month
                    </>
                  }
                  date="Updated just now"
                  chart={revenueMonthData}
                />
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
