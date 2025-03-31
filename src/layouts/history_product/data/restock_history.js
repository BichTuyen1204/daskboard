import { useState, useEffect } from "react";
import ProductService from "api/ProductService";
import MDTypography from "components/MDTypography";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

export default function RestockHistory(id, pageHistory, rowsPerPageHistory) {
  const [history, setHistory] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const jwtToken = sessionStorage.getItem("jwtToken");

  useEffect(() => {
    const getHistoryProduct = async () => {
      if (!jwtToken || !id) return;

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
        console.error("Can't access the server", error);
        setHistory([]);
        setTotalPages(1);
      }
    };

    getHistoryProduct();
  }, [id, jwtToken, pageHistory, rowsPerPageHistory]);

  const sortedHistory = [...history].sort((a, b) => new Date(b.in_date) - new Date(a.in_date));

  return (
    <Grid item xs={12}>
      <MDTypography variant="h6" gutterBottom>
        Restock history
      </MDTypography>
      {history.length > 0 ? (
        <TableContainer component={Paper} sx={{ width: "100%", overflowX: "auto" }}>
          <Table sx={{ width: "100%", minWidth: 650, border: "1px solid #ddd" }}>
            <TableHead sx={{ display: "table-header-group" }}>
              <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                <TableCell align="center" sx={{ fontWeight: "bold", border: "1px solid #ddd" }}>
                  #
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", border: "1px solid #ddd" }}>
                  Restock Date
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", border: "1px solid #ddd" }}>
                  Purchase Price
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", border: "1px solid #ddd" }}>
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
                  <TableCell align="center" sx={{ border: "1px solid #ddd", whiteSpace: "nowrap" }}>
                    {new Date(item.in_date).toLocaleString()}
                  </TableCell>
                  <TableCell align="center" sx={{ border: "1px solid #ddd" }}>
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
                      item.in_price
                    )}
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
  );
}
