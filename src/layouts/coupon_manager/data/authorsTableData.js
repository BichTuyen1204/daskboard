/* eslint-disable react/prop-types */
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import CouponService from "api/CouponService";
import { Box, Button, Icon, Modal, Typography } from "@mui/material";

export default function data(pageCoupon, rowsPerPageCoupon) {
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [coupon, setCoupon] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const jwtToken = sessionStorage.getItem("jwtToken");
  const [popupDelete, setPopupDelete] = useState(false);

  // Hàm mở popup
  const openModal = (id) => {
    setSelectedItemId(id);
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
        await CouponService.deleteCoupon(id);
        setCoupon((prevCoupons) => prevCoupons.filter((coupon) => coupon.id !== id));
        setPopupDelete(false);
        window.location.reload();
      } catch (error) {
        console.error("Failed to delete coupon:", error.message);
      }
    }
  };

  useEffect(() => {
    const getAllCoupon = async () => {
      if (!jwtToken) {
        return;
      } else {
        try {
          const response = await CouponService.getAllCoupon(pageCoupon, rowsPerPageCoupon);
          if (Array.isArray(response.content)) {
            setCoupon(response.content);
            setTotalPages(response.total_page || 1);
          } else {
            setCoupon([]);
            setTotalPages(1);
          }
        } catch (error) {
          setCoupon([]);
          setTotalPages(1);
        }
      }
    };
    getAllCoupon();
  }, [jwtToken, pageCoupon, rowsPerPageCoupon]);

  const Expire_date = ({ expire_time }) => (
    <MDBox lineHeight={1} textAlign="left" fontSize="0.8em">
      <MDTypography display="block" variant="caption" fontWeight="medium">
        {expire_time}
      </MDTypography>
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
    { Header: "expire date", accessor: "expire_time", align: "center" },
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
    expire_time: <Expire_date expire_time={item.expire_time} />,
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
        {item.sale_percent}%
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

        {/* Popup Confirm Delete */}
        {popupDelete && (
          <>
            {/* Nền mờ nhưng vẫn hiển thị dữ liệu phía sau */}
            <div
              style={{
                position: "fixed",
                top: "0",
                left: "0",
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(87, 87, 87, 0.2)", // Nền bán trong suốt
                backdropFilter: "blur(0.05em)",
                zIndex: "999",
              }}
              onClick={cancelDelete}
            ></div>

            {/* Popup nội dung */}
            <div
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "white",
                borderRadius: "8px",
                padding: "20px",
                width: "400px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)", // Đổ bóng
                zIndex: "1000", // Đảm bảo popup nằm trên cùng
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  marginBottom: "20px",
                  color: "#333",
                  fontWeight: "bold",
                }}
              >
                Confirm Disable
              </h3>
              <p
                style={{
                  marginBottom: "30px",
                  color: "#555",
                  fontSize: "0.9em",
                }}
              >
                Are you sure you want to disable this coupon?
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                <button
                  onClick={() => deleteProduct(selectedItemId)}
                  style={{
                    flex: "1",
                    padding: "10px",
                    backgroundColor: "#d32f2f",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "0.9em",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#c62828")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#d32f2f")}
                >
                  Disable
                </button>
                <button
                  onClick={cancelDelete}
                  style={{
                    flex: "1",
                    padding: "10px",
                    backgroundColor: "#1976d2",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "0.9em",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#1565c0")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#1976d2")}
                >
                  Cancel
                </button>
              </div>
              <Icon
                onClick={cancelDelete}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  cursor: "pointer",
                  color: "#555",
                }}
              >
                close
              </Icon>
            </div>
          </>
        )}
      </MDBox>
    ),
  }));

  return { columns, rows, totalPages };
}
