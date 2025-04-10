import { useState } from "react";
import Card from "@mui/material/Card";
import { Grid, TextField, Button, Icon } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Link } from "react-router-dom";
import AccountService from "api/AccountService";

function AddShipper() {
  const [addSuccess, setAddSuccess] = useState(false);
  const [shipper, setShipper] = useState({
    username: "",
    password: "",
    type: 3,
    employee_info: {
      ssn: "",
      phonenumber: "",
      realname: "",
      email: "",
      dob: "",
    },
    account_status: "ACTIVE",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    ssn: "",
    phonenumber: "",
    realname: "",
    email: "",
    dob: "",
  });

  const validateField = (name, value) => {
    let errorMessage = "";

    switch (name) {
      case "username":
        if (!value) errorMessage = "Please enter the username of the shipper.";
        else if (value.length < 2) errorMessage = "The full name must be at least 2 characters.";
        else if (value.length > 100)
          errorMessage = "The full name must be less than 100 characters.";
        break;

      case "password":
        if (!value) errorMessage = "Please enter the password.";
        else if (value.length < 6) errorMessage = "Password must be longer than 6 characters.";
        else if (value.length > 30) errorMessage = "Password must be shorter than 30 characters.";
        break;

      case "ssn":
        if (!value) errorMessage = "Please enter the SSN.";
        else if (value.length !== 12) errorMessage = "SSN must be 12 digits.";
        else if (!/^\d+$/.test(value)) errorMessage = "The SSN must be a number.";
        else if (!/^0/.test(value)) errorMessage = "The SSN must start with 0.";
        break;

      case "phonenumber":
        if (!value) errorMessage = "Please enter the phone number.";
        else if (value.length !== 10) errorMessage = "The phone number must be 10 digits.";
        else if (!/^\d+$/.test(value)) errorMessage = "The phone number must contain only numbers.";
        else if (!/^0/.test(value)) errorMessage = "The phone number must start with 0.";
        break;

      case "realname":
        if (!value) errorMessage = "Please enter the real name of the shipper.";
        else if (value.length < 4) errorMessage = "The real name must be at least 4 characters.";
        else if (value.length > 100)
          errorMessage = "The real name must be less than 100 characters.";
        break;

      case "email":
        if (!value) errorMessage = "Please enter the email.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          errorMessage = "Please enter a valid email address.";
        break;

      case "dob":
        if (!value) {
          errorMessage = "Please enter the date of birth.";
        } else {
          const dob = new Date(value);
          const today = new Date();
          const minAllowedDob = new Date(
            today.getFullYear() - 18,
            today.getMonth(),
            today.getDate()
          );

          if (dob > minAllowedDob) {
            errorMessage = "Shipper must be at least 18 years old.";
          }
        }
        break;

      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
    return errorMessage === "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in shipper.employee_info) {
      setShipper((prevShipper) => ({
        ...prevShipper,
        employee_info: { ...prevShipper.employee_info, [name]: value },
      }));
    } else {
      setShipper((prevShipper) => ({ ...prevShipper, [name]: value }));
    }
    setAddSuccess(false);
    validateField(name, value);
  };

  const handleSubmit = async () => {
    const isValid = Object.keys(errors).every((key) =>
      validateField(key, key in shipper.employee_info ? shipper.employee_info[key] : shipper[key])
    );
    if (isValid) {
      try {
        const response = await AccountService.addStaff(shipper);
        setAddSuccess(true);
      } catch (error) {
        if (error.response && error.response.status === 500) {
          const message = error.response.data.message;
          const newErrors = {};
          const matchUsername = message.match(/\(username\)=\((.+?)\)/);
          if (matchUsername) {
            const duplicatedUsername = matchUsername[1];
            newErrors.username = `Username '${duplicatedUsername}' already exists.`;
          }

          const matchSsn = message.match(/\(ssn\)=\((.+?)\)/);
          if (matchSsn) {
            const duplicatedSsn = matchSsn[1];
            newErrors.ssn = `SSN '${duplicatedSsn}' already exists.`;
          }

          const matchPhone = message.match(/\(phonenumber\)=\((.+?)\)/);
          if (matchPhone) {
            const duplicatedPhone = matchPhone[1];
            newErrors.phonenumber = `Phone number '${duplicatedPhone}' already exists.`;
          }

          const matchEmail = message.match(/\(email\)=\((.+?)\)/);
          if (matchEmail) {
            const duplicatedEmail = matchEmail[1];
            newErrors.email = `The email '${duplicatedEmail}' already exists.`;
          }

          setErrors((prevErrors) => ({
            ...prevErrors,
            ...newErrors,
          }));

          setAddSuccess(false);
        } else {
          console.error("Unhandled error:", error);
        }
      }
    }
  };

  return (
    <DashboardLayout>
      <MDBox pt={6} pb={3}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={12} lg={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
              >
                <MDTypography variant="h6" color="white">
                  Add Shipper
                </MDTypography>
              </MDBox>

              <MDBox p={3}>
                <form>
                  <Link to="/shipper">
                    <Icon sx={{ cursor: "pointer", "&:hover": { color: "gray" } }}>arrow_back</Icon>
                  </Link>

                  {[
                    { label: "Username", name: "username", value: shipper.username },
                    { label: "Password", name: "password", value: shipper.password },
                    { label: "SSN", name: "ssn", value: shipper.employee_info.ssn },
                    {
                      label: "Phone Number",
                      name: "phonenumber",
                      value: shipper.employee_info.phonenumber,
                    },
                    { label: "Real Name", name: "realname", value: shipper.employee_info.realname },
                    { label: "Email", name: "email", value: shipper.employee_info.email },
                  ].map((field) => (
                    <TextField
                      fullWidth
                      label={
                        <span>
                          {field.label} <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      margin="normal"
                      name={field.name}
                      value={field.value}
                      onChange={handleChange}
                      onBlur={(e) => validateField(field.name, e.target.value)}
                      key={field.name}
                      error={!!errors[field.name]}
                      helperText={errors[field.name]}
                      sx={{
                        "& .MuiInputLabel-root": {
                          fontSize: "0.7em",
                        },
                        "& .MuiFormHelperText-root": {
                          fontSize: "0.6em",
                          marginLeft: "10px",
                          marginTop: "7px",
                          fontWeight: "500",
                        },
                      }}
                    />
                  ))}

                  <TextField
                    fullWidth
                    label={
                      <span>
                        Date of Birth <span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    type="date"
                    name="dob"
                    value={shipper.employee_info.dob}
                    onChange={handleChange}
                    onBlur={(e) => validateField("dob", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.dob}
                    helperText={errors.dob}
                    inputProps={{
                      max: new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                        .toISOString()
                        .split("T")[0],
                    }}
                    sx={{
                      marginTop: "20px",
                      "& .MuiInputLabel-root": {
                        fontSize: "0.7em",
                      },
                      "& .MuiFormHelperText-root": {
                        fontSize: "0.6em",
                        marginLeft: "10px",
                        marginTop: "7px",
                        marginBottom: "-15px",
                        fontWeight: "500",
                      },
                    }}
                  />

                  {addSuccess && (
                    <p
                      style={{
                        color: "green",
                        fontSize: "0.6em",
                        fontWeight: "500",
                        marginLeft: "5px",
                        marginTop: "15px",
                        marginBottom: "-20px",
                      }}
                    >
                      Shipper added successfully.
                    </p>
                  )}

                  <MDBox mt={3} display="flex" justifyContent="space-between">
                    <Button
                      variant="outlined"
                      color="success"
                      style={{
                        color: "white",
                        backgroundColor: "#00ca15",
                        padding: "5px 25px",
                      }}
                      onClick={handleSubmit}
                    >
                      Save
                    </Button>
                  </MDBox>
                </form>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default AddShipper;
