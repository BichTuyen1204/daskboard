import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import { Grid, TextField, Button } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Link, useNavigate } from "react-router-dom";

function ViewCoupon() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      navigate("/sign-in", { replace: true });
    }
  }, [navigate]);

  const [product, setProduct] = useState({
    id: 1,
    image:
      "https://assets.epicurious.com/photos/62f16ed5fe4be95d5a460eed/1:1/w_4318,h_4318,c_limit/RoastChicken_RECIPE_080420_37993.jpg",
    name: "Product A",
    category: "Category 1",
    quantity: 10,
    description: 10,
  });

  const handleChange = (field, value) => {
    setProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
                  Add coupon
                </MDTypography>
              </MDBox>

              {/* Content */}
              <MDBox p={3}>
                <Grid container spacing={3}>
                  {/* Right Section: Product Info */}
                  <Grid item xs={12} md={12}>
                    <form>
                      <TextField fullWidth label="ID" value={product.name} margin="normal" />
                      {/* Coupon Name */}
                      <TextField
                        fullWidth
                        label="Name of coupon"
                        value={product.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        margin="normal"
                      />

                      <Grid container spacing={2} mt={1}>
                        {/* Manufacturing Date */}
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Expiration date"
                            type="date"
                            value={product.manufacturingDate}
                            onChange={(e) => handleChange("expirationDate", e.target.value)}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>

                        {/* Expiry Date */}
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Creation date"
                            type="date"
                            value={product.expiryDate}
                            onChange={(e) => handleChange("creationDate", e.target.value)}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                      </Grid>

                      {/* Discount */}
                      <TextField
                        fullWidth
                        label="Discount percentage"
                        value={product.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        margin="normal"
                        multiline
                        variant="outlined"
                        InputProps={{
                          inputProps: {
                            spellCheck: "true",
                            "data-gramm": "true",
                          },
                        }}
                      />

                      {/* Action Buttons */}
                      <MDBox mt={3} display="flex" justifyContent="space-between">
                        <Button
                          variant="outlined"
                          color="success"
                          style={{
                            color: "white",
                            backgroundColor: "#00ca15",
                            padding: "5px 25px",
                          }}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          style={{
                            color: "white",
                            backgroundColor: "#dd0909",
                            padding: "5px 25px",
                          }}
                        >
                          <Link to="/coupon" style={{ color: "white" }}>
                            Cancel
                          </Link>
                        </Button>
                      </MDBox>
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
