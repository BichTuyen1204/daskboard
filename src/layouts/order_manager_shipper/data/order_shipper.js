import React, { useEffect, useState } from "react";
import { Box, Card, Grid, Icon, IconButton, Typography } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import ShipperService from "api/ShipperService";
import AccountService from "api/AccountService"; // Giả sử có service này để lấy profile

function OrderShipper() {
  const navigate = useNavigate();
  const { id: status } = useParams();
  const [userName, setUserName] = useState(""); // Đặt mặc định là chuỗi rỗng
  const [page, setPage] = useState(1);
  const rowsPerPage = 30;
  const [data, setData] = useState({ content: [], total_page: 1 });
  const jwtToken = sessionStorage.getItem("jwtToken");

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      navigate("/sign-in", { replace: true });
    }
  }, [navigate]);

  // Hàm lấy dữ liệu đơn hàng theo trạng thái
  const getSumOrderShipper = async (status, page, rowsPerPage) => {
    try {
      const result = await ShipperService.getSumOrderShipper(status, page, rowsPerPage);
      return result;
    } catch (error) {
      return null;
    }
  };

  // Hàm lấy thông tin profile của người dùng (userName)
  useEffect(() => {
    const getProfile = async () => {
      try {
        const result = await AccountService.getProfile(jwtToken);
        setUserName(result.username); // Cập nhật userName khi lấy được dữ liệu
        return result;
      } catch (error) {
        return null;
      }
    };
    getProfile();
  }, [jwtToken]);

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
    { Header: "ID of order", accessor: "id", align: "left" },
    { Header: "Confirmed At", accessor: "confirm_date", align: "left" },
    { Header: "Shipping At", accessor: "shipping_date", align: "left" },
    { Header: "Processed By", accessor: "process_by", align: "left" },
    { Header: "Shipping By", accessor: "shipping_by", align: "left" },
  ];

  const rows = (data.content || []).map((item) => {
    const confirmDate = new Date(item.confirm_date);
    confirmDate.setHours(confirmDate.getHours() + 7);

    const shippingDate = new Date(item.shipping_date);
    shippingDate.setHours(shippingDate.getHours() + 7);

    const redText = (text) => (
      <span style={{ color: "black", fontWeight: "500", fontSize: "0.8em" }}>{text}</span>
    );

    return {
      id: redText(item.id),
      confirm_date: redText(confirmDate.toLocaleString("vi-VN")),
      shipping_date: redText(shippingDate.toLocaleString("vi-VN")),
      process_by: redText(item.process_by),
      shipping_by: redText(userName),
    };
  });

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
