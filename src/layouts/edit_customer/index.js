import { useEffect, useState } from "react";
import { Card, Grid, TextField, Button, MenuItem, Icon, Typography } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import axios from "axios";
import ProductService from "api/ProductService";
import AccountService from "api/AccountService";

function EditCustomer() {
  const navigate = useNavigate();
  const [product, setProduct] = useState("");
  const { id } = useParams();
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));
  const [userName, setUserName] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [updateAccountSuccess, setUpdateAccountSuccess] = useState("");
  const [status, setStatus] = useState("");
  const [statusError, setStatusError] = useState("");
  const [updateStatusSuccess, setUpdateStatusSuccess] = useState("");
  const [price, setPrice] = useState("");
  const [priceError, setPriceError] = useState("");
  const [sale_percent, setSale] = useState("");
  const [saleError, setSaleError] = useState("");
  const [updatePriceSuccess, setUpdatePriceSuccess] = useState("");
  const [dayBeforeExpiry, setDayBeforeExpiry] = useState("");
  const [dayBeforeExpiryError, setDayBeforeExpiryError] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [articleMd, setArticleMd] = useState("");
  const [articleMdError, setArticleMdError] = useState("");
  const [weight, setWeight] = useState("");
  const [weightError, setWeightError] = useState("");
  const [instructions, setInstructions] = useState("");
  const [instructionsError, setInstructionsError] = useState("");
  const [madeIn, setMadeIn] = useState("");
  const [madeInError, setMadeInError] = useState("");
  const [updateInfomationSuccess, setUpdateInfomationSuccess] = useState("");

  // State for Producst Data
  const [customerInfo, setCustomerInfo] = useState({
    username: "",
    password: "",
  });

  // Ensure user is authenticated
  useEffect(() => {
    if (!jwtToken) navigate("/sign-in", { replace: true });
  }, [navigate, jwtToken]);

  // Fetch Product Details
  const getCustomerDetail = async () => {
    try {
      const response = await AccountService.getCustomerDetail(id);
      console.log("nice", response);

      setCustomerInfo(response);

      setUserName(response.username);
    } catch (error) {
      console.error("Can't access the server", error);
    }
  };

  const updateAccount = async (e) => {
    e.preventDefault();
    UserNameBlur();
    PasswordBlur();
    if (!userNameError && userName && !passwordError && password) {
      try {
        const response = await AccountService.updateAccount(id, customerInfo);
        console.log("Update account successful", response);
        setUpdateAccountSuccess("Username and password updated successfully.");
      } catch (error) {
        console.error(
          "Error during API calls:",
          error.response ? error.response.data : error.message
        );
      }
    }
  };

  const updateField = (field, value) => {
    setCustomerInfo((prevState) => ({
      ...prevState,
      [field]: value !== undefined && value !== null ? value : prevState[field],
    }));
  };

  const updateInfoField = (field, value) => {
    setCustomerInfo((prevState) => ({
      ...prevState,
      infos: {
        ...prevState.infos,
        [field]: value !== undefined && value !== null ? value : prevState.infos[field],
      },
    }));
  };

  const UserNameChange = (e) => {
    const { value } = e.target;
    setUserName(value);
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

  //   const StatusChange = (e) => {
  //     const { value } = e.target;
  //     setStatus(value);
  //     setProductStatus((preState) => ({ ...preState, status: value }));
  //     setUpdateStatusSuccess(false);
  //   };

  //   const StatusBlur = () => {
  //     if (status.trim === "") {
  //       setStatusError("Please enter a status");
  //     } else {
  //       setStatusError("");
  //     }
  //   };

  //   const PriceChange = (e) => {
  //     const { value } = e.target;
  //     setPrice(value);
  //     setProductPrice((preState) => ({ ...preState, price: value }));
  //     setUpdatePriceSuccess(false);
  //   };

  //   const PriceBlur = () => {
  //     if (price === "") {
  //       setPriceError("Please enter a price");
  //     } else if (quantity < 1) {
  //       setPriceError("Please enter a price greater than 1");
  //     } else {
  //       setPriceError("");
  //     }
  //   };

  //   const SalePersentChange = (e) => {
  //     const { value } = e.target;
  //     setSale(value);
  //     setProductPrice((preState) => ({ ...preState, sale_percent: value }));
  //     setUpdatePriceSuccess(false);
  //   };

  //   const SalePersentBlur = () => {
  //     if (sale_percent === "") {
  //       setSaleError("Please enter a sale percent");
  //     } else if (sale_percent < 1) {
  //       setSaleError("Please enter a sale persent greater than 1");
  //     } else if (sale_percent > 100) {
  //       setSaleError("Please enter a sale persent less than 100");
  //     } else {
  //       setSaleError("");
  //     }
  //   };

  //   const DayBeforeExpiryChange = (e) => {
  //     const { value } = e.target;
  //     setDayBeforeExpiry(value);
  //     updateField("day_before_expiry", value);
  //     setUpdateInfomationSuccess(false);
  //   };

  //   const DayBeforeExpiryBlur = () => {
  //     if (dayBeforeExpiry === "") {
  //       setDayBeforeExpiryError("Please enter a day before expiry");
  //     } else if (sale_percent < 0) {
  //       setDayBeforeExpiryError("Please enter a day before expiry greater than 0");
  //     } else {
  //       setSaleError("");
  //     }
  //   };

  //   const DescriptionChange = (e) => {
  //     const { value } = e.target;
  //     setDescription(value);
  //     updateField("description", value);
  //     setUpdateInfomationSuccess(false);
  //   };

  //   const DescriptionBlur = () => {
  //     if (description === "") {
  //       setDescriptionError("Please enter a description");
  //     } else {
  //       setDescriptionError("");
  //     }
  //   };

  //   const ArticleMdChange = (e) => {
  //     const { value } = e.target;
  //     setArticleMd(value);
  //     updateField("article_md", value);
  //     setUpdateInfomationSuccess(false);
  //   };

  //   const ArticleMdBlur = () => {
  //     if (articleMd === "") {
  //       setArticleMdError("Please enter a article");
  //     } else {
  //       setArticleMdError("");
  //     }
  //   };

  //   const WeightChange = (e) => {
  //     const { value } = e.target;
  //     setWeight(value);
  //     updateInfoField("weight", value);
  //     setUpdateInfomationSuccess(false);
  //   };

  //   const WeightBlur = () => {
  //     if (weight === "") {
  //       setWeightError("Please enter a weight");
  //     } else {
  //       setWeightError("");
  //     }
  //   };

  //   const InstructionsChange = (e) => {
  //     const { value } = e.target;
  //     setInstructions(value);
  //     updateInfoField("storage_instructions", value);
  //     setUpdateInfomationSuccess(false);
  //   };

  //   const InstructionsBlur = () => {
  //     if (instructions === "") {
  //       setInstructionsError("Please enter a instruction");
  //     } else {
  //       setInstructionsError("");
  //     }
  //   };

  //   const MadeInChange = (e) => {
  //     const { value } = e.target;
  //     setMadeIn(value);
  //     updateInfoField("made_in", value);
  //     setUpdateInfomationSuccess(false);
  //   };

  //   const MadeInBlur = () => {
  //     if (madeIn === "") {
  //       setMadeInError("Please enter a made in");
  //     } else {
  //       setMadeInError("");
  //     }
  //   };

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
                  {/* Product Info */}
                  <Grid item xs={12}>
                    <Link
                      to="/ingredient"
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
                        type="text"
                        value={password || ""}
                        onChange={PasswordChange}
                        onBlur={PasswordBlur}
                        label="Password"
                        margin="normal"
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
                  </Grid>

                  {/* Product Price */}
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

export default EditCustomer;
