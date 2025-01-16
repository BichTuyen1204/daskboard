import { useState } from "react";
import Card from "@mui/material/Card";
import { Grid, TextField, Button, Icon } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Link } from "react-router-dom";

function AddProduct() {
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
                  Add Product
                </MDTypography>
              </MDBox>

              {/* Content */}
              <MDBox p={3}>
                <Grid container spacing={3}>
                  {/* Left Section: Image */}
                  <Grid item xs={12} md={5}>
                    <Link to="/product">
                      <Icon sx={{ cursor: "pointer", "&:hover": { color: "gray" } }}>
                        arrow_back
                      </Icon>
                    </Link>
                    <MDBox display="flex" flexDirection="column" alignItems="center">
                      {/* Image Preview */}
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: "100%",
                          maxWidth: "20rem",
                          height: "20rem",
                          borderRadius: "8px",
                          marginBottom: "16px",
                        }}
                      />

                      {/* Update Image Button */}
                      <Button
                        variant="outlined"
                        color="primary"
                        sx={{
                          border: "1px solid primary",
                          color: "white",
                          backgroundColor: "#02adf1",
                          "&:hover": {
                            border: "1px solid #51e7ff",
                            backgroundColor: "#00dcff",
                          },
                        }}
                      >
                        Add Image
                      </Button>
                    </MDBox>
                  </Grid>

                  {/* Right Section: Product Info */}
                  <Grid item xs={12} md={7}>
                    <form>
                      {/* Product Name */}
                      <TextField
                        fullWidth
                        label="Product Name"
                        value={product.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        margin="normal"
                      />

                      {/* Category */}
                      <TextField
                        fullWidth
                        label="Category"
                        value={product.category}
                        onChange={(e) => handleChange("category", e.target.value)}
                        margin="normal"
                      />

                      {/* Quantity */}
                      <TextField
                        fullWidth
                        type="number"
                        label="Quantity"
                        value={product.quantity}
                        onChange={(e) => handleChange("quantity", e.target.value)}
                        margin="normal"
                      />

                      {/* Description */}
                      <TextField
                        fullWidth
                        label="Description"
                        value={product.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        margin="normal"
                        multiline
                        rows={8}
                        variant="outlined"
                        InputProps={{
                          inputProps: {
                            spellCheck: "true",
                            "data-gramm": "true",
                          },
                        }}
                      />

                      <Grid container spacing={2} mt={1}>
                        {/* Manufacturing Date */}
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Manufacturing Date"
                            type="date"
                            value={product.manufacturingDate}
                            onChange={(e) => handleChange("manufacturingDate", e.target.value)}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>

                        {/* Expiry Date */}
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Expiry Date"
                            type="date"
                            value={product.expiryDate}
                            onChange={(e) => handleChange("expiryDate", e.target.value)}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                      </Grid>

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
                          Add
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
                          <Link to="/product" style={{ color: "white" }}>
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

export default AddProduct;
