import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import { Grid, TextField, Button, Icon } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Link, useNavigate, useParams } from "react-router-dom";
import CouponService from "api/CouponService";

function ViewCoupon() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [coupon, setCoupon] = useState("");
  const jwtToken = sessionStorage.getItem("jwtToken");

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      navigate("/sign-in", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const getCouponDetail = async () => {
      if (jwtToken) {
        try {
          const response = await CouponService.getCouponDetail(id);
          setCoupon(response);
        } catch (error) {
          console.error("Can't access the server", error);
        }
      }
    };
    getCouponDetail();
  }, [id, jwtToken]);

  return (
    <DashboardLayout>
      <MDBox pt={6} pb={3}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={12} lg={12}>
            <Card>
              {/* Header */}
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
                  View coupon
                </MDTypography>
              </MDBox>

              {/* Content */}
              <MDBox p={3}>
                <Grid container spacing={3}>
                  {/* Right Section: Product Info */}
                  <Grid item xs={12} md={12}>
                    <Link to="/coupon">
                      <Icon sx={{ cursor: "pointer", "&:hover": { color: "gray" } }}>
                        arrow_back
                      </Icon>
                    </Link>
                    <form>
                      <TextField
                        fullWidth
                        label="ID"
                        value={coupon.id || ""}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />

                      {/* Minimum price */}
                      <TextField
                        fullWidth
                        label="Minimum price"
                        value={coupon.minimum_price || ""}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />

                      {/* Usage left */}
                      <TextField
                        fullWidth
                        label="Usage left"
                        type="text"
                        value={coupon.usage_left || ""}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />

                      {/* Sale percent */}
                      <TextField
                        fullWidth
                        label="Sale percent"
                        type="text"
                        value={`${coupon.sale_percent || 0}%`}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />

                      <Grid container spacing={2} mt={1}>
                        {/* Expiration date */}
                        <Grid item xs={12} sm={12}>
                          <TextField
                            fullWidth
                            label="Expiration date"
                            type="date"
                            value={coupon.expire_time || ""}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </Grid>
                      </Grid>
                    </form>
                  </Grid>
                </Grid>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default ViewCoupon;
