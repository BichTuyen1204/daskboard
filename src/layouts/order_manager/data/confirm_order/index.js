import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import confirmOrder from "layouts/order_manager/data/confirm_order/confirmOrder";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Icon, IconButton, Typography } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

function Order() {
  const navigate = useNavigate();

  // On Confirm
  const [pageOnConfirm, setPageOnConfirm] = useState(1);
  const rowsPerPageOnConfirm = 6;
  const {
    columns: pColumns,
    rows: pRows,
    hasNextPageOnConfirm,
  } = confirmOrder(pageOnConfirm, rowsPerPageOnConfirm);

  const handlePrevPageOnConfirm = () => {
    if (pageOnConfirm > 1) {
      setPageOnConfirm((prev) => prev - 1);
    }
  };

  const handleNextPageOnConfirm = () => {
    if (hasNextPageOnConfirm) {
      setPageOnConfirm((prev) => prev + 1);
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
          {/* On Confirm */}
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                bgColor="green"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Confirmed Order
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
                  table={{ columns: pColumns, rows: pRows }}
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
                  onClick={handlePrevPageOnConfirm}
                  disabled={pageOnConfirm === 1}
                  sx={{
                    bgcolor: "black",
                    fontSize: "0.6em",
                    color: "white",
                    width: "30px",
                    height: "30px",
                    minWidth: "30px",
                    borderRadius: "50%",
                    "&:hover, &:focus": { bgcolor: "#333 !important", color: "white !important" },
                    opacity: pageOnConfirm === 1 ? 0.3 : 1,
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
                    bgcolor: "green",
                  }}
                >
                  <Typography color="white" fontWeight="bold">
                    <p style={{ fontSize: "0.7em", color: "white" }}>{pageOnConfirm}</p>
                  </Typography>
                </Box>

                {/* Nút Next */}
                <IconButton
                  onClick={handleNextPageOnConfirm}
                  disabled={!hasNextPageOnConfirm}
                  sx={{
                    bgcolor: "black",
                    fontSize: "0.6em",
                    color: "white",
                    width: "30px",
                    height: "30px",
                    minWidth: "30px",
                    borderRadius: "50%",
                    "&:hover, &:focus": { bgcolor: "#333 !important", color: "white !important" },
                    opacity: hasNextPageOnConfirm ? 1 : 0.3,
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
