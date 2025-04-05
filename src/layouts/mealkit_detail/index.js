import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import {
  Grid,
  TextField,
  Button,
  Icon,
  List,
  ListItem,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductService from "api/ProductService";
import MDEditor from "@uiw/react-md-editor";

function MealkitDetail() {
  const navigate = useNavigate();
  const { prod_id } = useParams();
  const [product, setProduct] = useState("");
  const jwtToken = sessionStorage.getItem("jwtToken");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [transitionClass, setTransitionClass] = useState("");
  const images = product?.images_url || [];
  const [latestPrice, setLatestPrice] = useState(null);
  const [ingredients, setIngredients] = useState([]);

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
    instructionList: {
      backgroundColor: "#f5f5f5",
      borderRadius: "8px",
      padding: "12px",
      marginTop: "8px",
      marginBottom: "16px",
    },
    additionalInfoTable: {
      width: "100%",
      border: "1px solid #e0e0e0",
      borderCollapse: "collapse",
      marginTop: "8px",
      marginBottom: "16px",
    },
    tableRow: {
      borderBottom: "1px solid #e0e0e0",
    },
    tableCell: {
      padding: "8px 16px",
      fontSize: "14px",
    },
    tableCellHeader: {
      padding: "8px 16px",
      fontSize: "14px",
      fontWeight: "bold",
      backgroundColor: "#f5f5f5",
    },
  };

  useEffect(() => {
    const getProductDetail = async () => {
      if (jwtToken) {
        try {
          const response = await ProductService.getProductDetail(prod_id);
          setProduct(response);

          if (response.price_list && response.price_list.length > 0) {
            const sortedPriceList = response.price_list.sort(
              (a, b) => new Date(b.date) - new Date(a.date)
            );

            setLatestPrice(sortedPriceList[0]);
          }
        } catch (error) {
          console.error("Can't access the server", error);
        }
      }
    };

    getProductDetail();
  }, [prod_id, jwtToken]);

  useEffect(() => {
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

  useEffect(() => {
    const fetchIngredients = async () => {
      if (jwtToken) {
        try {
          const response = await ProductService.getIngredient(prod_id, 1, 100);
          setIngredients(response?.content || []);
        } catch (error) {
          console.error("Error fetching ingredients:", error);
        }
      }
    };

    fetchIngredients();
  }, [prod_id, jwtToken]);

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
                  View mealkit detail
                </MDTypography>
              </MDBox>

              {/* Content */}
              <MDBox p={3}>
                <Grid container spacing={3}>
                  {/* Left Section: Image and Ingredients */}
                  <Grid item xs={12} md={5}>
                    {/* Back Link */}
                    <Link to="/mealkit">
                      <Icon sx={{ cursor: "pointer", "&:hover": { color: "gray" } }}>
                        arrow_back
                      </Icon>
                    </Link>
                    <MDBox style={styles.imageContainer}>
                      {/* Main Image */}
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

                      {/* Thumbnails */}
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

                    {/* Navigation buttons */}
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

                    {/* MOVED: Ingredients Section */}
                    <MDBox mt={3} mb={2}>
                      <MDTypography variant="subtitle1">Ingredients</MDTypography>
                      {ingredients && ingredients.length > 0 ? (
                        <TableContainer
                          component={Paper}
                          style={{
                            marginTop: "8px",
                            borderRadius: "8px",
                          }}
                        >
                          <Table size="small">
                            <TableBody>
                              {ingredients.map((ingredient) => (
                                <TableRow key={ingredient.id} style={styles.tableRow}>
                                  <TableCell style={styles.tableCell}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                      {ingredient.image ? (
                                        <img
                                          src={ingredient.image}
                                          alt={ingredient.name}
                                          style={{
                                            width: "40px",
                                            height: "40px",
                                            objectFit: "cover",
                                            borderRadius: "4px",
                                          }}
                                        />
                                      ) : (
                                        <Box
                                          sx={{
                                            width: 40,
                                            height: 40,
                                            bgcolor: "#eee",
                                            borderRadius: "4px",
                                          }}
                                        />
                                      )}
                                      <span style={{ fontSize: "13px" }}>{ingredient.name}</span>
                                    </Box>
                                  </TableCell>
                                  <TableCell style={{ ...styles.tableCell, fontSize: "13px" }}>
                                    {ingredient.amount}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      ) : (
                        <p style={{ fontStyle: "italic", color: "#999" }}>
                          No ingredients available
                        </p>
                      )}
                    </MDBox>
                  </Grid>
                  {/* Right Section: Product Info */}
                  <Grid item xs={12} md={7}>
                    <form>
                      {/* Product Name */}
                      <TextField
                        fullWidth
                        label="Product Name"
                        value={product?.product_name || ""}
                        margin="normal"
                        InputProps={{ readOnly: true }}
                      />

                      {/* Category */}
                      <TextField
                        fullWidth
                        label="Product Type"
                        value={product?.product_type || ""}
                        margin="normal"
                        InputProps={{ readOnly: true }}
                      />

                      {/* Quantity */}
                      <TextField
                        fullWidth
                        type="number"
                        label="Quantity"
                        value={product?.available_quantity || 0}
                        margin="normal"
                        InputProps={{ readOnly: true }}
                      />

                      {/* Status */}
                      <TextField
                        fullWidth
                        label="Product Status"
                        value={
                          product?.product_status === "IN_STOCK"
                            ? "In stock"
                            : product?.product_status === "OUT_OF_STOCK"
                            ? "Out of stock"
                            : product?.product_status === "NO_LONGER_IN_SALE"
                            ? "No longer in sale"
                            : "Unknown"
                        }
                        margin="normal"
                        InputProps={{ readOnly: true }}
                      />

                      {/* Article/Content (Markdown) */}
                      <MDBox mt={2} mb={2}>
                        <MDTypography variant="subtitle1">Article Content</MDTypography>
                        <Paper
                          elevation={0}
                          style={{ padding: "16px", backgroundColor: "#f9f9f9" }}
                        >
                          {product?.article ? (
                            <MDEditor.Markdown source={product.article} />
                          ) : (
                            <p style={{ fontStyle: "italic", color: "#999" }}>
                              No article content available
                            </p>
                          )}
                        </Paper>
                      </MDBox>

                      {/* Price - Lấy giá mới nhất */}
                      <TextField
                        fullWidth
                        label="Price"
                        value={`$${latestPrice ? latestPrice.price : 0 || ""}`}
                        margin="normal"
                        InputProps={{ readOnly: true }}
                      />

                      {/* Date before expiry */}
                      <TextField
                        fullWidth
                        label="Date before expiry"
                        value={product?.day_before_expiry || 0}
                        margin="normal"
                        InputProps={{ readOnly: true }}
                      />

                      {/* Sale Percent - Lấy % giảm giá mới nhất */}
                      <TextField
                        fullWidth
                        label="Sale Percent"
                        value={`${latestPrice ? latestPrice.sale_percent : 0}%`}
                        margin="normal"
                        InputProps={{ readOnly: true }}
                      />

                      {/* Instructions List as Table */}
                      {product?.instructions && (
                        <MDBox mt={2} mb={2}>
                          <MDTypography variant="subtitle1">Instructions</MDTypography>
                          {product.instructions && product.instructions.length > 0 ? (
                            <TableContainer component={Paper}>
                              <Table size="small">
                                <TableBody>
                                  {product.instructions.map((instruction, index) => (
                                    <TableRow key={index} style={styles.tableRow}>
                                      <TableCell
                                        align="center"
                                        style={{
                                          ...styles.tableCell,
                                          fontWeight: "bold",
                                          width: "60px",
                                        }}
                                      >
                                        {index + 1}
                                      </TableCell>
                                      <TableCell style={styles.tableCell}>{instruction}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          ) : (
                            <p style={{ fontStyle: "italic", color: "#999" }}>
                              No instructions available
                            </p>
                          )}
                        </MDBox>
                      )}

                      {/* Additional Information */}
                      <MDBox mt={2} mb={2}>
                        <MDTypography variant="subtitle1">Additional Information</MDTypography>
                        {product?.info && Object.keys(product.info).length > 0 ? (
                          <table style={styles.additionalInfoTable}>
                            <thead>
                              <tr style={styles.tableRow}>
                                <th style={styles.tableCellHeader}>Property</th>
                                <th style={styles.tableCellHeader}>Value</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(product.info).map(([key, value], index) => (
                                <tr key={index} style={styles.tableRow}>
                                  <td style={styles.tableCell}>{key}</td>
                                  <td style={styles.tableCell}>{value}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p style={{ fontStyle: "italic", color: "#999" }}>
                            No additional information available
                          </p>
                        )}
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

export default MealkitDetail;
