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
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductService from "api/ProductService";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

function HistoryProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const jwtToken = sessionStorage.getItem("jwtToken");
  const [product, setProduct] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyUpdate, setHistorUpdate] = useState([]);

  const [totalPages, setTotalPages] = useState(1);
  const [totalPagesUpdate, setTotalPagesUpdate] = useState(1);

  const [pageHistory, setPageHistory] = useState(1);
  const [pageHistoryUpdate, setPageHistoryUpdate] = useState(1);

  const rowsPerPageHistory = 6;
  const rowsPerPageHistoryUpdate = 6;

  const hasNextPageHistory = pageHistory < totalPages;
  const hasNextPageHistoryUpdate = pageHistoryUpdate < totalPagesUpdate;

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      navigate("/sign-in", { replace: true });
    }
  }, [navigate]);

  const handlePrevPageHistory = () => {
    if (pageHistory > 1) {
      setPageHistory((prev) => prev - 1);
    }
  };

  const handleNextPageHistory = () => {
    if (hasNextPageHistory) {
      setPageHistory((prev) => prev + 1);
    }
  };

  const handlePrevPageHistoryUpdate = () => {
    if (pageHistoryUpdate > 1) {
      setPageHistoryUpdate((prev) => prev - 1);
    }
  };

  const handleNextPageHistoryUpdate = () => {
    if (hasNextPageHistoryUpdate) {
      setPageHistoryUpdate((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const getProductDetail = async () => {
      if (jwtToken) {
        try {
          const response = await ProductService.getProductDetail(id);
          setProduct(response);
        } catch (error) {}
      }
    };
    getProductDetail();
  }, [id, jwtToken]);

  useEffect(() => {
    const getHistoryProduct = async () => {
      if (!jwtToken) {
        return;
      }
      {
        try {
          const response = await ProductService.getHistoryProduct(
            id,
            pageHistory,
            rowsPerPageHistory
          );
          if (Array.isArray(response.content)) {
            setHistory(response.content);
            setTotalPages(response.total_page || 1);
          } else {
            setHistory([]);
            setTotalPages(1);
          }
        } catch (error) {
          setHistory([]);
          setTotalPages(1);
        }
      }
    };
    getHistoryProduct();
  }, [id, jwtToken, pageHistory]);

  useEffect(() => {
    const getHistoryUpdate = async () => {
      if (!jwtToken) {
        return;
      }
      {
        try {
          const response = await ProductService.getHistoryUpdate(
            id,
            pageHistoryUpdate,
            rowsPerPageHistoryUpdate
          );
          if (Array.isArray(response.content)) {
            setHistorUpdate(response.content);
            setTotalPagesUpdate(response.total_page || 1);
          } else {
            setHistorUpdate([]);
            setTotalPagesUpdate(1);
          }
        } catch (error) {
          setHistorUpdate([]);
          setTotalPagesUpdate(1);
        }
      }
    };
    getHistoryUpdate();
  }, [id, jwtToken, pageHistoryUpdate]);

  // Sort purchase history by descending date
  const sortedHistory = [...history].sort((a, b) => new Date(b.in_date) - new Date(a.in_date));

  const sortedHistoryUpdate = [...historyUpdate].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

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

                  <MDBox
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="center"
                    mx={1}
                    mt={3}
                    width="100%"
                  >
                    {/* Nút Previous */}
                    <IconButton
                      onClick={handlePrevPageHistory}
                      disabled={pageHistory === 1}
                      sx={{
                        bgcolor: "black",
                        fontSize: "0.6em",
                        color: "white",
                        width: "30px",
                        height: "30px",
                        minWidth: "30px",
                        borderRadius: "50%",
                        "&:hover, &:focus": {
                          bgcolor: "#333 !important",
                          color: "white !important",
                        },
                        opacity: pageHistory === 1 ? 0.3 : 1,
                      }}
                    >
                      <ArrowBackIos sx={{ fontSize: "14px" }} />
                    </IconButton>

                    {/* Số trang */}
                    <Box
                      sx={{
                        mx: 2,
                        width: 30,
                        height: 30,
                        display: "flex",
                        border: "1px solid white",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        bgcolor: "#1b98e0",
                      }}
                    >
                      <Typography color="white" fontWeight="bold">
                        <p style={{ fontSize: "0.7em", color: "white" }}>{pageHistory}</p>
                      </Typography>
                    </Box>

                    {/* Nút Next */}
                    <IconButton
                      onClick={handleNextPageHistory}
                      disabled={!hasNextPageHistory}
                      sx={{
                        bgcolor: "black",
                        fontSize: "0.6em",
                        color: "white",
                        width: "30px",
                        height: "30px",
                        minWidth: "30px",
                        borderRadius: "50%",
                        "&:hover, &:focus": {
                          bgcolor: "#333 !important",
                          color: "white !important",
                        },
                        opacity: hasNextPageHistory ? 1 : 0.3,
                      }}
                    >
                      <ArrowForwardIos sx={{ fontSize: "14px" }} />
                    </IconButton>
                  </MDBox>

                  {/* History update price and percent */}
                  <Grid item xs={12}>
                    <MDTypography variant="h6" gutterBottom>
                      Price Update History and Discount Percentage of the Product
                    </MDTypography>
                    {historyUpdate.length > 0 ? (
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
                                Date
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", border: "1px solid #ddd" }}
                              >
                                Price
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", border: "1px solid #ddd" }}
                              >
                                Sale percent (%)
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {sortedHistoryUpdate.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell align="center" sx={{ border: "1px solid #ddd" }}>
                                  {index + 1}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  sx={{ border: "1px solid #ddd", whiteSpace: "nowrap" }}
                                >
                                  {new Date(item.date).toLocaleString()}
                                </TableCell>
                                <TableCell align="center" sx={{ border: "1px solid #ddd" }}>
                                  {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                  }).format(item.price)}
                                </TableCell>

                                <TableCell align="center" sx={{ border: "1px solid #ddd" }}>
                                  {item.sale_percent}
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

                  <MDBox
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="center"
                    mx={1}
                    mt={3}
                    width="100%"
                  >
                    {/* Nút Previous */}
                    <IconButton
                      onClick={handlePrevPageHistoryUpdate}
                      disabled={pageHistoryUpdate === 1}
                      sx={{
                        bgcolor: "black",
                        fontSize: "0.6em",
                        color: "white",
                        width: "30px",
                        height: "30px",
                        minWidth: "30px",
                        borderRadius: "50%",
                        "&:hover, &:focus": {
                          bgcolor: "#333 !important",
                          color: "white !important",
                        },
                        opacity: pageHistoryUpdate === 1 ? 0.3 : 1,
                      }}
                    >
                      <ArrowBackIos sx={{ fontSize: "14px" }} />
                    </IconButton>

                    {/* Số trang */}
                    <Box
                      sx={{
                        mx: 2,
                        width: 30,
                        height: 30,
                        display: "flex",
                        border: "1px solid white",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        bgcolor: "#1b98e0",
                      }}
                    >
                      <Typography color="white" fontWeight="bold">
                        <p style={{ fontSize: "0.7em", color: "white" }}>{pageHistoryUpdate}</p>
                      </Typography>
                    </Box>

                    {/* Nút Next */}
                    <IconButton
                      onClick={handleNextPageHistoryUpdate}
                      disabled={!hasNextPageHistoryUpdate}
                      sx={{
                        bgcolor: "black",
                        fontSize: "0.6em",
                        color: "white",
                        width: "30px",
                        height: "30px",
                        minWidth: "30px",
                        borderRadius: "50%",
                        "&:hover, &:focus": {
                          bgcolor: "#333 !important",
                          color: "white !important",
                        },
                        opacity: hasNextPageHistoryUpdate ? 1 : 0.3,
                      }}
                    >
                      <ArrowForwardIos sx={{ fontSize: "14px" }} />
                    </IconButton>
                  </MDBox>
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
