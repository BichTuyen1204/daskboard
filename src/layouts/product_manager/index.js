import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import authorsTableData from "layouts/product_manager/data/authorsTableData";
import { Box, Button, Icon, IconButton, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

function Product() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [selectedType, setSelectedType] = useState("ALL");
  const { columns, rows, totalPages } = authorsTableData(page, rowsPerPage, selectedType);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
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
                  Ingredient list
                </MDTypography>
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
                    variant={selectedType === "VEG" ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => setSelectedType("VEG")}
                    sx={{
                      color: selectedType === "VEG" ? "rgb(255, 255, 255)" : "rgb(70, 70, 70)",
                      borderColor: selectedType === "VEG" ? "transparent" : "rgb(34, 178, 255)",
                      "&:hover": {
                        color: "black !important",
                        borderColor: "rgba(0, 0, 255, 0.5)",
                        backgroundColor: "rgba(168, 227, 255, 0.2)",
                      },
                    }}
                  >
                    Vegetable
                  </Button>

                  <Button
                    variant={selectedType === "MEAT" ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => setSelectedType("MEAT")}
                    sx={{
                      color: selectedType === "MEAT" ? "rgb(255, 255, 255)" : "rgb(70, 70, 70)",
                      borderColor: selectedType === "MEAT" ? "transparent" : "rgb(34, 178, 255)",
                      "&:hover": {
                        color: "black !important",
                        borderColor: "rgba(0, 0, 255, 0.5)",
                        backgroundColor: "rgba(168, 227, 255, 0.2)",
                      },
                    }}
                  >
                    Meat
                  </Button>

                  <Button
                    variant={selectedType === "SS" ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => setSelectedType("SS")}
                    sx={{
                      color: selectedType === "SS" ? "rgb(255, 255, 255)" : "rgb(70, 70, 70)",
                      borderColor: selectedType === "SS" ? "transparent" : "rgb(34, 178, 255)",
                      "&:hover": {
                        color: "black !important",
                        borderColor: "rgba(0, 0, 255, 0.5)",
                        backgroundColor: "rgba(168, 227, 255, 0.2)",
                      },
                    }}
                  >
                    Season
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
                sx={{ marginRight: "60px" }}
              >
                <IconButton
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  sx={{
                    bgcolor: "black",
                    fontSize: "0.6em",
                    color: "white",
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    "&:hover, &:focus": { bgcolor: "#333 !important", color: "white !important" },
                    opacity: page === 1 ? 0.3 : 1,
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
                    <p style={{ fontSize: "14px", color: "white" }}>{page}</p>
                  </Typography>
                </Box>

                <IconButton
                  onClick={handleNextPage}
                  disabled={page >= totalPages}
                  sx={{
                    bgcolor: "black",
                    fontSize: "0.6em",
                    color: "white",
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    "&:hover, &:focus": { bgcolor: "#333 !important", color: "white !important" },
                    opacity: page >= totalPages ? 0.3 : 1,
                  }}
                >
                  <ArrowForwardIos sx={{ fontSize: "14px" }} />
                </IconButton>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Link to="/add_product">
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

export default Product;
