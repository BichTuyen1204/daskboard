import { useEffect, useState } from "react";
import {
  Card,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Icon,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductService from "api/ProductService";

function HistoryProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [history, setHistory] = useState([]);
  const jwtToken = sessionStorage.getItem("jwtToken");

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      navigate("/sign-in", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const getProductDetail = async () => {
      if (jwtToken) {
        try {
          const response = await ProductService.getProductDetail(id);
          setProduct(response);
        } catch (error) {
          console.error("Can't access the server", error);
        }
      }
    };
    getProductDetail();
  }, [id, jwtToken]);

  useEffect(() => {
    const getHistoryProduct = async () => {
      if (jwtToken) {
        try {
          const response = await ProductService.getHistoryProduct(id);
          setHistory(response || []);
        } catch (error) {
          console.error("Can't access the server", error);
        }
      }
    };
    getHistoryProduct();
  }, [id, jwtToken]);

  // Sort purchase history by descending date
  const sortedHistory = [...history].sort((a, b) => new Date(b.in_date) - new Date(a.in_date));

  return (
    <DashboardLayout>
      <MDBox pt={6} pb={3}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={10} lg={10}>
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
                textAlign="center"
              >
                <MDTypography variant="h5" color="white">
                  PURCHASE HISTORY
                </MDTypography>
              </MDBox>

              {/* Content */}
              <MDBox p={3}>
                <Grid container spacing={3}>
                  <Link to="/ingredient">
                    <Icon
                      sx={{
                        cursor: "pointer",
                        marginLeft: "25px",
                        marginTop: "20px",
                        "&:hover": { color: "gray" },
                      }}
                    >
                      arrow_back
                    </Icon>
                  </Link>

                  <p
                    style={{
                      fontSize: "0.8em",
                      paddingTop: "55px",
                      marginBottom: "-15px",
                    }}
                  >
                    Product name: <strong>{product?.product_name}</strong>
                  </p>

                  {/* History Table */}
                  <Grid item xs={12}>
                    <MDTypography variant="h6" gutterBottom>
                      Restock history
                    </MDTypography>
                    {history.length > 0 ? (
                      <TableContainer component={Paper} sx={{ width: "100%", overflowX: "auto" }}>
                        <Table sx={{ width: "100%", minWidth: 650, border: "1px solid #ddd" }}>
                          <TableHead sx={{ display: "table-header-group" }}>
                            <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                              <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", border: "1px solid #ddd" }}
                              >
                                #
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", border: "1px solid #ddd" }}
                              >
                                Restock Date
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", border: "1px solid #ddd" }}
                              >
                                Purchase Price
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", border: "1px solid #ddd" }}
                              >
                                Import Quantity
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {sortedHistory.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell align="center" sx={{ border: "1px solid #ddd" }}>
                                  {index + 1}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  sx={{ border: "1px solid #ddd", whiteSpace: "nowrap" }}
                                >
                                  {new Date(item.in_date).toLocaleString()}
                                </TableCell>
                                <TableCell align="center" sx={{ border: "1px solid #ddd" }}>
                                  {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                  }).format(item.in_price)}
                                </TableCell>

                                <TableCell align="center" sx={{ border: "1px solid #ddd" }}>
                                  {item.in_stock}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <MDTypography variant="body2" color="textSecondary">
                        No purchase history available
                      </MDTypography>
                    )}
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

export default HistoryProduct;
