import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Divider,
  Box,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

const REACT_APP_BACKEND_API_ENDPOINT = process.env.REACT_APP_BACKEND_API_ENDPOINT;

function PredictedProducts() {
  const jwtToken = sessionStorage.getItem("jwtToken");
  const [topProductMonth, setTopProductMonth] = useState([]);

  useEffect(() => {
    const fetchRevenue = async () => {
      if (!jwtToken) return;
      try {
        const response = await axios.get(
          `${REACT_APP_BACKEND_API_ENDPOINT}/api/manager/revenue/predicted-products`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        setTopProductMonth(response.data.top_predicted_products || []);
      } catch (error) {
        console.error("Error fetching predicted products:", error);
      }
    };

    fetchRevenue();
  }, [jwtToken]);

  return (
    <Box
      sx={{
        mt: 3,
        mx: "auto",
        backgroundColor: "white",
        borderRadius: "15px",
        boxShadow: "0px 10px 30px rgba(0,0,0,0.4)",
        p: 4,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          mb: 1,
          color: "#333",
          textAlign: "center",
        }}
      >
        📊 Top 10 Predicted Products of the Month
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "black",
          textAlign: "center",
          mb: 3,
        }}
      >
        Predict best-selling products of the month based on purchasing trends
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <TableContainer component={Paper} sx={{ borderRadius: "12px", overflowX: "auto" }}>
        <Table>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              No.
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Id Of Product</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Name Of Product</TableCell>
          </TableRow>
          <TableBody>
            {topProductMonth.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No of the data
                </TableCell>
              </TableRow>
            ) : (
              topProductMonth.map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="center">
                    <span
                      style={{
                        fontSize: "0.8em",
                      }}
                    >
                      {index + 1}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      style={{
                        fontSize: "0.8em",
                      }}
                    >
                      {item.product_id}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={item.product_name}>
                      <span
                        style={{
                          display: "inline-block",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "100%",
                          fontSize: "0.8em",
                        }}
                      >
                        {item.product_name}
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default PredictedProducts;
