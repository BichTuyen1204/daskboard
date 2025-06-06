import { useState } from "react";
import Card from "@mui/material/Card";
import { Grid, TextField, Button, Icon } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Link } from "react-router-dom";
import CouponService from "api/CouponService";

function AddCoupon() {
  const [addSuccess, setAddSuccess] = useState(false);
  const [idError, setIdError] = useState("");
  const [coupon, setCoupon] = useState({
    id: "",
    usage_amount: 0,
    expire_date: "",
    sale_percent: 0,
    minimum_price: 0,
  });

  const [errors, setErrors] = useState({
    id: "",
    minimum_price: "",
    usage_amount: "",
    expire_date: "",
    sale_percent: "",
  });

  const validateField = (name, value) => {
    let errorMessage = "";

    switch (name) {
      case "id":
        if (!value) errorMessage = "Please enter the coupon ID";
        else if (value.length < 2) errorMessage = "The ID must be at least 2 characters";
        else if (value.length > 100) errorMessage = "The ID must be less than 100 characters";
        break;

      case "usage_amount":
        if (!value) errorMessage = "Please enter the usage amount";
        else if (value <= 0) errorMessage = "The usage amount must be greater than 0";
        else if (value > 100) errorMessage = "The usage amount must be less than 100";
        break;

      case "sale_percent":
        if (!value) errorMessage = "Please enter the sale percentage";
        else if (value < 1) errorMessage = "The sale percent must be greater than 0";
        else if (value > 100)
          errorMessage = "The sale percentage must be less than or equal to 100";
        break;

      case "minimum_price":
        if (!value) errorMessage = "Please enter the minimum price";
        break;

      case "expire_date":
        if (!value) {
          errorMessage = "Please enter the expiration date";
        } else {
          const today = new Date().toISOString().split("T")[0];
          if (value < today) errorMessage = "Expiration date must be today or in the future";
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
    if (name === "id") {
      setIdError("");
    }

    if (name === "minimum_price") {
      const numericValue = value.replace(/[^0-9.]/g, "");

      if ((numericValue.match(/\./g) || []).length > 1) {
        return;
      }

      setCoupon((prevCoupon) => ({ ...prevCoupon, [name]: numericValue }));
      validateField(name, numericValue);
      return;
    }
    setCoupon((prevCoupon) => ({ ...prevCoupon, [name]: value }));
    validateField(name, value);
  };

  const handleFocus = (e) => {
    const { name, value } = e.target;
    if (value === "0") {
      setCoupon((prevCoupon) => ({ ...prevCoupon, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (value === "") {
      setCoupon((prevCoupon) => ({ ...prevCoupon, [name]: "0" }));
    }
  };

  const handleSubmit = async () => {
    const isValid = Object.keys(errors).every((key) => validateField(key, coupon[key]));
    if (isValid) {
      try {
        const response = await CouponService.addCoupon(coupon);
        setAddSuccess(true);
      } catch (error) {
        if (error.response && error.response.status === 500) {
          setIdError("The coupon ID already exists");
        } else {
          setIdError("The coupon ID already exists");
        }
        setAddSuccess(false);
      }
    }
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
                  Add Coupon
                </MDTypography>
              </MDBox>

              {/* Content */}
              <MDBox p={3}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={12}>
                    <Link to="/coupon">
                      <Icon sx={{ cursor: "pointer", "&:hover": { color: "gray" } }}>
                        arrow_back
                      </Icon>
                    </Link>
                    <form>
                      {/* Coupon ID */}
                      <TextField
                        fullWidth
                        name="id"
                        label={
                          <span style={{ fontSize: "0.9em" }}>
                            Coupon ID <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        value={coupon.id}
                        onChange={handleChange}
                        error={!!errors.id}
                        helperText={errors.id}
                        margin="normal"
                        sx={{
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
                      <p
                        style={{
                          color: "red",
                          fontSize: "0.6em",
                          marginTop: "0px",
                          fontWeight: "450",
                        }}
                      >
                        {idError}
                      </p>

                      {/* Minimum price */}
                      <TextField
                        fullWidth
                        name="minimum_price"
                        label={
                          <span style={{ fontSize: "0.9em" }}>
                            Minimum Price ($) <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        value={coupon.minimum_price}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        error={!!errors.minimum_price}
                        helperText={errors.minimum_price}
                        margin="normal"
                        sx={{
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

                      {/* Usage Amount */}
                      <TextField
                        fullWidth
                        name="usage_amount"
                        label={
                          <span style={{ fontSize: "0.9em" }}>
                            Usage Amount <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        type="number"
                        value={coupon.usage_amount}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        error={!!errors.usage_amount}
                        helperText={errors.usage_amount}
                        margin="normal"
                        sx={{
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
                      {/* Expiration Date */}
                      <TextField
                        fullWidth
                        name="expire_date"
                        label={
                          <span style={{ fontSize: "0.9em" }}>
                            Expiration Date <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        type="date"
                        value={coupon.expire_date}
                        onChange={handleChange}
                        error={!!errors.expire_date}
                        helperText={errors.expire_date}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          min: new Date().toISOString().split("T")[0],
                        }}
                        margin="normal"
                        sx={{
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

                      {/* Sale Percentage */}
                      <TextField
                        fullWidth
                        name="sale_percent"
                        label={
                          <span style={{ fontSize: "0.9em" }}>
                            Sale Percentage (%) <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        type="number"
                        value={coupon.sale_percent}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        error={!!errors.sale_percent}
                        helperText={errors.sale_percent}
                        margin="normal"
                        sx={{
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
                          Add coupon successful
                        </p>
                      )}
                      {/* Action Buttons */}
                      <MDBox mt={3} display="flex" justifyContent="space-between">
                        <Button
                          variant="contained"
                          color="success"
                          onClick={handleSubmit}
                          style={{
                            color: "white",
                            backgroundColor: "#00ca15",
                            padding: "5px 25px",
                          }}
                        >
                          Save
                        </Button>
                      </MDBox>
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

export default AddCoupon;
