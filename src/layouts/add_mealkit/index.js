import { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce"; // Install lodash.debounce if not already installed
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
  Box,
  Chip,
  Paper,
  Autocomplete,
  CircularProgress,
  Modal,
  Slider,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Link } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Delete";
import ProductService from "api/ProductService";
import ReactQuill from "react-quill";
import Cropper from "react-easy-crop";
import getCroppedImg from "utils/cropImage"; // Utility function to crop the image

function AddMealkit() {
  const [product, setProduct] = useState({
    article_md: "",
    ingredients: {}, // Changed to a dictionary
    infos: {},
    instructions: [""],
    product_type: "MK",
    day_before_expiry: 0,
    product_name: "",
    description: "",
  });
  const [infoRows, setInfoRows] = useState([{ key: "", value: "" }]);
  const [mainImage, setMainImage] = useState(null);
  const [mainImageError, setMainImageError] = useState("");
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [additionalImages, setAdditionalImages] = useState([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);
  const [additionalImagesError, setAdditionalImagesError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [productNameError, setProductNameError] = useState("");
  const [articleMDError, setArticleMDError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [salePercentError, setSalePercentError] = useState("");
  const [dayBeforeExpiryError, setDayBeforeExpiryError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [weightError, setWeightError] = useState("");
  const [ingredientsError, setIngredientsError] = useState("");
  const [instructionsError, setInstructionsError] = useState("");
  const [storageInstructionsError, setStorageInstructionsError] = useState("");
  const [madeInError, setMadeInError] = useState("");
  const [instructionInput, setInstructionInput] = useState("");
  const [brandError, setBrandError] = useState("");
  const [usageInstructionsError, setUsageInstructionsError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(""); // Debounced query
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0); // Start from page 0
  const [totalPages, setTotalPages] = useState(1); // Total pages from API
  const [selectedProducts, setSelectedProducts] = useState({}); // Store selected product details

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [currentAdditionalImageIndex, setCurrentAdditionalImageIndex] = useState(null); // Track the index of the additional image being cropped

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

  // Fetch products from API
  const fetchProducts = async (query, page) => {
    if (page >= totalPages && page !== 0) return; // Stop fetching if we've reached the last page
    setLoading(true);

    try {
      // Add a 1-second delay before making the API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await ProductService.searchProducts(query, page); // Call the real API
      const { content = [], total_page = 1 } = response || {};

      setSearchResults((prev) => {
        // If it's a new query (page 0), replace the results; otherwise, append
        if (page === 0) {
          return content; // Replace results for a new query
        }
        return [...prev, ...content]; // Append results for pagination
      });

      setTotalPages(total_page); // Update total pages
    } catch (error) {
      console.error("Error fetching products:", error);
      setSearchResults([]); // Clear results on error
    } finally {
      setLoading(false);
    }
  };

  // Debounce the search query
  const debounceSearch = useCallback(
    debounce((query) => {
      setDebouncedQuery(query); // Update the debounced query
      setPage(0); // Reset to the first page for a new query
    }, 500), // 500ms debounce delay
    []
  );

  // Update the debounced query when the user types
  useEffect(() => {
    debounceSearch(searchQuery);
  }, [searchQuery, debounceSearch]);

  // Fetch products when the debounced query or page changes
  useEffect(() => {
    if (debouncedQuery.trim() !== "") {
      fetchProducts(debouncedQuery, page);
    }
  }, [debouncedQuery, page]);

  const handleAddIngredient = (selectedProduct) => {
    setProduct((prev) => {
      if (prev.ingredients[selectedProduct.id]) {
        console.warn("Ingredient already exists:", selectedProduct.id);
        return prev; // Do not add duplicate ingredients
      }
      return {
        ...prev,
        ingredients: {
          ...prev.ingredients,
          [selectedProduct.id]: "", // Initialize with an empty amount
        },
      };
    });
    setSelectedProducts((prev) => ({
      ...prev,
      [selectedProduct.id]: selectedProduct, // Store full product details
    }));
  };

  const handleAmountChange = (id, amount) => {
    setProduct((prev) => ({
      ...prev,
      ingredients: {
        ...prev.ingredients,
        [id]: amount,
      },
    }));
  };

  const handleDeleteIngredient = (id) => {
    setProduct((prev) => {
      const updatedIngredients = { ...prev.ingredients };
      delete updatedIngredients[id];
      return { ...prev, ingredients: updatedIngredients };
    });
    setSelectedProducts((prev) => {
      const updatedProducts = { ...prev };
      delete updatedProducts[id];
      return updatedProducts;
    });
  };

  const handleInstructionKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setProduct((prev) => ({
        ...prev,
        instructions: [...prev.instructions, instructionInput.trim()],
      }));
      setInstructionInput("");
    }
  };

  const handleDeleteInstruction = (instruction) => {
    setProduct((prev) => ({
      ...prev,
      instructions: prev.instructions.filter((item) => item !== instruction),
    }));
  };

  const handleChange = (field, value) => {
    if (["price", "sale_percent"].includes(field) && value === "") {
      value = 0;
    }
    setProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
    switch (field) {
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
      case "ingredients":
        if (!value || Object.keys(value).length === 0) {
          setIngredientsError("Ingredients cannot be empty values.");
        } else {
          setIngredientsError("");
        }
        break;
      case "instructions":
        if (!value || value.length === 0 || value.some((item) => item.trim() === "")) {
          setInstructionsError("Instructions cannot be empty values.");
        } else {
          setInstructionsError("");
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
          } else {
            setWeightError("");
          }
          break;
        case "brand":
          if (!value.trim()) {
            setBrandError("Brand are required.");
          } else {
            setBrandError("");
          }
          break;
        case "usage_instruction":
          if (!value.trim()) {
            setUsageInstructionsError("Usage instructions are required.");
          } else {
            setUsageInstructionsError("");
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

  const handleRemoveImage = (index) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
    setAdditionalImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const {
      product_name,
      article_md,
      ingredients,
      instructions,
      price,
      day_before_expiry,
      sale_percent,
      description,
      infos,
    } = product;

    if (!product_name.trim()) {
      setProductNameError("The mealkit name is required.");
      return false;
    }

    if (!day_before_expiry) {
      setDayBeforeExpiryError("Day Before Expiry is required");
      return false;
    }

    if (!description.trim()) {
      setDescriptionError("The description is required.");
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
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("main_image", mainImage);
    additionalImages.forEach((image) => {
      formData.append("additional_images", image);
    });
    formData.append("product_detail", JSON.stringify(product));

    // 🛠 In dữ liệu để kiểm tra trước khi gửi
    console.log("==== FormData Debug ====");
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    console.log("Product Detail JSON:", JSON.stringify(product, null, 2));
    console.log("Main Image:", mainImage);
    additionalImages.forEach((image, index) => {
      console.log(`Additional Image ${index + 1}:`, image.name);
    });
    console.log("========================");

    try {
      const response = await ProductService.createMealkit(formData);
      console.log("MEALKIT Response:", response);
      setSuccessMessage("Mealkit added successfully!");
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
      console.error("API Error:", error.message || "Something went wrong.");
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
                  Add Mealkit
                </MDTypography>
              </MDBox>

              {/* Content */}
              <MDBox p={3}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={5}>
                    <Link
                      to="/mealkit"
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

                      <MDBox>
                        {/* Search Bar */}
                        <Autocomplete
                          freeSolo
                          options={searchResults}
                          getOptionLabel={(option) => option.name || ""}
                          loading={loading}
                          onInputChange={(e, value) => {
                            setSearchQuery(value); // Update the search query
                            setSearchResults([]); // Clear previous results
                          }}
                          onChange={(e, value) => value && handleAddIngredient(value)}
                          ListboxProps={{
                            style: {
                              maxHeight: "200px", // Set a maximum height for the dropdown
                              overflow: "auto", // Enable scrolling
                            },
                            onScroll: (event) => {
                              const listboxNode = event.currentTarget;
                              if (
                                listboxNode.scrollTop + listboxNode.clientHeight ===
                                listboxNode.scrollHeight
                              ) {
                                setPage((prevPage) => prevPage + 1); // Load the next page
                              }
                            },
                          }}
                          renderOption={(props, option) => (
                            <Box
                              {...props}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                padding: "8px",
                              }}
                            >
                              <img
                                src={option.image} // Use the image field from the JSON
                                alt={option.name}
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  borderRadius: "4px",
                                  objectFit: "cover",
                                }}
                              />
                              <span>{option.name}</span>
                            </Box>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Search Ingredients"
                              placeholder="Type to search..."
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {loading ? (
                                      <CircularProgress color="inherit" size={20} />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                  </>
                                ),
                              }}
                            />
                          )}
                        />

                        {/* Selected Ingredients */}
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                          {Object.entries(product.ingredients).map(([id, amount]) => {
                            const productDetails = selectedProducts[id]; // Get full product details
                            return (
                              <Box key={id} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Chip
                                  label={productDetails?.name || id} // Display the product name or fallback to id
                                  onDelete={() => handleDeleteIngredient(id)} // Allow deletion
                                />
                                <TextField
                                  type="number"
                                  label="Amount"
                                  value={amount}
                                  onChange={(e) => handleAmountChange(id, e.target.value)} // Update the amount
                                  size="small"
                                />
                              </Box>
                            );
                          })}
                        </Box>

                        <p
                          style={{
                            color: "red",
                            fontSize: "0.6em",
                            fontWeight: "450",
                            marginLeft: "5px",
                          }}
                        >
                          {ingredientsError}
                        </p>
                      </MDBox>
                    </MDBox>
                  </Grid>

                  {/* Right Section: Product Info */}
                  <Grid item xs={12} md={7}>
                    <form>
                      <TextField
                        fullWidth
                        label="Mealkit name"
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
                        label="Day Before Expiry"
                        type="number"
                        value={product.day_before_expiry}
                        onChange={(e) => handleChange("day_before_expiry", e.target.value)}
                        onFocus={() => handleFocus("day_before_expiry")}
                        onBlur={() => handleBlur("day_before_expiry")}
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
                      <p
                        style={{
                          color: "green",
                          fontSize: "0.6em",
                          fontWeight: "450",
                          marginLeft: "5px",
                          marginTop: "15px",
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
                          Add Mealkit
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
    </DashboardLayout>
  );
}

export default AddMealkit;
