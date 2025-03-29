import { useState } from "react";
import Card from "@mui/material/Card";
import { Grid, TextField, Button, Icon, MenuItem, IconButton } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Link } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Delete";
import ProductService from "api/ProductService";

function AddProduct() {
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [mainImageError, setMainImageError] = useState("");
  const [additionalImages, setAdditionalImages] = useState([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);
  const [additionalImagesError, setAdditionalImagesError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [productNameError, setProductNameError] = useState("");
  const [articleMDError, setArticleMDError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [productTypeError, setProductTypeError] = useState("");
  const [salePercentError, setSalePercentError] = useState("");
  const [dayBeforeExpiryError, setDayBeforeExpiryError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [weightError, setWeightError] = useState("");
  const [storageInstructionsError, setStorageInstructionsError] = useState("");
  const [madeInError, setMadeInError] = useState("");

  const [product, setProduct] = useState({
    article_md: "",
    infos: {
      weight: "",
      storage_instructions: "",
      made_in: "",
    },
    price: 0,
    product_type: "",
    sale_percent: 0,
    day_before_expiry: "",
    product_name: "",
    description: "",
  });

  const handleChange = (field, value) => {
    if (["price", "sale_percent"].includes(field) && value === "") {
      value = 0;
    }
    setProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
    switch (field) {
      case "product_type":
        if (!value.trim()) {
          setProductTypeError("Product type is required.");
        } else {
          setProductNameError("");
        }
        break;
      case "product_name":
        if (!value.trim()) {
          setProductNameError("Product name is required.");
        } else {
          setProductNameError("");
        }
        break;
      case "article_md":
        if (!value.trim()) {
          setArticleMDError("Article MD is required.");
        } else {
          setArticleMDError("");
        }
        break;
      case "price":
        if (!value) {
          setPriceError("Price is required.");
        } else if (value < 0) {
          setPriceError("Price must be greater than 0.");
        } else {
          setPriceError("");
        }
        break;
      case "day_before_expiry":
        if (!value) {
          setDayBeforeExpiryError("Day before expiry is required.");
        } else if (value <= 0) {
          setDayBeforeExpiryError("Day before expiry cannot be negative.");
        } else if (/^0\d*/.test(value)) {
          setDayBeforeExpiryError("Day before expiry cannot start with 0.");
        } else {
          setDayBeforeExpiryError("");
        }
        break;
      case "sale_percent":
        if (!value) {
          setSalePercentError("Sale percent is required.");
        } else if (value < 0 || value > 100) {
          setSalePercentError("Sale percent must be between 0 and 100.");
        } else {
          setSalePercentError("");
        }
        break;
      case "description":
        if (!value.trim()) {
          setDescriptionError("Description is required.");
        } else {
          setDescriptionError("");
        }
        break;
      default:
        break;
    }
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleNestedChange = (field, nestedField, value) => {
    setProduct((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [nestedField]: value,
      },
    }));

    if (field === "infos") {
      switch (nestedField) {
        case "weight":
          if (!value.trim()) {
            setWeightError("Weight is required.");
          } else if (/^0\d*/.test(value)) {
            setWeightError("Weight cannot start with 0.");
          } else if (value < 1) {
            setWeightError("Weight must be greater than 0.");
          } else {
            setWeightError("");
          }
          break;

        case "made_in":
          if (!value.trim()) {
            setMadeInError("Made in is required.");
          } else {
            setMadeInError("");
          }
          break;
        case "storage_instructions":
          if (!value.trim()) {
            setStorageInstructionsError("Storage instructions are required.");
          } else {
            setStorageInstructionsError("");
          }
          break;
        default:
          break;
      }
    }

    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file && !["image/jpeg", "image/png"].includes(file.type)) {
      setMainImageError("Only JPG or PNG files are accepted.");
      return;
    }
    setMainImage(file);
    setMainImagePreview(URL.createObjectURL(file));
    setMainImageError("");
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => ["image/jpeg", "image/png"].includes(file.type));

    if (validFiles.length !== files.length) {
      setAdditionalImagesError("Only JPG or PNG files are accepted.");
      return;
    }

    setAdditionalImages((prev) => [...prev, ...validFiles]);
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setAdditionalImagePreviews((prev) => [...prev, ...newPreviews]);
    setAdditionalImagesError("");
  };

  const handleRemoveImage = (index) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
    setAdditionalImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const {
      product_name,
      article_md,
      price,
      day_before_expiry,
      sale_percent,
      product_type,
      description,
      infos,
    } = product;

    if (!product_name.trim()) {
      setProductNameError("Product name is required.");
      return false;
    }
    if (!article_md.trim()) {
      setArticleMDError("Article MD is required.");
      return false;
    }
    if (!price || price <= 0) {
      setPriceError("Price is required and must be greater than 0.");
      return false;
    }
    if (!day_before_expiry) {
      setDayBeforeExpiryError("Day Before Expiry is required");
      return false;
    }
    if (!sale_percent || sale_percent < 0 || sale_percent > 100) {
      setSalePercentError("Sale Percent must be between 0 and 100.");
      return false;
    }
    if (!product_type.trim()) {
      setProductTypeError("Product Type is required.");
      return false;
    }
    if (!description.trim()) {
      setDescriptionError("Description is required.");
      return false;
    }
    if (!infos.weight.trim()) {
      setWeightError("Weight is required.");
      return false;
    }
    if (infos.weight < 1) {
      setWeightError("Weight must be greater than 0.");
      return false;
    }
    if (!infos.storage_instructions.trim()) {
      setStorageInstructionsError("Storage instruction is required.");
      return false;
    }
    if (!infos.made_in.trim()) {
      setMadeInError("Made in is required.");
      return false;
    }
    if (!mainImage) {
      setMainImageError("The main image is required.");
      return false;
    }
    if (!additionalImages) {
      setAdditionalImagesError("The additional image is required.");
    }
    setErrorMessage("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm() || additionalImagesError || mainImageError) return;
    const formData = new FormData();
    formData.append("main_image", mainImage);
    additionalImages.forEach((image) => {
      formData.append("additional_images", image);
    });
    formData.append("product_detail", JSON.stringify(product));
    try {
      await ProductService.createProduct(formData);
      setMainImageError(false);
      setAdditionalImagesError(false);
      setSuccessMessage("Product added successfully!");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setErrorMessage("You need to sign in.");
        } else if (error.response.status === 422) {
          setErrorMessage("Invalid data.");
        } else {
          setErrorMessage("Something went wrong.");
        }
      } else {
        setErrorMessage("Network or server error.");
      }
      console.error(error.message || "Something went wrong.");
    }
  };

  const handleFocus = (field) => {
    setProduct((prev) => ({
      ...prev,
      [field]: prev[field] === 0 ? "" : prev[field],
    }));
  };

  const handleBlur = (field) => {
    setProduct((prev) => ({
      ...prev,
      [field]: prev[field] === "" ? 0 : prev[field],
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
                  Add Product
                </MDTypography>
              </MDBox>

              {/* Content */}
              <MDBox p={3}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={5}>
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

                    <MDBox>
                      {/* Main Image */}
                      <MDTypography variant="h6" mb={2}>
                        Main Image
                      </MDTypography>
                      <MDBox
                        sx={{
                          width: "100%",
                          maxWidth: "20rem",
                          height: "20rem",
                          borderRadius: "8px",
                          border: "2px dashed #ccc",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: mainImagePreview ? "transparent" : "#f9f9f9",
                          overflow: "hidden",
                          position: "relative",
                          marginBottom: "16px",
                        }}
                      >
                        {mainImagePreview ? (
                          <img
                            src={mainImagePreview}
                            alt="Main Preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          <MDTypography variant="body2" color="textSecondary" textAlign="center">
                            No Main Image Selected
                          </MDTypography>
                        )}
                      </MDBox>
                      <p
                        style={{
                          color: "red",
                          fontSize: "0.6em",
                          fontWeight: "450",
                          marginLeft: "5px",
                        }}
                      >
                        {mainImageError}
                      </p>
                      <Button
                        variant="outlined"
                        component="label"
                        sx={{
                          border: "1px solid #02adf1",
                          color: "#fff",
                          backgroundColor: "#02adf1",
                          "&:hover": {
                            border: "1px solid #51e7ff",
                            backgroundColor: "#00dcff",
                          },
                          padding: "8px 16px",
                          textTransform: "none",
                        }}
                      >
                        Upload Main Image
                        <input type="file" hidden onChange={handleMainImageChange} />
                      </Button>

                      {/* Additional Images */}
                      <MDBox mt={4}>
                        <MDTypography variant="h6" mb={2}>
                          Additional Images
                        </MDTypography>
                        <Grid
                          container
                          spacing={2}
                          sx={{
                            minHeight: "6rem",
                            border: "2px dashed #ccc",
                            borderRadius: "8px",
                            padding: "8px",
                            backgroundColor: additionalImagePreviews.length
                              ? "transparent"
                              : "#f9f9f9",
                          }}
                        >
                          {additionalImagePreviews.length > 0 ? (
                            additionalImagePreviews.map((preview, index) => (
                              <Grid item key={index} xs={4} sm={3} md={2}>
                                <MDBox
                                  sx={{
                                    position: "relative",
                                    width: "100%",
                                    height: "5rem",
                                    borderRadius: "4px",
                                    overflow: "hidden",
                                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                  }}
                                >
                                  <img
                                    src={preview}
                                    alt={`Additional Preview ${index}`}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                  />
                                  <IconButton
                                    onClick={() => handleRemoveImage(index)}
                                    sx={{
                                      position: "absolute",
                                      top: 4,
                                      right: 4,
                                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                                      color: "black",
                                      padding: "4px",
                                      borderRadius: "50%",
                                      "&:hover": {
                                        backgroundColor: "red",
                                        color: "white",
                                      },
                                    }}
                                  >
                                    <ClearIcon fontSize="small" />
                                  </IconButton>
                                </MDBox>
                              </Grid>
                            ))
                          ) : (
                            <MDTypography
                              variant="body2"
                              color="textSecondary"
                              textAlign="center"
                              sx={{ width: "100%" }}
                            >
                              No Additional Images Selected
                            </MDTypography>
                          )}
                        </Grid>
                        <p
                          style={{
                            color: "red",
                            fontSize: "0.8em",
                            fontWeight: "500",
                            marginLeft: "5px",
                          }}
                        >
                          {additionalImagesError}
                        </p>
                        <Button
                          variant="outlined"
                          component="label"
                          sx={{
                            marginTop: "16px",
                            border: "1px solid #02adf1",
                            color: "#fff",
                            backgroundColor: "#02adf1",
                            "&:hover": {
                              border: "1px solid #51e7ff",
                              backgroundColor: "#00dcff",
                            },
                            padding: "8px 16px",
                            textTransform: "none",
                          }}
                        >
                          Upload Additional Images
                          <input
                            type="file"
                            hidden
                            multiple
                            onChange={handleAdditionalImagesChange}
                          />
                        </Button>
                      </MDBox>
                    </MDBox>
                  </Grid>

                  {/* Right Section: Product Info */}
                  <Grid item xs={12} md={7}>
                    <form>
                      <TextField
                        fullWidth
                        label="Product Name"
                        value={product.product_name}
                        onChange={(e) => handleChange("product_name", e.target.value)}
                        margin="normal"
                      />
                      <p
                        style={{
                          color: "red",
                          fontSize: "0.6em",
                          fontWeight: "450",
                          marginLeft: "5px",
                        }}
                      >
                        {productNameError}
                      </p>
                      <TextField
                        fullWidth
                        label="Article MD"
                        value={product.article_md}
                        onChange={(e) => handleChange("article_md", e.target.value)}
                        margin="normal"
                      />
                      <p
                        style={{
                          color: "red",
                          fontSize: "0.6em",
                          fontWeight: "450",
                          marginLeft: "5px",
                        }}
                      >
                        {articleMDError}
                      </p>
                      <TextField
                        fullWidth
                        label="Price ($)"
                        type="number"
                        value={product.price}
                        onChange={(e) => handleChange("price", e.target.value)}
                        onFocus={() => handleFocus("price")}
                        onBlur={() => handleBlur("price")}
                        onKeyDown={(e) => {
                          if (e.key.toLowerCase() === "e") {
                            e.preventDefault();
                          }
                        }}
                        margin="normal"
                      />
                      <p
                        style={{
                          color: "red",
                          fontSize: "0.6em",
                          fontWeight: "450",
                          marginLeft: "5px",
                        }}
                      >
                        {priceError}
                      </p>
                      <TextField
                        fullWidth
                        label="Day Before Expiry (days)"
                        type="number"
                        value={product.day_before_expiry}
                        onChange={(e) => handleChange("day_before_expiry", e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key.toLowerCase() === "e") {
                            e.preventDefault();
                          }
                        }}
                        margin="normal"
                      />
                      <p
                        style={{
                          color: "red",
                          fontSize: "0.6em",
                          fontWeight: "450",
                          marginLeft: "5px",
                        }}
                      >
                        {dayBeforeExpiryError}
                      </p>
                      <TextField
                        fullWidth
                        label="Sale Percent (%)"
                        type="number"
                        value={product.sale_percent}
                        onChange={(e) => handleChange("sale_percent", e.target.value)}
                        onFocus={() => handleFocus("sale_percent")}
                        onBlur={() => handleBlur("sale_percent")}
                        onKeyDown={(e) => {
                          if (e.key.toLowerCase() === "e") {
                            e.preventDefault();
                          }
                        }}
                        margin="normal"
                      />
                      <p
                        style={{
                          color: "red",
                          fontSize: "0.6em",
                          fontWeight: "450",
                          marginLeft: "5px",
                        }}
                      >
                        {salePercentError}
                      </p>
                      <TextField
                        fullWidth
                        select
                        label="Product Type"
                        value={product.product_type}
                        onChange={(e) => handleChange("product_type", e.target.value)}
                        margin="normal"
                        sx={{ height: "45px", ".MuiInputBase-root": { height: "45px" } }}
                      >
                        <MenuItem value="" disabled>
                          ---- Select ----
                        </MenuItem>
                        <MenuItem value="MEAT">Meat</MenuItem>
                        <MenuItem value="VEG">Vegetable</MenuItem>
                        <MenuItem value="SS">Season</MenuItem>
                      </TextField>
                      <p
                        style={{
                          color: "red",
                          fontSize: "0.6em",
                          fontWeight: "450",
                          marginLeft: "5px",
                        }}
                      >
                        {productTypeError}
                      </p>

                      <TextField
                        fullWidth
                        label="Description"
                        value={product.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        margin="normal"
                        multiline
                        rows={4}
                      />
                      <p
                        style={{
                          color: "red",
                          fontSize: "0.6em",
                          fontWeight: "450",
                          marginLeft: "5px",
                        }}
                      >
                        {descriptionError}
                      </p>
                      <TextField
                        fullWidth
                        type="number"
                        label="Weight (gam)"
                        value={product.infos.weight}
                        onChange={(e) => handleNestedChange("infos", "weight", e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key.toLowerCase() === "e") {
                            e.preventDefault();
                          }
                        }}
                        margin="normal"
                      />
                      <p
                        style={{
                          color: "red",
                          fontSize: "0.6em",
                          fontWeight: "450",
                          marginLeft: "5px",
                        }}
                      >
                        {weightError}
                      </p>
                      <TextField
                        fullWidth
                        label="Storage Instructions"
                        value={product.infos.storage_instructions}
                        onChange={(e) =>
                          handleNestedChange("infos", "storage_instructions", e.target.value)
                        }
                        margin="normal"
                      />
                      <p
                        style={{
                          color: "red",
                          fontSize: "0.6em",
                          fontWeight: "450",
                          marginLeft: "5px",
                        }}
                      >
                        {storageInstructionsError}
                      </p>

                      <TextField
                        fullWidth
                        label="Made in"
                        value={product.infos.made_in}
                        onChange={(e) => handleNestedChange("infos", "made_in", e.target.value)}
                        margin="normal"
                      />
                      <p
                        style={{
                          color: "red",
                          fontSize: "0.6em",
                          fontWeight: "450",
                          marginLeft: "5px",
                        }}
                      >
                        {madeInError}
                      </p>
                      <p
                        style={{
                          color: "green",
                          fontSize: "0.6em",
                          fontWeight: "450",
                          marginLeft: "5px",
                        }}
                      >
                        {successMessage}
                      </p>
                      <p
                        style={{
                          color: "red",
                          fontSize: "0.6em",
                          marginBottom: "-18px",
                          marginTop: "35px",
                        }}
                      >
                        {errorMessage}
                      </p>
                      <MDBox mt={3} display="flex" justifyContent="space-between">
                        <Button
                          variant="contained"
                          color="success"
                          onClick={handleSubmit}
                          style={{ backgroundColor: "green", color: "white" }}
                        >
                          Add Product
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

export default AddProduct;
