import { Link } from "react-router-dom";
import { useState } from "react";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

function Cover() {
  const [username, setUserName] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [account, setAccount] = useState({
    username: "",
    password: "",
  });
  // Receives username
  const userNameChange = (e) => {
    const value = e.target.value;
    setUserName(value);
    setAccount((preState) => ({ ...preState, username: value }));
  };

  // Check full name
  const userNameBlur = () => {
    if (username.trim() === "") {
      setUserNameError("Please enter your username");
    } else if (username.length < 4) {
      setUserNameError("The full name must be at least 4 characters");
    } else if (username.length > 100) {
      setUserNameError("The full name must be less than 100 characters");
    } else {
      setUserNameError("");
    }
  };

  /* Receive password */
  const PasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setAccount((preState) => ({ ...preState, password: value }));
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

  const validateForm = async () => {
    setRegisterError("");
    userNameBlur();
    PasswordBlur();
    if (!userNameError && !passwordError && username && password) {
      try {
        const response = await AccountService.register(account);
        console.log("Register successful", response);
        setFormSubmitted(true);
        setRegisterError("");
        setTimeout(() => {
          onRegisterSuccess();
          window.location.reload();
          console.log("Response data:", response);
        }, 1000);
      } catch (error) {
        console.error(
          "Error when register in:",
          error.response ? error.response.data : error.message
        );
        if (error.response) {
          switch (error.response.status) {
            case 404:
              setUserNameError("Account does not exist.");
              break;
            case 401:
              setRegisterError("Invalid username or password.");
              break;
            case 500:
              setPasswordError("Password is incorrect.");
              break;
            default:
              setRegisterError("User name does not exist.");
          }
        } else {
          setRegisterError("Network error. Please check your connection.");
        }
        setFormSubmitted(false);
      }
    } else {
      setRegisterError("Please fill in all fields correctly before submitting");
    }
  };
  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Join us today
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your email and password to register
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            {/* Input email */}
            <MDBox mb={1}>
              <MDInput
                type="username"
                label="Username"
                variant="standard"
                name="username"
                value={username}
                onChange={userNameChange}
                onBlur={userNameBlur}
                fullWidth
              />
            </MDBox>
            {userNameError && (
              <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px", marginTop: "3px" }}>
                {userNameError}
              </p>
            )}
            {/* Input password */}
            <MDBox mb={1}>
              <MDInput
                type="password"
                label="Password"
                variant="standard"
                value={password}
                onChange={PasswordChange}
                onBlur={PasswordBlur}
                fullWidth
              />
            </MDBox>
            {passwordError && (
              <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px", marginTop: "3px" }}>
                {passwordError}
              </p>
            )}
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Checkbox />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;I agree the&nbsp;
              </MDTypography>
              <MDTypography
                component="a"
                href="#"
                variant="button"
                fontWeight="bold"
                color="info"
                textGradient
              >
                Terms and Conditions
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              {formSubmitted && !registerError && (
                <p
                  style={{ color: "green", fontSize: "0.6em", marginLeft: "5px", marginTop: "3px" }}
                >
                  Sign up successful
                </p>
              )}
              {registerError && (
                <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px", marginTop: "3px" }}>
                  {registerError}
                </p>
              )}
              <MDButton variant="gradient" color="info" fullWidth onClick={validateForm}>
                sign up
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;
