import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import shippingOrder from "layouts/order_manager/data/shipping_order/shippingOrder";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Icon, IconButton, Typography } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

function Order() {
  const navigate = useNavigate();

  // On Shipping
  const [pageOnShipping, setPageOnShipping] = useState(1);
  const rowsPerPageOnShipping = 50;
  const {
    columns: shippingColumns,
    rows: shippingRows,
    hasNextPageOnShipping,
  } = shippingOrder(pageOnShipping, rowsPerPageOnShipping);

  const handlePrevPageOnShipping = () => {
    if (pageOnShipping > 1) setPageOnShipping((prev) => prev - 1);
  };

  const handleNextPageOnShipping = () => {
    if (hasNextPageOnShipping) setPageOnShipping((prev) => prev + 1);
  };

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      navigate("/sign-in");
    }
  }, [navigate]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          {/* On Shipping */}
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                bgColor="#EC5228"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Shipping Order
                </MDTypography>
              </MDBox>
              <MDBox pt={2}>
                <Link
                  style={{ marginLeft: "15px" }}
                  to="/order"
                  onClick={() => {
                    setTimeout(() => {
                      window.location.reload();
                    }, 0);
                  }}
                >
                  <Icon sx={{ cursor: "pointer", "&:hover": { color: "gray" } }}>arrow_back</Icon>
                </Link>
                <DataTable
                  table={{ columns: shippingColumns, rows: shippingRows }}
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
                  onClick={handlePrevPageOnShipping}
                  disabled={pageOnShipping === 1}
                  sx={{
                    bgcolor: "black",
                    fontSize: "0.6em",
                    color: "white",
                    width: "30px",
                    height: "30px",
                    minWidth: "30px",
                    borderRadius: "50%",
                    "&:hover, &:focus": { bgcolor: "#333 !important", color: "white !important" },
                    opacity: pageOnShipping === 1 ? 0.3 : 1,
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
                    bgcolor: "#EC5228",
                  }}
                >
                  <Typography color="white" fontWeight="bold">
                    <p style={{ fontSize: "0.7em", color: "white" }}>{pageOnShipping}</p>
                  </Typography>
                </Box>

                {/* Nút Next */}
                <IconButton
                  onClick={handleNextPageOnShipping}
                  disabled={!hasNextPageOnShipping}
                  sx={{
                    bgcolor: "black",
                    fontSize: "0.6em",
                    color: "white",
                    width: "30px",
                    height: "30px",
                    minWidth: "30px",
                    borderRadius: "50%",
                    "&:hover, &:focus": { bgcolor: "#333 !important", color: "white !important" },
                    opacity: hasNextPageOnShipping ? 1 : 0.3,
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

export default Order;
