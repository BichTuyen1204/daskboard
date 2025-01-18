import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import { Grid, TextField, Button, Icon } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Link, useNavigate } from "react-router-dom";

function ViewStaff() {
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
                  View staff
                </MDTypography>
              </MDBox>

              {/* Content */}
              <MDBox p={3}>
                <Grid container spacing={3}>
                  {/* Right Section: Product Info */}
                  <Grid item xs={12} md={12}>
                    <form>
                      <Link to="/staff">
                        <Icon sx={{ cursor: "pointer", "&:hover": { color: "gray" } }}>
                          arrow_back
                        </Icon>
                      </Link>

                      {/* ID Staff */}
                      <TextField
                        fullWidth
                        label="ID"
                        value={product.name}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      {/* Name of staff */}
                      <TextField
                        fullWidth
                        label="Name of staff"
                        value={product.name}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      {/* Citizen Identification Card */}
                      <TextField
                        fullWidth
                        label="Citizen Identification Card"
                        value={product.name}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      {/* Phone number */}
                      <TextField
                        fullWidth
                        label="Number phone"
                        value={product.name}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />

                      <Grid container spacing={2} mt={1}>
                        {/* Date of start */}
                        <Grid item xs={12} sm={12}>
                          <TextField
                            fullWidth
                            label="Date of start"
                            type="date"
                            value={product.manufacturingDate}
                            onChange={(e) => handleChange("dateOfStart", e.target.value)}
                            InputLabelProps={{
                              shrink: true,
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

export default ViewStaff;
