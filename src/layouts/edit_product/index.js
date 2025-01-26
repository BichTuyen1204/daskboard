import { useEffect, useState } from "react";
import { Card, Grid, TextField, Button, MenuItem, Icon, Typography } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  const [quantity, setQuantity] = useState("");
  const [quantityError, setQuantityError] = useState("");
  const [updateQuantitySuccess, setUpdateQuantitySuccess] = useState("");
  const [status, setStatus] = useState("");
  const [statusError, setStatusError] = useState("");
  const [updateStatusSuccess, setUpdateStatusSuccess] = useState("");
  const [price, setPrice] = useState("");
  const [priceError, setPriceError] = useState("");
  const [sale_percent, setSale] = useState("");
  const [saleError, setSaleError] = useState("");
  const [updatePriceSuccess, setUpdatePriceSuccess] = useState("");

  // State for Producst Data
  const [productInfo, setProductInfo] = useState({
    day_before_expiry: "",
    description: "",
    article_md: "",
    infos: { weight: "" },
  });

  const [productStatus, setProductStatus] = useState({ status: "" });
  const [productQuantity, setProductQuantity] = useState({ quantity: 0 });
  const [productPrice, setProductPrice] = useState({ price: 0, sale_percent: 0 });

  // Ensure user is authenticated
  useEffect(() => {
    if (!jwtToken) navigate("/sign-in", { replace: true });
  }, [navigate, jwtToken]);

  // Fetch Product Details
  const getProductDetail = async () => {
    try {
      const response = await ProductService.getProductDetail(prod_id);
      console.log("nice", response);
      setProduct(response);
      setQuantity(response.available_quantity);
      setStatus(response.product_status);
      setSale(response.price_list?.[0]?.sale_percent);
      setPrice(response.price_list?.[0]?.price);
    } catch (error) {
      console.error(
        "Error during API calls:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const updateQuantity = async (e) => {
    e.preventDefault();
    QuantityBlur();
    if (!quantityError && quantity) {
      try {
        const response = await ProductService.updateProductQuantity(prod_id, parseInt(quantity));
        console.log("Update quantity successful", response);
        setUpdateQuantitySuccess("Quantity updated successfully.");
      } catch (error) {
        console.error(
          "Error during API calls:",
          error.response ? error.response.data : error.message
        );
      }
    }
  };

  const updateStatus = async (e) => {
    e.preventDefault();
    StatusBlur();
    if (!statusError && status) {
      try {
        const response = await ProductService.updateProductStatus(prod_id, status.toString());
        console.log("Update status successful", response);
        setUpdateStatusSuccess("Status updated successfully.");
      } catch (error) {
        console.error(
          "Error during API calls:",
          error.response ? error.response.data : error.message
        );
      }
    }
  };

  const updatePrice = async (e) => {
    e.preventDefault();
    PriceBlur();
    SalePersentBlur();
    if (!prod_id || isNaN(price) || isNaN(sale_percent)) {
      console.error("Invalid input data");
      return;
    } else {
      try {
        console.log("Price", price, "Sale percent", sale_percent);
        const response = await ProductService.updateProductPrice(
          prod_id,
          Number(price),
          Number(sale_percent)
        );
        console.log("Update price and sale percent successful", response);
        setUpdatePriceSuccess("Price and sale percent updated successfully.");
      } catch (error) {
        console.error(
          "Error during API calls:",
          error.response ? error.response.data : error.message
        );
      }
    }
  };

  const QuantityChange = (e) => {
    const { value } = e.target;
    setQuantity(value);
    setProductQuantity((preState) => ({ ...preState, quantity: value }));
    setUpdateQuantitySuccess(false);
  };

  const QuantityBlur = () => {
    if (quantity === "") {
      setQuantityError("Please enter a quantity");
    } else if (quantity < 1) {
      setQuantityError("Please enter a quantity greater than 1");
    } else {
      setQuantityError("");
    }
  };

  const StatusChange = (e) => {
    const { value } = e.target;
    setStatus(value);
    setProductStatus((preState) => ({ ...preState, status: value }));
    setUpdateStatusSuccess(false);
  };

  const StatusBlur = () => {
    if (status.trim === "") {
      setStatusError("Please enter a status");
    } else {
      setStatusError("");
    }
  };

  const PriceChange = (e) => {
    const { value } = e.target;
    setPrice(value);
    setProductPrice((preState) => ({ ...preState, price: value }));
    setUpdatePriceSuccess(false);
  };

  const PriceBlur = () => {
    if (price === "") {
      setPriceError("Please enter a price");
    } else if (quantity < 1) {
      setPriceError("Please enter a price greater than 1");
    } else {
      setPriceError("");
    }
  };

  const SalePersentChange = (e) => {
    const { value } = e.target;
    setSale(value);
    setProductPrice((preState) => ({ ...preState, sale_percent: value }));
    setUpdatePriceSuccess(false);
  };

  const SalePersentBlur = () => {
    if (sale_percent === "") {
      setSaleError("Please enter a sale percent");
    } else if (sale_percent < 1) {
      setSaleError("Please enter a sale persent greater than 1");
    } else if (sale_percent > 100) {
      setSaleError("Please enter a sale persent less than 100");
    } else {
      setSaleError("");
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
                    <Link
                      to="/product"
                      onClick={() => {
                        setTimeout(() => {
                          window.location.reload();
                        }, 0);
                      }}
                    >
                      <Icon sx={{ cursor: "pointer", "&:hover": { color: "gray" } }}>
                        arrow_back
                      </Icon>
                    </Link>
                    <p>{product.product_name}</p>
                    <div>
                      {/* Quantity */}
                      <TextField
                        fullWidth
                        type="number"
                        value={quantity || ""}
                        onChange={QuantityChange}
                        onBlur={QuantityBlur}
                        label="Quantity"
                        margin="normal"
                      />
                      {quantityError && (
                        <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                          {quantityError}
                        </p>
                      )}
                      {updateQuantitySuccess && (
                        <p style={{ color: "green", fontSize: "0.6em", marginLeft: "5px" }}>
                          {updateQuantitySuccess}
                        </p>
                      )}
                      <Button
                        variant="contained"
                        color="success"
                        onClick={updateQuantity}
                        style={{
                          backgroundColor: "green",
                          color: "white",
                          padding: "5px 10px",
                          fontSize: "0.6em",
                        }}
                      >
                        Save Quantity
                      </Button>
                    </div>

                    <TextField
                      fullWidth
                      label="Description"
                      value={product.article || ""}
                      margin="normal"
                      multiline
                      rows={4}
                    />

                    <TextField
                      fullWidth
                      label="Production Date"
                      value={
                        product.price_list && product.price_list[0]?.date
                          ? new Date(product.price_list[0]?.date).toLocaleString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/A"
                      }
                      margin="normal"
                      InputProps={{
                        readOnly: true,
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Day before expiry"
                      value={
                        product.price_list && product.price_list[0]?.date
                          ? new Date(product.price_list[0]?.date).toLocaleString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/A"
                      }
                      margin="normal"
                    />

                    {/* Product Status */}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        select
                        label="Status"
                        value={status}
                        onChange={StatusChange}
                        onBlur={StatusBlur}
                        sx={{ height: "45px", ".MuiInputBase-root": { height: "45px" } }}
                        margin="normal"
                      >
                        <MenuItem value="IN_STOCK">In stock</MenuItem>
                        <MenuItem value="OUT_OF_STOCK">Out of stock</MenuItem>
                        <MenuItem value="NO_LONGER_IN_SALE">No longer in sale</MenuItem>
                      </TextField>
                      {statusError && (
                        <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                          {statusError}
                        </p>
                      )}
                      {updateStatusSuccess && (
                        <p style={{ color: "green", fontSize: "0.6em", marginLeft: "5px" }}>
                          {updateStatusSuccess}
                        </p>
                      )}
                      <Button
                        variant="contained"
                        color="success"
                        onClick={updateStatus}
                        style={{
                          backgroundColor: "green",
                          color: "white",
                          padding: "5px 10px",
                          fontSize: "0.6em",
                        }}
                      >
                        Save Status
                      </Button>
                    </Grid>

                    <TextField
                      fullWidth
                      label="Price"
                      type="number"
                      value={price}
                      onChange={PriceChange}
                      onBlur={PriceBlur}
                      margin="normal"
                    />
                    {priceError && (
                      <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                        {priceError}
                      </p>
                    )}

                    <TextField
                      fullWidth
                      label="Sale Percent"
                      type="number"
                      value={sale_percent}
                      onChange={SalePersentChange}
                      onBlur={SalePersentBlur}
                      margin="normal"
                    />
                    {saleError && (
                      <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                        {saleError}
                      </p>
                    )}
                    {updatePriceSuccess && (
                      <p style={{ color: "green", fontSize: "0.6em", marginLeft: "5px" }}>
                        {updatePriceSuccess}
                      </p>
                    )}
                    <Button
                      variant="contained"
                      color="success"
                      onClick={updatePrice}
                      style={{
                        backgroundColor: "green",
                        color: "white",
                        padding: "5px 10px",
                        fontSize: "0.6em",
                      }}
                    >
                      Save Price and Sale Percent
                    </Button>
                  </Grid>

                  {/* Product Price */}
                  <Grid item xs={12}></Grid>
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
