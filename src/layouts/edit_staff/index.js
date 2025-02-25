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
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import AccountService from "api/AccountService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function EditStaff() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));
  const [staff, setStaff] = useState("");
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
  const [ssn, setSsn] = useState("");
  const [ssnError, setSsnError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [realName, setRealName] = useState("");
  const [realNameError, setRealNameError] = useState("");
  const [dob, setDob] = useState("");
  const [dobError, setDobError] = useState("");
  const [updateInforSuccess, setUpdateInforSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [staffAccount, setStaffAccount] = useState({
    username: "",
    password: "",
  });

  const [staffStatus, setStaffStatus] = useState({
    status: "",
  });

  const [staffInfor, setStaffInfor] = useState({
    ssn: "",
    phonenumber: "",
    realname: "",
    email: "",
    dob: "",
  });

  useEffect(() => {
    if (!jwtToken) navigate("/sign-in", { replace: true });
  }, [navigate, jwtToken]);

  const getStaffDetail = async () => {
    try {
      const response = await AccountService.getStaffDetail(id);
      console.log("nice", response);
      setStaff(response);
      setUserName(response.username);
      setStatus(response.status);
      setSsn(response.ssn);
      setEmail(response.email || "");
      setRealName(response.realname || "");
      setPhone(response.phonenumber || "");
      setDob(response.dob || "");

      setStaffAccount({
        username: response.username || "",
      });

      setStaffInfor({
        ssn: response.ssn || "",
        email: response.email || "",
        realname: response.realname || "",
        phonenumber: response.phonenumber || "",
        dob: response.dob || "",
      });
    } catch (error) {
      console.error("Can't access the server", error);
    }
  };

  useEffect(() => {
    getStaffDetail(id);
  }, [id]);

  const updateAccount = async (e) => {
    e.preventDefault();
    UserNameBlur();
    PasswordBlur();
    if (!userNameError && userName && !passwordError && password) {
      try {
        const response = await AccountService.updateAccountStaff(id, staffAccount);
        console.log("Update account successful", response);
        setUpdateAccountSuccess("Username and password updated successfully.");
        setUserNameError("");
      } catch (error) {
        console.error(
          "Error when updating account:",
          error.response ? error.response.data : error.message
        );

        if (error.response) {
          if (error.response.status === 500) {
            setUserNameError("Username already exists.");
          }
        } else {
          setUserNameError("Username already exists.");
        }
      }
    }
  };

  const updateStatus = async (e) => {
    e.preventDefault();
    StatusBlur();
    if (!statusError && status) {
      try {
        const response = await AccountService.updateStatusStaff(id, status);
        console.log("Update status successful", response);
        setUpdateStatusSuccess("Status updated successfully.");
      } catch (error) {
        console.error(
          "Error during API calls:",
          error.response ? error.response.data : error.message
        );
      }
    }
  };

  const updateInfo = async (e) => {
    e.preventDefault();
    SsnBlur();
    RealNameBlur();
    DobBlur();
    EmailBlur();
    PhoneBlur();
    console.log("Data before submit:", staffInfor);
    if (
      !emailError &&
      email &&
      !phoneError &&
      phone &&
      !ssnError &&
      ssn &&
      !realNameError &&
      realName &&
      !dobError &&
      dob
    ) {
      try {
        const response = await AccountService.updateInforStaff(id, staffInfor);
        console.log("Update Info successful", response);
        setUpdateInforSuccess("Info updated successfully.");
      } catch (error) {
        console.error(
          "Error during API calls:",
          error.response ? error.response.data : error.message
        );
      }
    }
  };

  const updateField = (field, value) => {
    setStaffInfor((prevState) => ({
      ...prevState,
      [field]: value !== undefined && value !== null ? value : prevState[field],
    }));
  };

  const UserNameChange = (e) => {
    const { value } = e.target;
    setUserName(value);
    setStaffAccount((preState) => ({ ...preState, username: value }));
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
    setStaffAccount((preState) => ({ ...preState, password: value }));
    setUpdateAccountSuccess(false);
  };

  // Check password
  const PasswordBlur = () => {
    const enteredPassword = password.trim();
    if (enteredPassword === "") {
      setPasswordError("Please enter your password");
    } else if (enteredPassword.length < 6) {
      setPasswordError("Password must be longer than 6 characters");
    } else if (enteredPassword.length > 30) {
      setPasswordError("Password must be shorter than 30 characters");
    } else {
      setPasswordError("");
    }
  };

  // Show and hidden password
  const PasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const StatusChange = (e) => {
    const { value } = e.target;
    setStatus(value);
    setStaffStatus((preState) => ({ ...preState, status: value }));
    setStatusError(false);
    setUpdateStatusSuccess(false);
  };

  const StatusBlur = () => {
    if (status.trim === "") {
      setStatusError("Please enter a status");
    } else {
      setStatusError("");
    }
  };

  const SsnChange = (e) => {
    const { value } = e.target;
    setSsn(value);
    setSsnError(false);
    updateField("ssn", value);
    setUpdateInforSuccess(false);
  };

  const SsnBlur = () => {
    if (ssn.trim() === "") {
      setSsnError("Please enter the ssn");
    } else if (ssn.length !== 12) {
      setSsnError("SSN must be 12 digits");
    } else if (!/^\d+$/.test(ssn)) {
      setSsnError("The SSN must be a number");
    } else if (!/^0/.test(ssn)) {
      setSsnError("The SSN must start with 0");
    } else {
      setSsnError("");
    }
  };

  const RealNameChange = (e) => {
    const { value } = e.target;
    setRealName(value);
    setRealNameError(false);
    updateField("realname", value);
    setUpdateInforSuccess(false);
  };

  const RealNameBlur = () => {
    if (realName.trim() === "") {
      setRealNameError("Please enter the real name");
    } else if (!/^[A-Za-z\s]+$/.test(realName)) {
      setRealNameError("Real name must contain only letters");
    } else {
      setRealNameError("");
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
    updateField("phonenumber", value);
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

  const DobChange = (e) => {
    const { value } = e.target;
    setDob(value);
    setDobError(false);
    updateField("dob", value);
    setUpdateInforSuccess(false);
  };

  const DobBlur = () => {
    if (dob === "") {
      setDobError("Please enter the dob");
    } else {
      setDobError("");
    }
  };

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
                  Edit Staff
                </MDTypography>
              </MDBox>

              {/* Content */}
              <MDBox p={3}>
                <Grid container spacing={3}>
                  {/* Account */}
                  <Grid item xs={12}>
                    <Link
                      to="/staff"
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
                        label="Username"
                        margin="normal"
                      />
                      {userNameError && (
                        <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                          {userNameError}
                        </p>
                      )}
                      {/* Password */}
                      <TextField
                        fullWidth
                        type={showPassword ? "text" : "password"}
                        value={password || ""}
                        onChange={PasswordChange}
                        onBlur={PasswordBlur}
                        label="Password"
                        margin="normal"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={PasswordVisibility} edge="end">
                                <FontAwesomeIcon
                                  style={{ width: "18px", height: "18px" }}
                                  icon={showPassword ? faEyeSlash : faEye}
                                />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />

                      {passwordError && (
                        <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
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
                          label="Status"
                          value={status || ""}
                          onChange={StatusChange}
                          onBlur={StatusBlur}
                          sx={{ height: "45px", ".MuiInputBase-root": { height: "45px" } }}
                          margin="normal"
                        >
                          <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                          <MenuItem value="DISABLE">DISABLE</MenuItem>
                        </TextField>
                        {statusError && (
                          <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
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
                          label="Email"
                          margin="normal"
                        />
                        {emailError && (
                          <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                            {emailError}
                          </p>
                        )}

                        {/* Phone */}
                        <TextField
                          fullWidth
                          type="number"
                          value={phone || ""}
                          onChange={PhoneChange}
                          onBlur={PhoneBlur}
                          label="Phone number"
                          margin="normal"
                        />
                        {phoneError && (
                          <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                            {phoneError}
                          </p>
                        )}

                        {/* Real name */}
                        <TextField
                          fullWidth
                          type="text"
                          value={realName || ""}
                          onChange={RealNameChange}
                          onBlur={RealNameBlur}
                          label="Real name"
                          margin="normal"
                        />
                        {realNameError && (
                          <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                            {realNameError}
                          </p>
                        )}

                        {/* SSN */}
                        <TextField
                          fullWidth
                          type="number"
                          value={ssn || ""}
                          onChange={SsnChange}
                          onBlur={SsnBlur}
                          label="SSN (Social Security Number)"
                          margin="normal"
                        />
                        {ssnError && (
                          <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                            {ssnError}
                          </p>
                        )}

                        {/* DOB */}
                        <TextField
                          fullWidth
                          type="text"
                          value={dob || ""}
                          onChange={DobChange}
                          onBlur={DobBlur}
                          label="DOB (Date of birth)"
                          margin="normal"
                        />
                        {dobError && (
                          <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                            {dobError}
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

export default EditStaff;
