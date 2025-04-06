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
import { ArrowBackIos, ArrowForwardIos, Search } from "@mui/icons-material";
import { Box, IconButton, Typography, TextField, InputAdornment } from "@mui/material";

function Customer() {
  const [pageCustomer, setPageCustomer] = useState(1);
  const rowsPerPageCustomer = 7;
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const { columns, rows, hasNextPageCustomer } = authorsTableData(
    pageCustomer,
    rowsPerPageCustomer,
    debouncedSearchQuery
  );

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPageCustomer(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

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
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexDirection={{ xs: "column", sm: "row" }}
                gap={{ xs: 2, sm: 0 }}
              >
                <MDTypography variant="h6" color="white">
                  Customer list
                </MDTypography>
                <Box
                  sx={{
                    width: { xs: "100%", sm: "50%", md: "40%", lg: "30%" },
                    transition: "width 0.3s ease",
                  }}
                >
                  <TextField
                    size="small"
                    placeholder="Search customers"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    fullWidth
                    style={{
                      backgroundColor: "white",
                      borderRadius: 1,
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { border: "none" },
                      },
                      "& .MuiInputBase-input": {
                        fontSize: { xs: "0.85rem", sm: "0.875rem" },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
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
                    opacity: hasNextPageCustomer ? 1 : 0.3,
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
