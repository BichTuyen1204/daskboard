/* eslint-disable react/prop-types */
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import CouponService from "api/CouponService";
import { Box, Button, Icon, Modal, Typography } from "@mui/material";

export default function data() {
  const [open, setOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [coupon, setCoupon] = useState([]);
  const jwtToken = sessionStorage.getItem("jwtToken");
  const [popupDelete, setPopupDelete] = useState(false);

  // Hàm mở popup
  const openModal = (id) => {
    setSelectedItemId(id); // Lưu id của coupon
    setPopupDelete(true);
  };

  // Hàm hủy xóa
  const cancelDelete = () => {
    setPopupDelete(false);
  };

  // Xóa sản phẩm
  const deleteProduct = async (id) => {
    if (jwtToken) {
      try {
        await CouponService.deleteCoupon(id); // Truyền id vào đúng cách
        setCoupon((prevCoupons) => prevCoupons.filter((coupon) => coupon.id !== id)); // Cập nhật danh sách
        setPopupDelete(false);
      } catch (error) {
        console.error("Failed to delete coupon:", error.message);
      }
    }
  };

  useEffect(() => {
    const getAllCoupon = async () => {
      if (jwtToken) {
        try {
          const response = await CouponService.getAllCoupon(jwtToken);
          setCoupon(response);
        } catch (error) {
          console.error("Can't access the server", error);
        }
      }
    };
    getAllCoupon();
  }, [jwtToken]);

  const Creation_date = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left" fontSize="0.8em">
      <MDTypography display="block" variant="caption" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  const UsageLeft = ({ usage_left }) => (
    <MDBox lineHeight={1} textAlign="left" fontSize="0.8em">
      <MDTypography display="block" variant="caption" fontWeight="medium">
        {usage_left}
      </MDTypography>
    </MDBox>
  );

  const columns = [
    { Header: "id", accessor: "id", width: "5%", align: "left" },
    { Header: "Usage left", accessor: "usage_left", width: "20%", align: "center" },
    { Header: "creation date", accessor: "creation_date", align: "center" },
    { Header: "discount percentage", accessor: "discount_percentage", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const rows = coupon.map((item) => ({
    id: (
      <MDTypography
        component="a"
        href="#"
        variant="caption"
        fontWeight="medium"
        style={{
          fontSize: "0.8em",
        }}
      >
        {item.id}
      </MDTypography>
    ),
    usage_left: <UsageLeft usage_left={item.usage_left === -1 ? 0 : item.usage_left} />,
    creation_date: <Creation_date title={item.expire_time} />,
    discount_percentage: (
      <MDTypography
        component="a"
        href="#"
        variant="caption"
        fontWeight="medium"
        style={{
          fontSize: "0.8em",
        }}
      >
        {item.sale_percent}
      </MDTypography>
    ),
    expiry_date: (
      <MDTypography
        component="a"
        href="#"
        variant="caption"
        fontWeight="medium"
        style={{
          fontSize: "0.8em",
        }}
      >
        23/04/18
      </MDTypography>
    ),
    discount_percentage: (
      <MDTypography
        component="a"
        href="#"
        variant="caption"
        fontWeight="medium"
        style={{
          fontSize: "0.8em",
        }}
      >
        15%
      </MDTypography>
    ),
    action: (
      <MDBox display="flex" justifyContent="center">
        {item.usage_left === -1 ? ( // Kiểm tra nếu usage_left = -1
          <MDTypography
            variant="caption"
            fontWeight="medium"
            style={{
              color: "#d32f2f",
              fontSize: "0.9em",
            }}
          >
            Deactivated in coupon
          </MDTypography>
        ) : (
          <>
            <Link to={`/view_coupon/${item.id}`}>
              <MDTypography
                component="button"
                variant="caption"
                color="white"
                fontWeight="medium"
                style={{
                  backgroundColor: "#1976d2",
                  fontSize: "0.8em",
                  border: "none",
                  borderRadius: "2px",
                  padding: "5px 10px",
                  cursor: "pointer",
                }}
              >
                View
              </MDTypography>
            </Link>
            <div style={{ marginLeft: "15px" }}>
              <MDTypography
                component="button"
                variant="caption"
                fontWeight="medium"
                style={{
                  backgroundColor: "white",
                  color: "#d32f2f",
                  fontSize: "0.8em",
                  border: "none",
                  padding: "5px 10px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#ffe6e6")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "white")}
                onClick={() => openModal(item.id)}
              >
                <Icon fontSize="small">delete</Icon>
              </MDTypography>
            </div>
          </>
        )}
      </MDBox>
    ),
  }));

  return { columns, rows };
}
