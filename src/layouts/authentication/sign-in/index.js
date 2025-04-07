import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import AccountService from "api/AccountService";

function Basic() {
  const navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));

  const [account, setAccount] = useState({
    grant_type: "password",
    username: "",
    password: "",
    scope: "",
    client_id: "",
    client_secret: "",
  });

  // Receives username
  const userNameChange = (e) => {
    const value = e.target.value;
    setUserName(value);
    setAccount((preState) => ({ ...preState, username: value }));
    setUserNameError("");
    setPasswordError("");
    setLoginError("");
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
    setUserNameError("");
    setPasswordError("");
    setLoginError("");
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
    setLoginError("");
    userNameBlur();
    PasswordBlur();

    if (!userNameError && !passwordError && username && password) {
      try {
        const response = await AccountService.signin(account);
        setFormSubmitted(true);
        setLoginError("");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } catch (error) {
        if (error.response) {
          if (error.response.status === 400) {
            const detail = error.response.data.detail;
            if (detail === "No such account with username") {
              setUserNameError("Account does not exist.");
            } else if (detail === "Password incorrect") {
              setPasswordError("Password is incorrect.");
            } else if (detail === "Account is locked") {
              setLoginError("Account is locked.");
            } else {
              setLoginError("Unknown error occurred. Please try again.");
            }
          } else if (error.response.status === 401) {
            setLoginError("Invalid username or password.");
          } else if (error.response.status === 500) {
            setPasswordError("Server error. Please try again later.");
          } else {
            setLoginError(`Error: ${error.response.status}`);
          }
        } else {
          setLoginError("Network error. Please check your connection.");
        }
        setFormSubmitted(false);
      }
    } else {
      setLoginError("Please fill in all fields correctly before submitting.");
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                label="Username"
                type="text"
                name="username"
                value={username}
                onChange={userNameChange}
                onBlur={userNameBlur}
                onKeyDown={(e) => e.key === "Enter" && validateForm()}
                fullWidth
              />
              {userNameError && (
                <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px", marginTop: "3px" }}>
                  {userNameError}
                </p>
              )}
            </MDBox>
            <MDBox>
              <MDInput
                type="password"
                label="Password"
                name="password"
                value={password}
                onChange={PasswordChange}
                onBlur={PasswordBlur}
                onKeyDown={(e) => e.key === "Enter" && validateForm()}
                fullWidth
              />
            </MDBox>
            {passwordError && (
              <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px", marginTop: "3px" }}>
                {passwordError}
              </p>
            )}
            <MDBox mt={2} mb={1}>
              {formSubmitted && !loginError && (
                <p
                  style={{ color: "green", fontSize: "0.6em", marginLeft: "5px", marginTop: "3px" }}
                >
                  Login successful
                </p>
              )}
              {loginError && (
                <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px", marginTop: "3px" }}>
                  {loginError}
                </p>
              )}
              <MDButton variant="gradient" color="info" fullWidth onClick={validateForm}>
                sign in
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
