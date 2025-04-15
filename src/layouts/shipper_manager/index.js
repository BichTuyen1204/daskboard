import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import authorsTableData from "layouts/shipper_manager/data/data_shipper";
import {
  Box,
  Icon,
  IconButton,
  Typography,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowBackIos, ArrowForwardIos, Search } from "@mui/icons-material";

function Shipper() {
  const navigate = useNavigate();
  const [pageShipper, setPageShipper] = useState(1);
  const rowsPerPageShipper = 50;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const { columns, rows, hasNextPageShipper } = authorsTableData(
    pageShipper,
    selectedType,
    rowsPerPageShipper,
    debouncedSearchQuery
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPageShipper(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePrevPageShipper = () => {
    if (pageShipper > 1) {
      setPageShipper((prev) => prev - 1);
    }
  };

  const handleNextPageShipper = () => {
    if (hasNextPageShipper) {
      setPageShipper((prev) => prev + 1);
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
                  Shipper List
                </MDTypography>

                <Box
                  sx={{
                    width: { xs: "100%", sm: "50%", md: "40%", lg: "30%" },
                    transition: "width 0.3s ease",
                  }}
                >
                  <TextField
                    size="small"
                    placeholder="Search shippers"
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

              <MDBox mx={3} mt={2}>
                <Box display="flex" justifyContent="space-between">
                  <Button
                    variant={selectedType === "ALL" ? "contained" : "outlined"}
                    onClick={() => setSelectedType("ALL")}
                    sx={{
                      color: selectedType === "ALL" ? "rgb(255, 255, 255)" : "rgb(70, 70, 70)",
                      borderColor: selectedType === "ALL" ? "transparent" : "rgb(34, 178, 255)",
                      "&:hover": {
                        color: "black !important",
                        borderColor: "rgba(0, 0, 255, 0.5)",
                        backgroundColor: "rgba(168, 227, 255, 0.2)",
                      },
                    }}
                  >
                    All
                  </Button>

                  <Button
                    variant={selectedType === "ACCEPTED" ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => setSelectedType("ACCEPTED")}
                    sx={{
                      color: selectedType === "ACCEPTED" ? "rgb(255, 255, 255)" : "rgb(70, 70, 70)",
                      borderColor:
                        selectedType === "ACCEPTED" ? "transparent" : "rgb(34, 178, 255)",
                      "&:hover": {
                        color: "black !important",
                        borderColor: "rgba(0, 0, 255, 0.5)",
                        backgroundColor: "rgba(168, 227, 255, 0.2)",
                      },
                    }}
                  >
                    ACCEPTED
                  </Button>

                  <Button
                    variant={selectedType === "REJECTED" ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => setSelectedType("REJECTED")}
                    sx={{
                      color: selectedType === "REJECTED" ? "rgb(255, 255, 255)" : "rgb(70, 70, 70)",
                      borderColor:
                        selectedType === "REJECTED" ? "transparent" : "rgb(34, 178, 255)",
                      "&:hover": {
                        color: "black !important",
                        borderColor: "rgba(0, 0, 255, 0.5)",
                        backgroundColor: "rgba(168, 227, 255, 0.2)",
                      },
                    }}
                  >
                    REJECTED
                  </Button>

                  <Button
                    variant={selectedType === "ON_SHIPPING" ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => setSelectedType("ON_SHIPPING")}
                    sx={{
                      color:
                        selectedType === "ON_SHIPPING" ? "rgb(255, 255, 255)" : "rgb(70, 70, 70)",
                      borderColor:
                        selectedType === "ON_SHIPPING" ? "transparent" : "rgb(34, 178, 255)",
                      "&:hover": {
                        color: "black !important",
                        borderColor: "rgba(0, 0, 255, 0.5)",
                        backgroundColor: "rgba(168, 227, 255, 0.2)",
                      },
                    }}
                  >
                    ON SHIPPING
                  </Button>

                  <Button
                    variant={selectedType === "DELIVERED" ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => setSelectedType("DELIVERED")}
                    sx={{
                      color:
                        selectedType === "DELIVERED" ? "rgb(255, 255, 255)" : "rgb(70, 70, 70)",
                      borderColor:
                        selectedType === "DELIVERED" ? "transparent" : "rgb(34, 178, 255)",
                      "&:hover": {
                        color: "black !important",
                        borderColor: "rgba(0, 0, 255, 0.5)",
                        backgroundColor: "rgba(168, 227, 255, 0.2)",
                      },
                    }}
                  >
                    DELIVERED
                  </Button>

                  <Button
                    variant={selectedType === "ASSIGN" ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => setSelectedType("ASSIGN")}
                    sx={{
                      color: selectedType === "ASSIGN" ? "rgb(255, 255, 255)" : "rgb(70, 70, 70)",
                      borderColor: selectedType === "ASSIGN" ? "transparent" : "rgb(34, 178, 255)",
                      "&:hover": {
                        color: "black !important",
                        borderColor: "rgba(0, 0, 255, 0.5)",
                        backgroundColor: "rgba(168, 227, 255, 0.2)",
                      },
                    }}
                  >
                    ASSIGN
                  </Button>

                  <Button
                    variant={selectedType === "IDLE" ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => setSelectedType("IDLE")}
                    sx={{
                      color: selectedType === "IDLE" ? "rgb(255, 255, 255)" : "rgb(70, 70, 70)",
                      borderColor: selectedType === "IDLE" ? "transparent" : "rgb(34, 178, 255)",
                      "&:hover": {
                        color: "black !important",
                        borderColor: "rgba(0, 0, 255, 0.5)",
                        backgroundColor: "rgba(168, 227, 255, 0.2)",
                      },
                    }}
                  >
                    IDLE
                  </Button>
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
                {/* Nút Previous */}
                <IconButton
                  onClick={handlePrevPageShipper}
                  disabled={pageShipper === 1}
                  sx={{
                    bgcolor: "black",
                    fontSize: "0.6em",
                    color: "white",
                    width: "30px",
                    height: "30px",
                    minWidth: "30px",
                    borderRadius: "50%",
                    "&:hover, &:focus": { bgcolor: "#333 !important", color: "white !important" },
                    opacity: pageShipper === 1 ? 0.3 : 1,
                  }}
                >
                  <ArrowBackIos sx={{ fontSize: "14px" }} />
                </IconButton>

                {/* Số trang */}
                <Box
                  sx={{
                    mx: 2,
                    width: 30,
                    height: 30,
                    display: "flex",
                    border: "1px solid white",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    bgcolor: "#1b98e0",
                  }}
                >
                  <Typography color="white" fontWeight="bold">
                    <p style={{ fontSize: "0.7em", color: "white" }}>{pageShipper}</p>
                  </Typography>
                </Box>

                {/* Nút Next */}
                <IconButton
                  onClick={handleNextPageShipper}
                  disabled={!hasNextPageShipper}
                  sx={{
                    bgcolor: "black",
                    fontSize: "0.6em",
                    color: "white",
                    width: "30px",
                    height: "30px",
                    minWidth: "30px",
                    borderRadius: "50%",
                    "&:hover, &:focus": { bgcolor: "#333 !important", color: "white !important" },
                    opacity: hasNextPageShipper ? 1 : 0.3,
                  }}
                >
                  <ArrowForwardIos sx={{ fontSize: "14px" }} />
                </IconButton>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      <Link to="/add_shipper">
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
            person_add
          </Icon>
        </MDBox>
      </Link>
    </DashboardLayout>
  );
}

export default Shipper;
