import { useEffect, useState } from "react";
import { Card, Grid, TextField, Button, MenuItem, Icon, Typography } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import AccountService from "api/AccountService";

function EditCustomer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));
  const [customer, setCustomer] = useState("");
  const [userName, setUserName] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [updateAccountSuccess, setUpdateAccountSuccess] = useState("");
  const [status, setStatus] = useState("");
  const [statusError, setStatusError] = useState("");
  const [updateStatusSuccess, setUpdateStatusSuccess] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [updateInforSuccess, setUpdateInforSuccess] = useState("");

  const [customerInfo, setCustomerInfo] = useState({
    username: "",
    password: "",
  });

  const [customerStatus, setCustomerStatus] = useState({
    status: "",
  });

  const [customerInfor, setCustomerInfor] = useState({
    email: "",
    address: "",
    phone: "",
    profile_description: "",
    profile_name: "",
  });

  useEffect(() => {
    if (!jwtToken) navigate("/sign-in", { replace: true });
  }, [navigate, jwtToken]);

  const getCustomerDetail = async () => {
    try {
      const response = await AccountService.getCustomerDetail(id);
      setCustomer(response);
      setUserName(response.username);
      setEmail(response.email || "");
      setAddress(response.address || "");
      setPhone(response.phone || "");

      setCustomerInfo({
        username: response.username || "",
      });

      setCustomerInfor((prev) => ({
        ...prev,
        email: response.email || "",
        phone: response.phone || "",
        address: response.address || "",
      }));
    } catch (error) {}
  };

  const updateAccount = async (e) => {
    e.preventDefault();
    PasswordBlur();
    if (!passwordError && password) {
      try {
        await AccountService.updateAccountCustomer(id, customerInfo);
        setUpdateAccountSuccess("The password updated successfully.");
        setUserNameError("");
      } catch (error) {
        if (error.response) {
          if (error.response.status === 500) {
            setUserNameError("Account already exists.");
          }
        } else {
          setUserNameError("Account already exists.");
        }
      }
    }
  };

  const updateStatus = async (e) => {
    e.preventDefault();
    StatusBlur();
    if (!statusError && status) {
      try {
        await AccountService.updateStatusCustomer(id, status);
        setUpdateStatusSuccess("Status updated successfully.");
      } catch (error) {}
    } else {
      setStatusError("You need to choose a status before saving.");
    }
  };

  const updateInfo = async (e) => {
    e.preventDefault();
    EmailBlur();
    PhoneBlur();
    if (!emailError && email && !phoneError && phone) {
      try {
        console.log("DATA GỬI:", customerInfor);
        await AccountService.updateInforCustomer(id, customerInfor);
        setUpdateInforSuccess("Info updated successfully.");
      } catch (error) {
        console.error("Update failed:", error.response?.data || error.message);
        throw error;
      }
    } else {
      console.log("Validation failed");
    }
  };

  const updateField = (field, value) => {
    setCustomerInfor((prevState) => ({
      ...prevState,
      [field]: value !== undefined && value !== null ? value : prevState[field],
    }));
  };

  const UserNameChange = (e) => {
    const { value } = e.target;
    setUserName(value);
    setUserNameError(false);
    setCustomerInfo((preState) => ({ ...preState, username: value }));
    setUpdateAccountSuccess(false);
  };

  const UserNameBlur = () => {
    if (userName === "") {
      setUserNameError("Please enter a username");
    } else {
      setUserNameError("");
    }
  };

  const PasswordChange = (e) => {
    const { value } = e.target;
    setPassword(value);
    setCustomerInfo((preState) => ({ ...preState, password: value }));
    setUpdateAccountSuccess(false);
  };

  const PasswordBlur = () => {
    if (password === "") {
      setPasswordError("Please enter a password");
    } else {
      setPasswordError("");
    }
  };

  const StatusChange = (e) => {
    const { value } = e.target;
    setStatus(value);
    setCustomerStatus((preState) => ({ ...preState, status: value }));
    setUserNameError(false);
    setUpdateStatusSuccess(false);
  };

  const StatusBlur = () => {
    if (status.trim === "") {
      setStatusError("Please enter a status");
    } else {
      setStatusError("");
    }
  };

  const EmailChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    setEmailError(false);
    updateField("email", value);
    setUpdateInforSuccess(false);
  };

  const ValidEmail = (e) => {
    const emailRegex = /@.*$/;
    return emailRegex.test(e);
  };

  const EmailBlur = () => {
    if (email.trim() === "") {
      setEmailError("Please enter your email");
    } else if (!ValidEmail(email.trim())) {
      setEmailError("Email must contain @ and .com");
    } else if (email.length < 6) {
      setEmailError("Email must be at least 6 characters long");
    } else if (email.length > 100) {
      setEmailError("Email must be less than 100 characters long");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please retype your email");
    } else if (/@[^\w@]+\w/.test(email)) {
      setEmailError("Please retype your email");
    } else if (!/^[^\s@]+@[^\d@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Numbers are not allowed after @.");
    } else {
      setEmailError("");
    }
  };

  const PhoneChange = (e) => {
    const { value } = e.target;
    setPhone(value);
    setPhoneError(false);
    updateField("phone", value);
    setUpdateInforSuccess(false);
  };

  // Check phone number
  const PhoneBlur = () => {
    if (phone.trim() === "") {
      setPhoneError("Please enter your phone number");
    } else if (phone.length < 10 || phone.length > 10) {
      setPhoneError("Your phone number must be 10 digits");
    } else if (!/^\d+$/.test(phone)) {
      setPhoneError("Your phone number just only number");
    } else if (!/^0/.test(phone)) {
      setPhoneError("Phone number must start with 0");
    } else {
      setPhoneError("");
    }
  };

  const AddressChange = (e) => {
    const { value } = e.target;
    setAddress(value);
    setAddressError(false);
    updateField("address", value);
    setUpdateInforSuccess(false);
  };

  const AddressBlur = () => {
    if (address === "") {
      setAddressError("Please enter a address");
    } else {
      setAddressError("");
    }
  };

  useEffect(() => {
    getCustomerDetail(id);
  }, [id]);

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
                  Edit User
                </MDTypography>
              </MDBox>

              {/* Content */}
              <MDBox p={3}>
                <Grid container spacing={3}>
                  {/* Account */}
                  <Grid item xs={12}>
                    <Link
                      to="/customer"
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
                      {/* Username */}
                      <TextField
                        fullWidth
                        type="text"
                        value={userName || ""}
                        onChange={UserNameChange}
                        onBlur={UserNameBlur}
                        label={"User name (Read only)"}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      {userNameError && (
                        <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                          {userNameError}
                        </p>
                      )}

                      {/* Password */}
                      <TextField
                        fullWidth
                        type="text"
                        value={password || ""}
                        onChange={PasswordChange}
                        onBlur={PasswordBlur}
                        label={
                          <span>
                            Password <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        margin="normal"
                      />
                      {passwordError && (
                        <p
                          style={{
                            color: "red",
                            fontSize: "0.6em",
                            marginLeft: "5px",
                            marginTop: "-5px",
                            marginBottom: "15px",
                          }}
                        >
                          {passwordError}
                        </p>
                      )}
                      {updateAccountSuccess && (
                        <p
                          style={{
                            color: "green",
                            fontSize: "0.6em",
                            fontWeight: "600",
                            marginLeft: "5px",
                            marginBottom: "5px",
                          }}
                        >
                          {updateAccountSuccess}
                        </p>
                      )}
                      <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        onClick={updateAccount}
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

                    <div>
                      <p
                        style={{
                          fontWeight: "700",
                          fontSize: "0.6em",
                          marginTop: "15px",
                          marginBottom: "-5px",
                        }}
                      >
                        UPDATE STATUS
                      </p>
                      {/* Status */}
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          select
                          label={
                            <span>
                              Status <span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          value={status || ""}
                          onChange={StatusChange}
                          onBlur={StatusBlur}
                          sx={{ height: "45px", ".MuiInputBase-root": { height: "45px" } }}
                          margin="normal"
                        >
                          <MenuItem value="NORMAL">NORMAL</MenuItem>
                          <MenuItem value="BANNED">BANNED</MenuItem>
                        </TextField>
                        {statusError && (
                          <p
                            style={{
                              color: "red",
                              fontSize: "0.6em",
                              marginLeft: "5px",
                              marginTop: "-5px",
                              marginBottom: "15px",
                            }}
                          >
                            {statusError}
                          </p>
                        )}
                        {updateStatusSuccess && (
                          <p
                            style={{
                              color: "green",
                              fontSize: "0.6em",
                              fontWeight: "600",
                              marginLeft: "5px",
                              marginBottom: "5px",
                            }}
                          >
                            {updateStatusSuccess}
                          </p>
                        )}

                        <Button
                          onClick={updateStatus}
                          variant="contained"
                          color="success"
                          fullWidth
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
                    </div>

                    <div>
                      <p
                        style={{
                          fontWeight: "700",
                          fontSize: "0.6em",
                          marginTop: "15px",
                          marginBottom: "-5px",
                        }}
                      >
                        UPDATE INFORMATION
                      </p>
                      <Grid item xs={12}>
                        {/* Email */}
                        <TextField
                          fullWidth
                          type="text"
                          value={email || ""}
                          onChange={EmailChange}
                          onBlur={EmailBlur}
                          label={
                            <span>
                              Email <span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          margin="normal"
                        />
                        {emailError && (
                          <p
                            style={{
                              color: "red",
                              fontSize: "0.6em",
                              marginLeft: "5px",
                              marginTop: "-6px",
                            }}
                          >
                            {emailError}
                          </p>
                        )}

                        {/* Phone */}
                        <TextField
                          fullWidth
                          type="text"
                          value={phone || ""}
                          onChange={PhoneChange}
                          onBlur={PhoneBlur}
                          label={
                            <span>
                              Phone number <span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          margin="normal"
                        />
                        {phoneError && (
                          <p
                            style={{
                              color: "red",
                              fontSize: "0.6em",
                              marginLeft: "5px",
                              marginTop: "-6px",
                            }}
                          >
                            {phoneError}
                          </p>
                        )}

                        {/* Address */}
                        <TextField
                          fullWidth
                          type="text"
                          value={address || ""}
                          onChange={AddressChange}
                          onBlur={AddressBlur}
                          label="Address"
                          margin="normal"
                        />
                        {addressError && (
                          <p
                            style={{
                              color: "red",
                              fontSize: "0.6em",
                              marginLeft: "5px",
                              marginTop: "-6px",
                              marginBottom: "15px",
                            }}
                          >
                            {addressError}
                          </p>
                        )}
                        {updateInforSuccess && (
                          <p
                            style={{
                              color: "green",
                              fontSize: "0.6em",
                              fontWeight: "600",
                              marginLeft: "5px",
                              marginBottom: "5px",
                            }}
                          >
                            {updateInforSuccess}
                          </p>
                        )}

                        <Button
                          onClick={updateInfo}
                          variant="contained"
                          color="success"
                          fullWidth
                          style={{
                            backgroundColor: "#00C1FF",
                            color: "white",
                            padding: "5px 10px",
                            fontSize: "0.6em",
                          }}
                        >
                          Save
                        </Button>
                      </Grid>
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

export default EditCustomer;
