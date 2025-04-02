import { useState } from "react";
import PropTypes from "prop-types";

import Card from "@mui/material/Card";
import {
  Grid,
  TextField,
  Button,
  Icon,
  MenuItem,
  IconButton,
  FormLabel,
  FormControl,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  TableHead,
  Table,
  Paper,
  Modal,
  Slider,
  Box,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Link } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Delete";
import CropIcon from "@mui/icons-material/Crop";
import ProductService from "api/ProductService";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Cropper from "react-easy-crop";
import getCroppedImg from "utils/cropImage"; // Utility function to crop the image

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
  const [brandError, setBrandError] = useState("");
  const [usageInstructionsError, setUsageInstructionsError] = useState("");
  const [madeInError, setMadeInError] = useState("");
  const [infoRows, setInfoRows] = useState([{ key: "", value: "" }]);
  const [product, setProduct] = useState({
    article_md: "",
    infos: {},
    product_type: "",
    day_before_expiry: "",
    product_name: "",
    description: "",
  });

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [currentAdditionalImageIndex, setCurrentAdditionalImageIndex] = useState(null); // Track the index of the additional image being cropped

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

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setMainImageError("No file selected.");
      return;
    }
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setMainImageError("Only JPG or PNG files are accepted.");
      return;
    }
    try {
      const objectUrl = URL.createObjectURL(file);
      setImageToCrop(objectUrl); // Set the image URL for cropping
      setCropModalOpen(true); // Open the cropping modal
      setMainImageError(""); // Clear any previous errors
    } catch (error) {
      console.error("Error creating object URL:", error);
      setMainImageError("Failed to load the image. Please try again.");
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropSave = async () => {
    try {
      const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);

      if (currentAdditionalImageIndex !== null) {
        // Update the cropped additional image
        const updatedPreviews = [...additionalImagePreviews];
        updatedPreviews[currentAdditionalImageIndex] = URL.createObjectURL(croppedImage);
        setAdditionalImagePreviews(updatedPreviews);

        const updatedImages = [...additionalImages];
        updatedImages[currentAdditionalImageIndex] = croppedImage;
        setAdditionalImages(updatedImages);

        setCurrentAdditionalImageIndex(null); // Reset the index
      } else {
        // Update the cropped main image
        setMainImage(croppedImage);
        setMainImagePreview(URL.createObjectURL(croppedImage));
      }

      setCropModalOpen(false);
      setMainImageError("");
    } catch (error) {
      console.error("Error cropping the image:", error);
    }
  };

  const handleAdditionalImageCropSave = async () => {
    try {
      const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);

      if (currentAdditionalImageIndex !== null) {
        // Update the cropped additional image
        const updatedPreviews = [...additionalImagePreviews];
        updatedPreviews[currentAdditionalImageIndex] = URL.createObjectURL(croppedImage);
        setAdditionalImagePreviews(updatedPreviews);

        const updatedImages = [...additionalImages];
        updatedImages[currentAdditionalImageIndex] = croppedImage;
        setAdditionalImages(updatedImages);

        setCurrentAdditionalImageIndex(null); // Reset the index
      }

      setCropModalOpen(false);
      setAdditionalImagesError("");
    } catch (error) {
      console.error("Error cropping the additional image:", error);
    }
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => ["image/jpeg", "image/png"].includes(file.type));

    if (validFiles.length !== files.length) {
      setAdditionalImagesError("Only JPG or PNG files are accepted.");
      return;
    }

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setAdditionalImagePreviews((prev) => [...prev, ...newPreviews]);
    setAdditionalImages((prev) => [...prev, ...validFiles]);

    // Open the crop modal for the first new image
    if (newPreviews.length > 0) {
      setImageToCrop(newPreviews[0]);
      setCurrentAdditionalImageIndex(additionalImagePreviews.length); // Set the index of the image being cropped
      setCropModalOpen(true);
    }

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

    if (!day_before_expiry) {
      setDayBeforeExpiryError("Day Before Expiry is required");
      return false;
    }

    if (!product_type.trim()) {
      setProductTypeError("Product Type is required.");
      return false;
    }
    if (!description.trim()) {
      setDescriptionError("Description is required.");
      return false;
    } else if (description.length > 255) {
      setDescriptionError("Description cannot be longer than 255 characters.");
      return false;
    }

    if (!mainImage) {
      setMainImageError("The main image is required.");
      return false;
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

  const handleKeyChange = (index, key) => {
    const updatedRows = [...infoRows];
    updatedRows[index].key = key;
    setInfoRows(updatedRows);

    setProduct((prev) => ({
      ...prev,
      infos: {
        ...prev.infos,
        [key]: updatedRows[index].value,
      },
    }));
  };

  const handleValueChange = (index, value) => {
    const updatedRows = [...infoRows];
    updatedRows[index].value = value;
    setInfoRows(updatedRows);

    setProduct((prev) => ({
      ...prev,
      infos: {
        ...prev.infos,
        [updatedRows[index].key]: value,
      },
    }));
  };

  const handleRemoveRow = (index) => {
    const updatedRows = infoRows.filter((_, i) => i !== index);
    const removedKey = infoRows[index].key;
    setInfoRows(updatedRows);

    setProduct((prev) => {
      const updatedInfos = { ...prev.infos };
      delete updatedInfos[removedKey];
      return {
        ...prev,
        infos: updatedInfos,
      };
    });
  };

  const addInfoRow = () => {
    setInfoRows((prev) => [...prev, { key: "", value: "" }]);
  };

  function InfoRow({ product }) {}

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
                          <>
                            <img
                              src={mainImagePreview}
                              alt="Main Preview"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                              }}
                            />
                            <Button
                              variant="outlined"
                              sx={{
                                position: "absolute",
                                bottom: "10px",
                                right: "10px",
                                backgroundColor: "white",
                                "&:hover": {
                                  backgroundColor: "#f0f0f0",
                                },
                              }}
                              onClick={() => setCropModalOpen(true)} // Re-open the crop modal
                            >
                              Adjust Crop
                            </Button>
                          </>
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
                        <input
                          type="file"
                          hidden
                          onChange={(e) => {
                            handleMainImageChange(e);
                            e.target.value = ""; // Reset the input value
                          }}
                        />
                      </Button>

                      {/* Crop Modal */}
                      <Modal open={cropModalOpen} onClose={() => setCropModalOpen(false)}>
                        <Box
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "90%",
                            maxWidth: "500px",
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 4,
                            borderRadius: "8px",
                          }}
                        >
                          <Box
                            sx={{
                              position: "relative",
                              width: "100%",
                              height: "300px", // Fixed height for the cropper
                              background: "#333", // Optional: Add a background color
                            }}
                          >
                            <Cropper
                              image={imageToCrop}
                              crop={crop}
                              zoom={zoom}
                              aspect={1} // Adjust aspect ratio as needed
                              onCropChange={setCrop}
                              onZoomChange={setZoom}
                              onCropComplete={onCropComplete}
                            />
                          </Box>
                          <Slider
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            onChange={(e, zoom) => setZoom(zoom)}
                            sx={{ mt: 2 }}
                          />
                          <Box display="flex" justifyContent="space-between" mt={2}>
                            <Button variant="outlined" onClick={() => setCropModalOpen(false)}>
                              Cancel
                            </Button>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={
                                currentAdditionalImageIndex !== null
                                  ? handleAdditionalImageCropSave // Use the additional image crop save function
                                  : handleCropSave // Use the main image crop save function
                              }
                            >
                              Save
                            </Button>
                          </Box>
                        </Box>
                      </Modal>

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

                      <FormControl fullWidth>
                        <FormLabel style={{ fontSize: "0.7em", marginTop: "15px" }}>
                          Article
                        </FormLabel>
                        <ReactQuill
                          theme="snow"
                          value={product.article_md}
                          onChange={(value) => handleChange("article_md", value)}
                          style={{ height: "200px", marginBottom: "60px", borderRadius: "15px" }}
                        />
                      </FormControl>
                      {/* <TextField
                        fullWidth
                        label="Article MD"
                        value={product.article_md}
                        onChange={(e) => handleChange("article_md", e.target.value)}
                        margin="normal"
                      /> */}
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

                      <TableContainer
                        component={Paper}
                        style={{
                          borderRadius: "12px",
                          overflow: "hidden",
                          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                          marginTop: "15px",
                        }}
                      >
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Instructions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {product.instructions?.map((instruction, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <TextField
                                    fullWidth
                                    label={`Instruction ${index + 1}`}
                                    value={instruction}
                                    onChange={(e) => {
                                      const updatedInstructions = [...product.instructions];
                                      updatedInstructions[index] = e.target.value;
                                      setProduct((prev) => ({
                                        ...prev,
                                        instructions: updatedInstructions,
                                      }));
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => {
                                      const updatedInstructions = product.instructions.filter(
                                        (_, i) => i !== index
                                      );
                                      setProduct((prev) => ({
                                        ...prev,
                                        instructions: updatedInstructions,
                                      }));
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>

                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            setProduct((prev) => ({
                              ...prev,
                              instructions: [...(prev.instructions || []), ""],
                            }));
                          }}
                          style={{ backgroundColor: "green", color: "white", margin: "10px" }}
                        >
                          Add Instruction
                        </Button>
                      </TableContainer>
                      <TableContainer
                        component={Paper}
                        style={{
                          borderRadius: "12px",
                          overflow: "hidden",
                          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                          marginTop: "15px",
                        }}
                      >
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell colSpan={2}>Additional Informations</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {infoRows.map((row, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <TextField
                                    fullWidth
                                    label="Key"
                                    value={row.key}
                                    onChange={(e) => handleKeyChange(index, e.target.value)}
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    fullWidth
                                    label="Value"
                                    value={row.value}
                                    onChange={(e) => handleValueChange(index, e.target.value)}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleRemoveRow(index)}
                                  >
                                    Remove
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>

                        <Button
                          variant="contained"
                          color="primary"
                          onClick={addInfoRow}
                          style={{ backgroundColor: "green", color: "white", margin: "10px" }}
                        >
                          Add Info Row
                        </Button>
                      </TableContainer>

                      {/* Success & Error Messages */}
                      {successMessage && (
                        <p
                          style={{
                            color: "green",
                            fontSize: "0.9em",
                            fontWeight: "bold",
                            marginTop: "10px",
                          }}
                        >
                          {successMessage}
                        </p>
                      )}
                      {errorMessage && (
                        <p style={{ color: "red", fontSize: "0.9em", marginTop: "10px" }}>
                          {errorMessage}
                        </p>
                      )}
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
