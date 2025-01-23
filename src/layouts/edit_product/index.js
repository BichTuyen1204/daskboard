import { useEffect, useState } from "react";
import { Card, Grid, TextField, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import axios from "axios";
import ProductService from "api/ProductService";

function EditProduct() {
  const navigate = useNavigate();
  const [product, setProduct] = useState("");
  const { prod_id } = useParams();
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));

  // State for Product Data
  const [productInfo, setProductInfo] = useState({
    day_before_expiry: "",
    description: "",
    article_md: "",
    infos: { weight: "" },
  });

  const [productStatus, setProductStatus] = useState({ status: "" });
  const [productQuantity, setProductQuantity] = useState({ quantity: "" });
  const [productPrice, setProductPrice] = useState({ price: "", sale_percent: "" });

  // Ensure user is authenticated
  useEffect(() => {
    if (!jwtToken) navigate("/sign-in", { replace: true });
  }, [navigate, jwtToken]);

  // Fetch Product Details
  const getProductDetail = async () => {
    try {
      const response = await ProductService.getProductDetail(prod_id);
      setProduct(response);
    } catch (error) {
      console.error(
        "Error during API calls:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // Load product details when component mounts
  useEffect(() => {
    getProductDetail(prod_id);
  }, [prod_id]);

  return (
    <DashboardLayout>
      <MDBox pt={6} pb={3}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={10}>
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
                  Edit Product
                </MDTypography>
              </MDBox>

              {/* Content */}
              <MDBox p={3}>
                <Grid container spacing={3}>
                  {/* Product Info */}
                  <Grid item xs={12}>
                    <p>{product.product_name}</p>
                    <TextField
                      fullWidth
                      value={product.available_quantity}
                      label="Quantity"
                      margin="normal"
                    />

                    <TextField
                      fullWidth
                      label="Description"
                      value={product.article}
                      margin="normal"
                      multiline
                      rows={4}
                    />
                  </Grid>

                  {/* Product Status */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Status"
                      value={product.product_status}
                      margin="normal"
                    />
                  </Grid>

                  {/* Product Price */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Price"
                      type="number"
                      value={product.price_list?.price || 0}
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Sale Percent"
                      type="number"
                      value={product.price_list?.sale_percent || 0}
                      margin="normal"
                    />
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

export default EditProduct;
