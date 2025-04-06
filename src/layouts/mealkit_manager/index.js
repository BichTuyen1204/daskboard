import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import data_mealkit from "layouts/mealkit_manager/data/data_mealkit";
import { Box, Icon, IconButton, Typography, TextField, InputAdornment } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowBackIos, ArrowForwardIos, Search } from "@mui/icons-material";

function Mealkit() {
  const [pageMealkit, setPageMealkit] = useState(1);
  const rowsPerPageMealkit = 7;
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const { columns, rows, hasNextPageMealkit } = data_mealkit(
    pageMealkit,
    rowsPerPageMealkit,
    debouncedSearchQuery
  );

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPageMealkit(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePrevPageMealkit = () => {
    if (pageMealkit > 1) {
      setPageMealkit((prev) => prev - 1);
    }
  };

  const handleNextPageMealkit = () => {
    if (hasNextPageMealkit) {
      setPageMealkit((prev) => prev + 1);
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
                  Mealkit list
                </MDTypography>
                <Box
                  sx={{
                    width: { xs: "100%", sm: "50%", md: "40%", lg: "30%" },
                    transition: "width 0.3s ease",
                  }}
                >
                  <TextField
                    size="small"
                    placeholder="Search mealkits"
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
                  onClick={handlePrevPageMealkit}
                  disabled={pageMealkit === 1}
                  sx={{
                    bgcolor: "black",
                    fontSize: "0.6em",
                    color: "white",
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    "&:hover, &:focus": { bgcolor: "#333 !important", color: "white !important" },
                    opacity: pageMealkit === 1 ? 0.3 : 1,
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
                    <p style={{ fontSize: "14px", color: "white" }}>{pageMealkit}</p>
                  </Typography>
                </Box>

                <IconButton
                  onClick={handleNextPageMealkit}
                  disabled={!hasNextPageMealkit}
                  sx={{
                    bgcolor: "black",
                    fontSize: "0.6em",
                    color: "white",
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    "&:hover, &:focus": { bgcolor: "#333 !important", color: "white !important" },
                    opacity: hasNextPageMealkit ? 1 : 0.3,
                  }}
                >
                  <ArrowForwardIos sx={{ fontSize: "14px" }} />
                </IconButton>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Link to="/add_mealkit">
        <MDBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="3.25rem"
          height="3.25rem"
          bgColor="white"
          shadow="sm"
          borderRadius="50%"
          position="fixed"
          right="2rem"
          bottom="2rem"
          zIndex={99}
          color="dark"
          sx={{ cursor: "pointer" }}
        >
          <Icon fontSize="small" color="inherit">
            add
          </Icon>
        </MDBox>
      </Link>
    </DashboardLayout>
  );
}

export default Mealkit;
