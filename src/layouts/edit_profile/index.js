import { useEffect, useState } from "react";
import { Card, Grid, TextField, Button, MenuItem, Icon } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import AccountService from "api/AccountService";

function EditProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));
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

  const [staff, setStaff] = useState({
    ssn: "",
    phonenumber: "",
    realname: "",
    email: "",
    dob: "",
  });

  // Ensure user is authenticated
  useEffect(() => {
    if (!jwtToken) navigate("/sign-in", { replace: true });
  }, [navigate, jwtToken]);

  useEffect(() => {
    const getStaffDetail = async () => {
      if (jwtToken) {
        try {
          const response = await AccountService.getStaffDetail(id);
          setStaff(response);
        } catch (error) {
          console.error("Can't access the server", error);
        }
      }
    };
    getStaffDetail();
  }, [id, jwtToken]);

  const SsnChange = (e) => {
    const { value } = e.target;
    setSsn(value);
    setStaff((preState) => ({ ...preState, ssn: value }));
  };

  const SSnBlur = () => {
    if (ssn.trim === "") {
      setSsnError("The ssn is required.");
    } else if (!/^0/.test(ssn)) {
      setSsnError("The SSN must start with 0.");
    } else {
      setSsnError("");
    }
  };

  const PhoneChange = (e) => {
    const { value } = e.target;
    setPhoneNumber(value);
    setStaff((preState) => ({ ...preState, phonenumber: value }));
  };

  const PhoneBlur = () => {
    if (phoneNumber.trim === "") {
      setPhoneNumberError("The phone number is required.");
    } else if (phoneNumber.length !== 10) {
      setPhoneNumberError("Your phone number must be 10 digits");
    } else if (!/^\d+$/.test(phoneNumber)) {
      setPhoneNumberError("Your phone number must contain only numbers");
    } else if (!/^0/.test(phoneNumber)) {
      setPhoneNumberError("Phone number must start with 0");
    } else {
      setPhoneNumberError("");
    }
  };

  const RealNameChange = (e) => {
    const { value } = e.target;
    setRealName(value);
    setStaff((preState) => ({ ...preState, realname: value }));
  };

  const RealNameBlur = () => {
    if (realName.trim() === "") {
      setRealNameError("The real name is required.");
    } else if (realName < 4) {
      setRealNameError("The real name must be at least 4 characters");
    } else if (realName > 100) {
      setRealNameError("The real name must be less than 100 characters");
    } else {
      setRealNameError("");
    }
  };

  const EmailChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    setStaff((preState) => ({ ...preState, email: value }));
  };

  const EmailBlur = () => {
    if (email.trim() === "") {
      setEmailError("The email is required.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const DobChange = (e) => {
    const { value } = e.target;
    setDob(value);
    setStaff((preState) => ({ ...preState, dob: value }));
  };

  const DobBlur = () => {
    if (dob.trim() === "") {
      setDobError("The dob is required.");
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
                  Edit Profile
                </MDTypography>
              </MDBox>

              {/* Content */}
              <MDBox p={3}>
                <Grid container spacing={3}>
                  {/* Product Info */}
                  <Grid item xs={12}>
                    <Link
                      to={`/profile_detail/${staff.id}`}
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
                      {/* SSN */}
                      <TextField
                        fullWidth
                        type="text"
                        value="Nguyen Van A"
                        onChange={SsnChange}
                        onBlur={SSnBlur}
                        label="Username"
                        margin="normal"
                      />
                      {ssnError && (
                        <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                          {ssnError}
                        </p>
                      )}

                      {/* SSN */}
                      <TextField
                        fullWidth
                        type="number"
                        value={123456}
                        onChange={SsnChange}
                        onBlur={SSnBlur}
                        label="Password"
                        margin="normal"
                      />
                      {ssnError && (
                        <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                          {ssnError}
                        </p>
                      )}

                      {/* SSN */}
                      <TextField
                        fullWidth
                        type="number"
                        value="0999999999999"
                        onChange={SsnChange}
                        onBlur={SSnBlur}
                        label="SSN"
                        margin="normal"
                      />
                      {ssnError && (
                        <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                          {ssnError}
                        </p>
                      )}

                      {/* Phone number */}
                      <TextField
                        fullWidth
                        type="number"
                        value="0999999999"
                        onChange={PhoneChange}
                        onBlur={phoneNumberError}
                        label="Phone number"
                        margin="normal"
                      />
                      {phoneNumberError && (
                        <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                          {phoneNumberError}
                        </p>
                      )}

                      {/* Real name */}
                      <TextField
                        fullWidth
                        type="text"
                        value={realName || ""}
                        onBlur={RealNameBlur}
                        label="Real name"
                        margin="normal"
                      />
                      {realNameError && (
                        <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                          {realNameError}
                        </p>
                      )}

                      {/* Real name */}
                      <TextField
                        fullWidth
                        type="text"
                        value="nguyenvana@gmail.com"
                        onBlur={RealNameBlur}
                        label="Email"
                        margin="normal"
                      />
                      {realNameError && (
                        <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                          {realNameError}
                        </p>
                      )}

                      <TextField
                        fullWidth
                        type="date"
                        value={realName}
                        onChange={RealNameChange}
                        onBlur={RealNameBlur}
                        label="Dob"
                        InputLabelProps={{ shrink: true }}
                        margin="normal"
                      />
                      {realNameError && (
                        <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                          {realNameError}
                        </p>
                      )}

                      {/* Real name */}
                      <TextField
                        fullWidth
                        type="text"
                        value={realName || ""}
                        onChange={RealNameChange}
                        onBlur={RealNameBlur}
                        label="Status"
                        margin="normal"
                      />
                      {realNameError && (
                        <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                          {realNameError}
                        </p>
                      )}
                    </div>
                  </Grid>

                  <Grid item xs={12}></Grid>
                </Grid>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default EditProfile;
