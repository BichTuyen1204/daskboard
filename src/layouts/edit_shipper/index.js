import { useEffect, useState } from "react";
import {
  Card,
  Grid,
  TextField,
  Button,
  MenuItem,
  Icon,
  InputAdornment,
  IconButton,
  Box,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import AccountService from "api/AccountService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function EditShipper() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));
  const [shipper, setShipper] = useState("");
  const [startTime, setStartTime] = useState("");
  const [startTimeError, setStartTimeError] = useState("");
  const [endTime, setEndTime] = useState("");
  const [endTimeError, setEndTimeError] = useState("");
  const [updateTimeShipperSuccess, setUpdateTimeShipperSuccess] = useState("");

  const [shipperAccount, setShipperAccount] = useState({
    shipper_id: "",
    start_time: "",
    end_time: "",
  });

  const formatTimeOnly = (date) => {
    return new Date(date).toISOString().split("T")[1]; // Lấy phần giờ từ chuỗi ISO
  };

  const updateTimeShipper = async (e) => {
    e.preventDefault();
    StartTimeBlur();
    EndTimeBlur();

    if (!startTimeError && startTime && !endTimeError && endTime) {
      const start = new Date(shipperAccount.start_time);
      const end = new Date(shipperAccount.end_time);

      if (end <= start) {
        setEndTimeError("End time must be after start time.");
        setUpdateTimeShipperSuccess("");
        return;
      }

      // Format lại chỉ gửi phần giờ
      const payload = {
        shipper_id: shipperAccount.shipper_id,
        start_time: formatTimeOnly(shipperAccount.start_time),
        end_time: formatTimeOnly(shipperAccount.end_time),
      };

      try {
        const response = await AccountService.updateTimeShipper(payload);
        setUpdateTimeShipperSuccess("Updated successfully.");
        setStartTimeError("");
        setEndTimeError("");
      } catch (error) {
        throw error;
      }
    }
  };

  const StartTimeChange = (e) => {
    const value = e.target.value;
    setStartTime(value);

    const timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
    const match = value.match(timeRegex);

    if (match) {
      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const period = match[3].toUpperCase();

      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;

      const now = new Date();
      const vietnamDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes
      );

      const utcISOString = vietnamDate.toISOString();

      setShipperAccount((preState) => ({
        ...preState,
        start_time: utcISOString,
      }));
    }
    setStartTimeError("");
    setUpdateTimeShipperSuccess(false);
  };

  const StartTimeBlur = () => {
    if (startTime === "") {
      setStartTimeError("Please enter a start time.");
    } else {
      setStartTimeError("");
    }
  };

  const EndTimeChange = (e) => {
    const value = e.target.value;
    setEndTime(value);

    const timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
    const match = value.match(timeRegex);

    if (match) {
      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const period = match[3].toUpperCase();

      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;

      const now = new Date();
      const vietnamDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes
      );

      const utcISOString = vietnamDate.toISOString();

      setShipperAccount((preState) => ({
        ...preState,
        end_time: utcISOString,
      }));
    }
    setEndTimeError("");
    setUpdateTimeShipperSuccess(false);
  };

  // Check end time
  const EndTimeBlur = () => {
    if (endTime === "") {
      setEndTimeError("Please enter a end time.");
    } else {
      setEndTimeError("");
    }
  };

  const utcToAMPM = (utcString) => {
    const date = new Date(utcString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    if (shipperAccount.start_time) {
      setStartTime(utcToAMPM(shipperAccount.start_time));
    }
    if (shipperAccount.end_time) {
      setEndTime(utcToAMPM(shipperAccount.end_time));
    }
  }, [shipperAccount]);

  useEffect(() => {
    setShipperAccount((prev) => ({
      ...prev,
      shipper_id: id,
    }));
  }, [id]);
  console.log("Sending data:", shipperAccount);

  return (
    <DashboardLayout>
      <MDBox pt={6} pb={3}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={10}>
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
                  Edit Shipper
                </MDTypography>
              </MDBox>

              {/* Content */}
              <MDBox p={3}>
                <Grid container spacing={3}>
                  {/* Account */}
                  <Grid item xs={12}>
                    <Link
                      to="/shipper"
                      onClick={() => {
                        setTimeout(() => {
                          window.location.reload();
                        }, 0);
                      }}
                    >
                      <Icon sx={{ cursor: "pointer", "&:hover": { color: "gray" } }}>
                        arrow_back
                      </Icon>
                    </Link>

                    <div>
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

                      {/* ID */}
                      <TextField
                        fullWidth
                        type="text"
                        value={id}
                        label="ID"
                        margin="normal"
                        InputProps={{ readOnly: true }}
                      />

                      {/* Start & End Time side by side */}
                      <Box sx={{ display: "flex", gap: 2, mb: 2, mt: 2 }}>
                        {/* Start time */}
                        <Box sx={{ flex: 1 }}>
                          <TextField
                            type="text"
                            fullWidth
                            value={startTime}
                            onChange={StartTimeChange}
                            onBlur={StartTimeBlur}
                            label={
                              <span style={{ fontSize: "0.9em" }}>
                                Start Time (AM/PM) <span style={{ color: "red" }}>*</span>
                              </span>
                            }
                            placeholder="02:30 PM"
                          />
                          {startTimeError && (
                            <p
                              style={{
                                fontWeight: "450",
                                color: "red",
                                fontSize: "0.6em",
                                marginTop: "4px",
                                marginLeft: "4px",
                              }}
                            >
                              {startTimeError}
                            </p>
                          )}
                        </Box>

                        {/* End time */}
                        <Box sx={{ flex: 1 }}>
                          <TextField
                            type="text"
                            fullWidth
                            value={endTime}
                            onChange={EndTimeChange}
                            onBlur={EndTimeBlur}
                            label={
                              <span style={{ fontSize: "0.9em" }}>
                                End Time (AM/PM) <span style={{ color: "red" }}>*</span>
                              </span>
                            }
                            placeholder="02:30 PM"
                          />
                          {endTimeError && (
                            <p
                              style={{
                                fontWeight: "450",
                                color: "red",
                                fontSize: "0.6em",
                                marginTop: "4px",
                                marginLeft: "4px",
                              }}
                            >
                              {endTimeError}
                            </p>
                          )}
                        </Box>
                      </Box>

                      {/* Success message */}
                      {updateTimeShipperSuccess && (
                        <p
                          style={{
                            color: "green",
                            fontSize: "0.6em",
                            fontWeight: "600",
                            marginLeft: "5px",
                            marginBottom: "5px",
                          }}
                        >
                          {updateTimeShipperSuccess}
                        </p>
                      )}

                      {/* Save button */}
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
                    </div>
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
