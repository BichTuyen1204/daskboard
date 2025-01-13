import { useState } from "react";
import Card from "@mui/material/Card";
import { Grid, TextField, Button } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Link } from "react-router-dom";

function OrderDetail() {
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
      <MDBox pb={3}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={12} lg={12}>
            <Card>
              <MDBox p={3}>
                <div style={{ fontWeight: "500", fontSize: "0.9em", paddingBottom: "5px" }}>
                  Order ID: {product.id}
                </div>
                <div style={{ fontWeight: "500", fontSize: "0.6em", paddingBottom: "10px" }}>
                  January 1, 2025 at 09:48 am form Cần Thơ
                </div>
                <Card>
                  <Grid p={2}>
                    <div style={{ fontWeight: "500", fontSize: "0.8em" }}>Order Item</div>
                    <div>
                      <button
                        style={{
                          fontWeight: "500",
                          borderRadius: "5px",
                          padding: "5px 10px",
                          color: "green",
                          backgroundColor: "lightgreen",
                          border: "1px solid lightgreen",
                        }}
                      >
                        Confirm
                      </button>
                    </div>
                    <div style={{ display: "flex", marginTop: "15px" }}>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: "4rem",
                          height: "55px",
                          borderRadius: "8px",
                          marginBottom: "16px",
                        }}
                      />
                      <div>
                        <div
                          style={{
                            fontSize: "0.6em",
                          }}
                        >
                          Category
                        </div>
                        <div
                          style={{
                            fontSize: "0.7em",
                          }}
                        >
                          Name of product
                        </div>
                      </div>
                    </div>
                  </Grid>
                </Card>
                <Grid container spacing={3}>
                  {/* Left Section: Image */}
                  <Grid item xs={12} md={5}>
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
                        style={{
                          color: "white",
                          backgroundColor: "#02adf1",
                        }}
                      >
                        Update Image
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

export default OrderDetail;
