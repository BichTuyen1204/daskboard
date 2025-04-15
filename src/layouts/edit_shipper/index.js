import { useEffect, useState } from "react";
import { Card, Grid, TextField, Button, Icon, Box } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import AccountService from "api/AccountService";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

function EditShipper() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [updateTimeShipperSuccess, setUpdateTimeShipperSuccess] = useState("");
  const [startTimeError, setStartTimeError] = useState("");
  const [endTimeError, setEndTimeError] = useState("");

  const [shipperAccount, setShipperAccount] = useState({
    shipper_id: "",
    start_time: null,
    end_time: null,
  });

  const updateTimeShipper = async (e) => {
    e.preventDefault();

    if (!shipperAccount.start_time) {
      setStartTimeError("Please enter a start time.");
      return;
    } else {
      setStartTimeError("");
    }

    if (!shipperAccount.end_time) {
      setEndTimeError("Please enter an end time.");
      return;
    } else {
      setEndTimeError("");
    }

    if (shipperAccount.end_time.isBefore(shipperAccount.start_time)) {
      setEndTimeError("End time must be after start time.");
      return;
    }

    const formatTimeOnly = (time) => {
      return dayjs(time).format("HH:mm:ss");
    };

    const payload = {
      shipper_id: shipperAccount.shipper_id,
      start_time: formatTimeOnly(shipperAccount.start_time),
      end_time: formatTimeOnly(shipperAccount.end_time),
    };

    try {
      await AccountService.updateTimeShipper(payload);
      setUpdateTimeShipperSuccess("Updated successfully.");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setShipperAccount((prev) => ({
      ...prev,
      shipper_id: id,
    }));
  }, [id]);

  return (
    <DashboardLayout>
      <MDBox pt={6} pb={3}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={10}>
            <Card>
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
                  Edit Shipper
                </MDTypography>
              </MDBox>

              <MDBox p={3}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Link
                      to="/shipper"
                      onClick={() => setTimeout(() => window.location.reload(), 0)}
                    >
                      <Icon sx={{ cursor: "pointer", "&:hover": { color: "gray" } }}>
                        arrow_back
                      </Icon>
                    </Link>

                    <p
                      style={{
                        fontWeight: "700",
                        fontSize: "0.6em",
                        marginTop: "15px",
                        marginBottom: "-5px",
                      }}
                    >
                      UPDATE ACCOUNT
                    </p>

                    <TextField
                      fullWidth
                      type="text"
                      value={id}
                      label="ID"
                      margin="normal"
                      InputProps={{ readOnly: true }}
                    />

                    <Box sx={{ display: "flex", gap: 2, mb: 2, mt: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <TimePicker
                            label={
                              <span style={{ fontSize: "0.9em" }}>
                                Start Time <span style={{ color: "red" }}>*</span>
                              </span>
                            }
                            value={shipperAccount.start_time}
                            onChange={(newValue) => {
                              setShipperAccount((prev) => ({
                                ...prev,
                                start_time: newValue,
                              }));
                              setStartTimeError("");
                            }}
                            ampm
                            open={false}
                            onOpen={() => {}}
                            onClose={() => {}}
                            slots={{
                              openPickerIcon: () => null,
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                fullWidth
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: null,
                                  readOnly: false,
                                }}
                              />
                            )}
                          />
                        </LocalizationProvider>
                        {startTimeError && (
                          <p style={{ color: "red", fontSize: "0.7em", marginTop: "4px" }}>
                            {startTimeError}
                          </p>
                        )}
                      </Box>

                      <Box sx={{ flex: 1 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <TimePicker
                            label={
                              <span style={{ fontSize: "0.9em" }}>
                                End Time <span style={{ color: "red" }}>*</span>
                              </span>
                            }
                            value={shipperAccount.end_time}
                            onChange={(newValue) => {
                              setShipperAccount((prev) => ({
                                ...prev,
                                end_time: newValue,
                              }));
                              setEndTimeError("");
                            }}
                            ampm
                            open={false}
                            onOpen={() => {}}
                            onClose={() => {}}
                            slots={{
                              openPickerIcon: () => null,
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                fullWidth
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: null,
                                  readOnly: false,
                                }}
                              />
                            )}
                          />
                        </LocalizationProvider>
                        {endTimeError && (
                          <p style={{ color: "red", fontSize: "0.7em", marginTop: "4px" }}>
                            {endTimeError}
                          </p>
                        )}
                      </Box>
                    </Box>

                    {updateTimeShipperSuccess && (
                      <p style={{ color: "green", fontSize: "0.6em", fontWeight: "600" }}>
                        {updateTimeShipperSuccess}
                      </p>
                    )}

                    <Button
                      variant="contained"
                      color="success"
                      fullWidth
                      onClick={updateTimeShipper}
                      style={{
                        backgroundColor: "#00C1FF",
                        color: "white",
                        padding: "5px 10px",
                        fontSize: "0.6em",
                      }}
                    >
                      Save
                    </Button>

                    <hr style={{ marginTop: "40px" }} />
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

export default EditShipper;
