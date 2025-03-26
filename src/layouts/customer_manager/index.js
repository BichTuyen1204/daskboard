import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import authorsTableData from "layouts/customer_manager/data/authorsTableData";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";

function Customer() {
  const [pageCustomer, setPageCustomer] = useState(1);
  const rowsPerPageCustomer = 7;
  const navigate = useNavigate();
  const { columns, rows, hasNextPageCustomer } = authorsTableData(
    pageCustomer,
    rowsPerPageCustomer
  );

  const handlePrevPageCustomer = () => {
    if (pageCustomer > 1) {
      setPageCustomer((prev) => prev - 1);
    }
  };

  const handleNextPageCustomer = () => {
    if (hasNextPageCustomer) {
      setPageCustomer((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      navigate("/sign-in", { replace: true });
    }
  }, [navigate]);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Customer list
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
              <MDBox
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
                mt={2}
                pb={2}
                mx={5}
              >
                <IconButton
                  onClick={handlePrevPageCustomer}
                  disabled={pageCustomer === 1}
                  sx={{
                    bgcolor: "black",
                    fontSize: "0.6em",
                    color: "white",
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    "&:hover, &:focus": { bgcolor: "#333 !important", color: "white !important" },
                    opacity: pageCustomer === 1 ? 0.3 : 1,
                  }}
                >
                  <ArrowBackIos sx={{ fontSize: "14px" }} />
                </IconButton>

                <Box
                  sx={{
                    mx: 2,
                    width: 30,
                    height: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    bgcolor: "#1b98e0",
                  }}
                >
                  <Typography color="white" fontWeight="bold">
                    <p style={{ fontSize: "14px", color: "white" }}>{pageCustomer}</p>
                  </Typography>
                </Box>

                <IconButton
                  onClick={handleNextPageCustomer}
                  disabled={!hasNextPageCustomer}
                  sx={{
                    bgcolor: "black",
                    fontSize: "0.6em",
                    color: "white",
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    "&:hover, &:focus": { bgcolor: "#333 !important", color: "white !important" },
                    opacity: hasNextPageCustomer ? 0.3 : 1,
                  }}
                >
                  <ArrowForwardIos sx={{ fontSize: "14px" }} />
                </IconButton>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Customer;
