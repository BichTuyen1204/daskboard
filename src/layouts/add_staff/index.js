import { useState } from "react";
import Card from "@mui/material/Card";
import { Grid, TextField, Button, Icon } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Link } from "react-router-dom";

function AddStaff() {
  const [username, setUsername] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [type, setType] = useState("");
  const [typeError, setTypeError] = useState("");
  const [ssn, setSsn] = useState("");
  const [ssnError, setSsnError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [realName, setRealName] = useState("");
  const [realNameError, setRealNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [dob, setDob] = useState("");
  const [dobError, setDobError] = useState("");
  const [accountStatus, setAccountStatus] = useState("");

  const [staff, setStaff] = useState({
    username: "",
    password: "",
    type: "",
    ssn: "",
    phonenumber: "",
    realname: "",
    email: "",
    dob: "",
    account_status: "ACTIVE",
  });

  // Receives username
  const userNameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    setStaff((preState) => ({ ...preState, username: value }));
  };

  // Check username
  const userNameBlur = () => {
    if (username.trim() === "") {
      setUserNameError("Please enter your full name");
    } else if (username.length < 2) {
      setUserNameError("The full name must be at least 2 characters");
    } else if (username.length > 100) {
      setUserNameError("The full name must be less than 100 characters");
    } else {
      setUserNameError("");
    }
  };

  /* Receive password */
  const passwordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setStaff((preState) => ({ ...preState, password: value }));
  };

  // Check password
  const passwordBlur = () => {
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

  /* Receive type */
  const typeChange = (e) => {
    const value = e.target.value;
    setType(value);
    setStaff((preState) => ({ ...preState, type: value }));
  };

  /* Receive ssn */
  const ssnChange = (e) => {
    const value = e.target.value;
    setSsn(value);
    setStaff((preState) => ({ ...preState, ssn: value }));
  };

  // Check ssn
  const ssnBlur = () => {
    const enteredssn = password.trim();
    if (enteredssn === "") {
      setSsnError("Please enter ssn");
    } else if (enteredssn.length < 12) {
      setSsnError("SSN must be 12 digits");
    } else if (enteredssn.length > 12) {
      setSsnError("SSN must be 12 digits");
    } else if (!/^\d+$/.test(ssn)) {
      setSsnError("The SSN must be a number");
    } else if (!/^0/.test(ssn)) {
      setSsnError("The SSN must start with 0");
    } else {
      setSsnError("");
    }
  };

  // Receive phone number
  const phoneChange = (e) => {
    const { value } = e.target;
    setPhone(value);
    setStaff((preState) => ({ ...preState, phonenumber: value }));
  };

  // Check phone number
  const phoneBlur = () => {
    if (phoneNumber.trim() === "") {
      setPhoneNumberError("Please enter your phone number");
    } else if (phoneNumber.length < 10 || phoneNumber.length > 10) {
      setPhoneNumberError("Your phone number must be 10 digits");
    } else if (!/^\d+$/.test(phoneNumber)) {
      setPhoneNumberError("Your phone number just only number");
    } else if (!/^0/.test(phoneNumber)) {
      setPhoneNumberError("Phone number must start with 0");
    } else {
      setPhoneNumberError("");
    }
  };

  // Receive real name
  const realNameChange = (e) => {
    const { value } = e.target;
    setRealName(value);
    setStaff((preState) => ({ ...preState, realname: value }));
  };

  // Check real name
  const realNameBlur = () => {
    if (realName.trim() === "") {
      setRealNameError("Please enter real name");
    } else if (realName.length < 4) {
      setRealNameError("The real name must be at least 4 characters");
    } else if (realName.length > 100) {
      setRealNameError("The real name must be less than 100 characters");
    } else {
      setRealNameError("");
    }
  };

  // Receives email
  const emailChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    setStaff((preState) => ({ ...preState, email: value }));
  };

  // Check email
  const ValidEmail = (e) => {
    const emailRegex = /@.*$/;
    return emailRegex.test(e);
  };

  // Check email
  const EmailBlur = () => {
    if (email.trim() === "") {
      setEmailError("Please enter the email");
    } else if (!ValidEmail(email.trim())) {
      setEmailError("Email must contain @ and .com");
    } else if (email.length < 6) {
      setEmailError("Email must be at least 6 characters long");
    } else if (email.length > 100) {
      setEmailError("Email must be less than 100 characters long");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please retype the email");
    } else if (/@[^\w@]+\w/.test(email)) {
      setEmailError("Please retype the email");
    } else if (!/^[^\s@]+@[^\d@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Numbers are not allowed after @");
    } else {
      setEmailError("");
    }
  };

  // Receive dob
  const dobChange = (e) => {
    const { value } = e.target;
    setDob(value);
    setStaff((preState) => ({ ...preState, dob: value }));
  };

  // Check real name
  const dobBlur = () => {
    if (dob.trim() === "") {
      setDobError("Please enter the dob");
    } else {
      setDobError("");
    }
  };

  const handleChange = (field, value) => {
    setStaff((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
                  {/* Right Section: Product Info */}
                  <Grid item xs={12} md={12}>
                    <form>
                      {/* Icon back start */}
                      <Link to="/staff">
                        <Icon sx={{ cursor: "pointer", "&:hover": { color: "gray" } }}>
                          arrow_back
                        </Icon>
                      </Link>
                      {/* Icon back end */}

                      {/* Name of staff */}
                      <TextField
                        fullWidth
                        label="Name of staff"
                        margin="normal"
                        onChange={(e) => handleChange("name", e.target.value)}
                      />
                      {/* Citizen Identification Card */}
                      <TextField
                        fullWidth
                        label="Citizen Identification Card"
                        margin="normal"
                        onChange={(e) => handleChange("name", e.target.value)}
                      />
                      {/* Phone number */}
                      <TextField
                        fullWidth
                        label="Number phone"
                        margin="normal"
                        onChange={(e) => handleChange("name", e.target.value)}
                      />

                      <Grid container spacing={2} mt={1}>
                        {/* Date of start */}
                        <Grid item xs={12} sm={12}>
                          <TextField
                            fullWidth
                            label="Date of start"
                            type="date"
                            onChange={(e) => handleChange("dateOfStart", e.target.value)}
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

export default AddStaff;
