import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import { Grid, TextField, Button, Icon } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductService from "api/ProductService";

function ProductDetail() {
  const navigate = useNavigate();
  const { prod_id } = useParams();
  const [product, setProduct] = useState("");
  const jwtToken = sessionStorage.getItem("jwtToken");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [transitionClass, setTransitionClass] = useState("");
  const images = product?.images_url || [];

  useEffect(() => {
    if (images.length > 0) {
      setCurrentImageIndex(0);
    }
  }, [images]);

  const handleImageChange = (newIndex) => {
    if (newIndex !== currentImageIndex) {
      setTransitionClass("fade-out");
      setTimeout(() => {
        setCurrentImageIndex(newIndex);
        setTransitionClass("fade-in");
      }, 300);
    }
  };

  const styles = {
    mainImage: {
      width: "100%",
      maxWidth: "400px",
      height: "280px",
      objectFit: "cover",
      borderRadius: "12px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      transition: "transform 0.3s ease, opacity 0.3s ease",
    },
    thumbnail: (isActive) => ({
      width: "60px",
      height: "60px",
      objectFit: "cover",
      borderRadius: "6px",
      cursor: "pointer",
      border: isActive ? "3px solid #3f51b5" : "3px solid transparent",
      boxShadow: isActive ? "0 4px 8px rgba(63, 81, 181, 0.4)" : "none",
      transition: "all 0.3s ease",
    }),
    imageContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      marginBottom: "16px",
    },
    thumbnailContainer: {
      display: "flex",
      gap: "8px",
      justifyContent: "center",
      flexWrap: "wrap",
    },
    navButton: {
      padding: "8px 16px",
      margin: "0 8px",
      background: "#3f51b5",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "bold",
      transition: "background 0.3s ease, transform 0.2s ease",
    },
    navButtonDisabled: {
      background: "#ccc",
      cursor: "not-allowed",
    },
  };
  useEffect(() => {
    const getProductDetail = async () => {
      if (jwtToken) {
        try {
          const response = await ProductService.getProductDetail(prod_id);
          setProduct(response);
        } catch (error) {
          console.error("Can't access the server", error);
        }
      }
    };

    getProductDetail();
  }, [prod_id, jwtToken]);

  useEffect(() => {
    // Reset lại ảnh đầu tiên khi product thay đổi
    if (images.length > 0) {
      setCurrentImageIndex(0);
    }
  }, [images]);

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      navigate("/sign-in", { replace: true });
    }
  }, [navigate]);

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
                  View product detail
                </MDTypography>
              </MDBox>

              {/* Content */}
              <MDBox p={3}>
                <Grid container spacing={3}>
                  {/* Left Section: Image */}
                  <Grid item xs={12} md={5}>
                    {/* Link Quay Lại */}
                    <Link to="/product">
                      <Icon sx={{ cursor: "pointer", "&:hover": { color: "gray" } }}>
                        arrow_back
                      </Icon>
                    </Link>
                    <MDBox style={styles.imageContainer}>
                      {/* Hình ảnh lớn */}
                      <div>
                        {images.length > 0 ? (
                          <img
                            src={images[currentImageIndex]}
                            alt="selected-product-image"
                            style={styles.mainImage}
                          />
                        ) : (
                          <p style={{ fontStyle: "italic", color: "#999" }}>No images available</p>
                        )}
                      </div>

                      {/* Hình ảnh nhỏ (thumbnails) */}
                      <div style={styles.thumbnailContainer}>
                        {images.map((imageUrl, index) => (
                          <img
                            key={index}
                            src={imageUrl}
                            alt={`product-thumbnail-${index}`}
                            onClick={() => handleImageChange(index)}
                            style={styles.thumbnail(currentImageIndex === index)}
                          />
                        ))}
                      </div>
                    </MDBox>

                    {/* Nút điều hướng */}
                    <div style={{ textAlign: "center", marginTop: "16px" }}>
                      <button
                        onClick={() => handleImageChange(Math.max(currentImageIndex - 1, 0))}
                        style={{
                          ...styles.navButton,
                          ...(currentImageIndex === 0 && styles.navButtonDisabled),
                        }}
                        disabled={currentImageIndex === 0}
                      >
                        Previous
                      </button>
                      <button
                        onClick={() =>
                          handleImageChange(Math.min(currentImageIndex + 1, images.length - 1))
                        }
                        style={{
                          ...styles.navButton,
                          ...(currentImageIndex === images.length - 1 && styles.navButtonDisabled),
                        }}
                        disabled={currentImageIndex === images.length - 1}
                      >
                        Next
                      </button>
                    </div>
                  </Grid>
                  {/* Right Section: Product Info */}
                  <Grid item xs={12} md={7}>
                    <form>
                      {/* Product Name */}
                      <TextField
                        fullWidth
                        label="Product Name"
                        value={product.product_name || ""}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />

                      {/* Category */}
                      <TextField
                        fullWidth
                        label="Category"
                        value={product.product_type || ""}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />

                      {/* Quantity */}
                      <TextField
                        fullWidth
                        type="number"
                        label="Quantity"
                        value={product.available_quantity || ""}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />

                      {/* Status */}
                      <TextField
                        fullWidth
                        label="Product status"
                        value={product.product_status || ""}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />

                      {/* Description */}
                      <TextField
                        fullWidth
                        label="Weight"
                        value={product.article || ""}
                        margin="normal"
                        multiline
                        rows={8}
                        variant="outlined"
                        InputProps={{
                          readOnly: true,
                          inputProps: {
                            spellCheck: "true",
                            "data-gramm": "true",
                          },
                        }}
                      />

                      {/* Price */}
                      <TextField
                        fullWidth
                        label="Price"
                        value={`$${product.price_list ? product.price_list[0]?.price : 0}`}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />

                      {/* Date */}
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

                      {/* Sale Percent */}
                      <TextField
                        fullWidth
                        label="Sale Percent"
                        value={`${product.price_list ? product.price_list[0]?.sale_percent : 0}%`}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />

                      {/* Weight */}
                      <TextField
                        fullWidth
                        label="Weight"
                        value={product.info?.note || ""}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />

                      {/* Made in */}
                      <TextField
                        fullWidth
                        label="Made in"
                        value={product.info?.made_in || ""}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />

                      {/* Ingredients */}
                      <TextField
                        fullWidth
                        label="Ingredients"
                        value={product.info?.ingredients || ""}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />

                      {/* Instructions */}
                      <TextField
                        fullWidth
                        label="Instructions"
                        value={product.info?.instructions || ""}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />

                      {/* Storage instructions */}
                      <TextField
                        fullWidth
                        label="Storage instructions"
                        value={product.info?.storage_instructions || ""}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />

                      {/* Note */}
                      <TextField
                        fullWidth
                        label="Note"
                        value={product.info?.note || ""}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
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

export default ProductDetail;
