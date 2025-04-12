import React from "react";
import {
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Tooltip,
} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { CheckCircleOutline, HourglassEmpty, MonetizationOn } from "@mui/icons-material";

const dummyOrders = [
  {
    id: "DH001",
    customer: "Nguyễn Văn A",
    date: "2025-04-11T08:30:00",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    total: 320000,
    paid: true,
    confirmed: false,
  },
  {
    id: "DH002",
    customer: "Trần Thị B",
    date: "2025-04-10T14:20:00",
    address: "45 Đường XYZ, Quận 3, TP.HCM",
    total: 210000,
    paid: false,
    confirmed: true,
  },
];

function OrderWaitingForShipper() {
  return (
    <DashboardLayout>
      <Box pt={4} px={3}>
        <Typography variant="h4" fontWeight={700} gutterBottom color="primary">
          📦 Danh sách đơn hàng chờ shipper xác nhận
        </Typography>

        <Card elevation={6} sx={{ borderRadius: 4, p: 3, backgroundColor: "#ffffff" }}>
          <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
            <Table sx={{ minWidth: 1000 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                  <TableCell align="center">
                    <Typography fontWeight={600}>Mã đơn</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography fontWeight={600}>Khách hàng</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography fontWeight={600}>Ngày đặt</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography fontWeight={600}>Địa chỉ</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography fontWeight={600}>Tổng tiền</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography fontWeight={600}>Thanh toán</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography fontWeight={600}>Trạng thái</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dummyOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    hover
                    sx={{
                      transition: "0.3s",
                      "&:hover": { backgroundColor: "#f9f9f9" },
                    }}
                  >
                    <TableCell align="center">{order.id}</TableCell>
                    <TableCell align="center">{order.customer}</TableCell>
                    <TableCell align="center">
                      {new Date(order.date).toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell align="center">{order.address}</TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 700,
                        color: "#388e3c",
                        fontSize: "0.95rem",
                      }}
                    >
                      {order.total.toLocaleString("vi-VN")}₫
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title={order.paid ? "Khách đã thanh toán" : "Khách chưa thanh toán"}>
                        <Chip
                          icon={<MonetizationOn fontSize="small" />}
                          label={order.paid ? "Đã thanh toán" : "Chưa thanh toán"}
                          color={order.paid ? "success" : "warning"}
                          variant="outlined"
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      {order.confirmed ? (
                        <Chip
                          icon={<CheckCircleOutline fontSize="small" />}
                          label="Đã xác nhận"
                          color="success"
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      ) : (
                        <Chip
                          icon={<HourglassEmpty fontSize="small" />}
                          label="Chờ xác nhận"
                          color="warning"
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>
    </DashboardLayout>
  );
}

export default OrderWaitingForShipper;
