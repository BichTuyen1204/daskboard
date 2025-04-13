import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Icon } from "@mui/material";

function Order() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      navigate("/sign-in", { replace: true });
    }
  }, [navigate]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <MDBox
              mx={2}
              mt={-3}
              py={3}
              px={2}
              variant="gradient"
              bgColor="info"
              borderRadius="lg"
              coloredShadow="info"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <MDTypography variant="h6" color="white">
                Order list
              </MDTypography>

              <Link to="/list_order">
                <button
                  style={{
                    backgroundColor: "white",
                    color: "#333",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #333",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                    transition: "background-color 0.3s, transform 0.2s",
                  }}
                >
                  <MDTypography color="#333" style={{ marginRight: "8px", fontSize: "0.9em" }}>
                    View Details
                  </MDTypography>
                  <Icon sx={{ color: "#333" }}>arrow_forward</Icon>
                </button>
              </Link>
            </MDBox>
          </Grid>

          {/* View shipper confirm */}
          <Grid item xs={12}>
            <MDBox
              mx={2}
              mt={-3}
              py={3}
              px={2}
              bgColor="green"
              borderRadius="lg"
              coloredShadow="info"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <MDTypography variant="h6" color="white">
                Order Processing for Shippers
              </MDTypography>
              <Link to="/shipper">
                <button
                  style={{
                    backgroundColor: "white",
                    color: "#333",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #333",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                    transition: "background-color 0.3s, transform 0.2s",
                  }}
                >
                  <MDTypography color="#333" style={{ marginRight: "8px", fontSize: "0.9em" }}>
                    View Details
                  </MDTypography>
                  <Icon sx={{ color: "#333" }}>arrow_forward</Icon>
                </button>
              </Link>
            </MDBox>
          </Grid>

          {/* On Confirm */}
          <Grid item xs={12}>
            <MDBox
              mx={2}
              mt={-3}
              py={3}
              px={2}
              bgColor="green"
              borderRadius="lg"
              coloredShadow="info"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <MDTypography variant="h6" color="white">
                Confirmed Order
              </MDTypography>
              <Link to="/confirm_order">
                <button
                  style={{
                    backgroundColor: "white",
                    color: "#333",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #333",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                    transition: "background-color 0.3s, transform 0.2s",
                  }}
                >
                  <MDTypography color="#333" style={{ marginRight: "8px", fontSize: "0.9em" }}>
                    View Details
                  </MDTypography>
                  <Icon sx={{ color: "#333" }}>arrow_forward</Icon>
                </button>
              </Link>
            </MDBox>
          </Grid>

          {/* On Processing */}
          <Grid item xs={12}>
            <MDBox
              mx={2}
              mt={-3}
              py={3}
              px={2}
              bgColor="#F6DC43"
              borderRadius="lg"
              coloredShadow="info"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <MDTypography variant="h6" color="#333">
                Processing Order
              </MDTypography>
              <Link to="/processing_order">
                <button
                  style={{
                    backgroundColor: "white",
                    color: "#333",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #333",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                    transition: "background-color 0.3s, transform 0.2s",
                  }}
                >
                  <MDTypography color="#333" style={{ marginRight: "8px", fontSize: "0.9em" }}>
                    View Details
                  </MDTypography>
                  <Icon sx={{ color: "#333" }}>arrow_forward</Icon>
                </button>
              </Link>
            </MDBox>
          </Grid>

          {/* On Shipping */}
          <Grid item xs={12}>
            <MDBox
              mx={2}
              mt={-3}
              py={3}
              px={2}
              bgColor="#EC5228"
              borderRadius="lg"
              coloredShadow="info"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <MDTypography variant="h6" color="white">
                Shipping Order
              </MDTypography>
              <Link to="/shipping_order">
                <button
                  style={{
                    backgroundColor: "white",
                    color: "#333",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #333",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                    transition: "background-color 0.3s, transform 0.2s",
                  }}
                >
                  <MDTypography color="#333" style={{ marginRight: "8px", fontSize: "0.9em" }}>
                    View Details
                  </MDTypography>
                  <Icon sx={{ color: "#333" }}>arrow_forward</Icon>
                </button>
              </Link>
            </MDBox>
          </Grid>

          {/* Shipped */}
          <Grid item xs={12}>
            <MDBox
              mx={2}
              mt={-3}
              py={3}
              px={2}
              bgColor="#3F7D58"
              borderRadius="lg"
              coloredShadow="info"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <MDTypography variant="h6" color="white">
                Shipped Order
              </MDTypography>
              <Link to="/shipped_order">
                <button
                  style={{
                    backgroundColor: "white",
                    color: "#333",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #333",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                    transition: "background-color 0.3s, transform 0.2s",
                  }}
                >
                  <MDTypography color="#333" style={{ marginRight: "8px", fontSize: "0.9em" }}>
                    View Details
                  </MDTypography>
                  <Icon sx={{ color: "#333" }}>arrow_forward</Icon>
                </button>
              </Link>
            </MDBox>
          </Grid>

          {/* Delivered */}
          <Grid item xs={12}>
            <MDBox
              mx={2}
              mt={-3}
              py={3}
              px={2}
              bgColor="#074799"
              borderRadius="lg"
              coloredShadow="info"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <MDTypography variant="h6" color="white">
                Delivered Order
              </MDTypography>
              <Link to="/delivered_order">
                <button
                  style={{
                    backgroundColor: "white",
                    color: "#333",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #333",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                    transition: "background-color 0.3s, transform 0.2s",
                  }}
                >
                  <MDTypography color="#333" style={{ marginRight: "8px", fontSize: "0.9em" }}>
                    View Details
                  </MDTypography>
                  <Icon sx={{ color: "#333" }}>arrow_forward</Icon>
                </button>
              </Link>
            </MDBox>
          </Grid>

          {/* Cancel */}
          <Grid item xs={12}>
            <MDBox
              mx={2}
              mt={-3}
              py={3}
              px={2}
              bgColor="error"
              borderRadius="lg"
              coloredShadow="info"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <MDTypography variant="h6" color="white">
                Cancelled Order
              </MDTypography>
              <Link to="/cancel_order">
                <button
                  style={{
                    backgroundColor: "white",
                    color: "#333",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #333",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                    transition: "background-color 0.3s, transform 0.2s",
                  }}
                >
                  <MDTypography color="#333" style={{ marginRight: "8px", fontSize: "0.9em" }}>
                    View Details
                  </MDTypography>
                  <Icon sx={{ color: "#333" }}>arrow_forward</Icon>
                </button>
              </Link>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Order;
