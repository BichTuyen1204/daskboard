import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import { Grid, TextField, Button, Icon } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Link, useNavigate, useParams } from "react-router-dom";
import AccountService from "api/AccountService";

function ViewCustomer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [customer, setCustomer] = useState("");
  const jwtToken = sessionStorage.getItem("jwtToken");

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      navigate("/sign-in", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const getCustomerDetail = async () => {
      if (!jwtToken) return;
      try {
        const response = await AccountService.getCustomerDetail(id);
        if (response) {
          setCustomer(response);
        }
      } catch (error) {}
    };
    getCustomerDetail();
  }, [id, jwtToken]);

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
                  View user detail
                </MDTypography>
              </MDBox>

              {/* Content */}
              <MDBox p={3}>
                <Grid container spacing={3}>
                  {/* Right Section: Product Info */}
                  <Grid item xs={12} md={12}>
                    <Link to="/customer">
                      <Icon sx={{ cursor: "pointer", "&:hover": { color: "gray" } }}>
                        arrow_back
                      </Icon>
                    </Link>
                    <form>
                      <TextField
                        fullWidth
                        label="ID"
                        value={customer.id || ""}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      {/* Usage left */}
                      <TextField
                        fullWidth
                        label="Email"
                        type="text"
                        value={customer.email || ""}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />

                      {/* Usage left */}
                      <TextField
                        fullWidth
                        label="Username"
                        type="text"
                        value={customer.username || ""}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />

                      {/* Usage left */}
                      <TextField
                        fullWidth
                        label="Address"
                        type="text"
                        value={customer.address || ""}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />

                      {/* Usage left */}
                      <TextField
                        fullWidth
                        label="Phone number"
                        type="text"
                        value={customer.phone || ""}
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

export default ViewCustomer;
