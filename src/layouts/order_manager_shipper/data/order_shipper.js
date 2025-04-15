import React, { useEffect, useState } from "react";
import { Box, Card, Grid, Icon, IconButton, Typography } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos, Search } from "@mui/icons-material";
import { useParams, useNavigate, Link } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import ShipperService from "api/ShipperService";

function OrderShipper() {
  const navigate = useNavigate();
  const { id: status } = useParams();
  const [page, setPage] = useState(1);
  const rowsPerPage = 30;
  const [data, setData] = useState({ content: [], total_page: 1 });

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      navigate("/sign-in", { replace: true });
    }
  }, [navigate]);

  const getSumOrderShipper = async (status, page, rowsPerPage) => {
    try {
      const result = await ShipperService.getSumOrderShipper(status, page, rowsPerPage);
      return result;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    if (!status) return;
    const fetchData = async () => {
      const result = await getSumOrderShipper(status, page - 1, rowsPerPage);
      if (result) setData(result);
    };
    fetchData();
  }, [status, page, rowsPerPage]);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < data.total_page) setPage(page + 1);
  };

  const columns = [
    { Header: "ID", accessor: "id", align: "left" },
    { Header: "Confirmed At", accessor: "confirm_date", align: "center" },
    { Header: "Shipping At", accessor: "shipping_date", align: "center" },
    { Header: "Processed By", accessor: "process_by", align: "center" },
  ];

  const rows = (data.content || []).map((item) => ({
    id: item.id,
    confirm_date: new Date(item.confirm_date).toLocaleString(),
    shipping_date: new Date(item.shipping_date).toLocaleString(),
    process_by: item.process_by,
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={1} pb={3}>
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
                  Orders with status: {status}
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
                <IconButton onClick={handlePrevPage} disabled={page === 1}>
                  <ArrowBackIos sx={{ fontSize: "14px" }} />
                </IconButton>

                <Box mx={2}>
                  <Typography>{page}</Typography>
                </Box>

                <IconButton onClick={handleNextPage} disabled={page >= data.total_page}>
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

export default OrderShipper;
