import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import { Grid, TextField, Button, Icon } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Link, useNavigate, useParams } from "react-router-dom";
import AccountService from "api/AccountService";

function ViewStaff() {
  const jwtToken = sessionStorage.getItem("jwtToken");
  const navigate = useNavigate();
  const [staff, setStaff] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      navigate("/sign-in", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const getStaffDetail = async () => {
      if (!jwtToken) return;
      try {
        const response = await AccountService.getStaffDetail(id);
        if (response) {
          console.log(response);
          setStaff(response);
        }
      } catch (error) {
        console.error("Can't access the server", error);
      }
    };
    getStaffDetail();
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
                  View staff
                </MDTypography>
              </MDBox>

              {/* Content */}
              <MDBox p={3}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={12}>
                    <form>
                      <Link to="/staff">
                        <Icon sx={{ cursor: "pointer", "&:hover": { color: "gray" } }}>
                          arrow_back
                        </Icon>
                      </Link>

                      {/* ID Staff */}
                      <TextField
                        fullWidth
                        label="ID"
                        value={staff.id || ""}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      {/* Name of staff */}
                      <TextField
                        fullWidth
                        label="Username of staff"
                        value={staff.username || ""}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      {/* Type */}
                      <TextField
                        fullWidth
                        label="Type"
                        value={staff.type || ""}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      {/* Status */}
                      <TextField
                        fullWidth
                        label="Status"
                        value={staff.status || ""}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      {/* SSN */}
                      <TextField
                        fullWidth
                        label="SSN (Social Security Number)"
                        value={staff.ssn || ""}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      {/* Phone */}
                      <TextField
                        fullWidth
                        label="Phone number"
                        value={staff.phonenumber || ""}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      {/* Real name */}
                      <TextField
                        fullWidth
                        label="Real name"
                        value={staff.realname || ""}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      {/* Email */}
                      <TextField
                        fullWidth
                        label="Email"
                        value={staff.email || ""}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />

                      <Grid container spacing={2} mt={1}>
                        {/* Date of birth */}
                        <Grid item xs={12} sm={12}>
                          <TextField
                            fullWidth
                            label="DOB (Date of birth)"
                            type="date"
                            value={staff.dob || ""}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                      </Grid>
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

export default ViewStaff;
