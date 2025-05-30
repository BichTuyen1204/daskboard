import { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import Card from "@mui/material/Card";
import {
  Grid,
  TextField,
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
import Button from "@mui/material/Button";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Link } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Delete";
import ProductService from "api/ProductService";
import MDEditor from "@uiw/react-md-editor";
import Cropper from "react-easy-crop";
import getCroppedImg from "utils/cropImage"; // Utility function to crop the image

function AddMealkit() {
  const [product, setProduct] = useState({
    article_md: "",
    ingredients: {},
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
    } catch (error) {}
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
    } catch (error) {}
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
    // Convert to number for proper comparison
    const numAmount = parseFloat(amount);

    // Validate amount is a positive number
    const error =
      !amount || isNaN(numAmount) || numAmount <= 0 ? "Amount must be greater than 0" : "";

    setProduct((prev) => ({
      ...prev,
      ingredients: {
        ...prev.ingredients,
        [id]: amount,
      },
    }));

    // Update ingredient errors
    if (error) {
      // Set error for this specific ingredient
      setIngredientsError((prev) => ({
        ...prev,
        [id]: error,
      }));
    } else {
      // Clear error for this ingredient
      setIngredientsError((prev) => {
        // If ingredients error is a string, convert to object first
        const errors = typeof prev === "string" ? {} : { ...prev };
        delete errors[id];

        // If no more errors, return empty string, otherwise return object
        return Object.keys(errors).length > 0 ? errors : "";
      });
    }
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

    if (!article_md.trim()) {
      setArticleMDError("The article is required.");
      return false;
    }

    // Add validation for ingredients - ensure we have at least one ingredient
    const ingredientIds = Object.keys(product.ingredients);
    if (ingredientIds.length === 0) {
      setIngredientsError("At least one ingredient is required.");
      return false;
    }

    // Check if any ingredient has an invalid amount
    let hasInvalidAmount = false;
    const errors = {};

    ingredientIds.forEach((id) => {
      const amount = product.ingredients[id];
      const numAmount = parseFloat(amount);
      if (!amount || isNaN(numAmount) || numAmount <= 0) {
        errors[id] = "Amount must be greater than 0";
        hasInvalidAmount = true;
      }
    });

    if (hasInvalidAmount) {
      setIngredientsError(errors);
      return false;
    }

    // Add validation for instructions - ensure we have at least one instruction
    if (!instructions || instructions.length === 0) {
      setInstructionsError("At least one instruction is required.");
      return false;
    }

    // Check if any instruction is empty
    const hasEmptyInstruction = instructions.some(
      (instruction) => !instruction || instruction.trim() === ""
    );

    if (hasEmptyInstruction) {
      setInstructionsError("Instructions cannot be empty.");
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
    for (const pair of formData.entries()) {
    }
    additionalImages.forEach((image, index) => {});

    try {
      const response = await ProductService.createMealkit(formData);
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
    // Remove immediate update to product.infos
  };

  const handleValueChange = (index, value) => {
    const updatedRows = [...infoRows];
    updatedRows[index].value = value;
    setInfoRows(updatedRows);
    // Remove immediate update to product.infos
  };

  const synchronizeInfosWithRows = () => {
    const updatedInfos = {};
    infoRows.forEach((row) => {
      if (row.key && row.key.trim() !== "") {
        updatedInfos[row.key] = row.value;
      }
    });

    setProduct((prev) => ({
      ...prev,
      infos: updatedInfos,
    }));
  };

  const handleRemoveRow = (index) => {
    const updatedRows = infoRows.filter((_, i) => i !== index);
    setInfoRows(updatedRows);

    // Update product state immediately with the new infos
    const updatedInfos = {};
    updatedRows.forEach((row) => {
      if (row.key && row.key.trim() !== "") {
        updatedInfos[row.key] = row.value;
      }
    });

    setProduct((prev) => ({
      ...prev,
      infos: updatedInfos,
    }));
  };

  const addInfoRow = () => {
    setInfoRows((prev) => [...prev, { key: "", value: "" }]);
  };

  const handleKeyBlur = () => {
    synchronizeInfosWithRows();
  };

  const handleValueBlur = () => {
    synchronizeInfosWithRows();
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
                        Main Image <span style={{ color: "red" }}>*</span>
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
                            <IconButton
                              sx={{
                                position: "absolute",
                                bottom: "10px",
                                right: "10px",
                                backgroundColor: "white",
                                border: "black solid 1px",
                                "&:hover": {
                                  backgroundColor: "#f0f0f0",
                                },
                              }}
                              onClick={() => setCropModalOpen(true)} // Re-open the crop modal
                            >
                              <Icon>crop</Icon>
                            </IconButton>
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
                        <p
                          style={{
                            marginTop: "20px",
                            fontSize: "0.7em",
                            fontWeight: "500",
                            marginBottom: "-10px",
                          }}
                        >
                          <span style={{ fontSize: "0.9em" }}>
                            Ingredient <span style={{ color: "red" }}>*</span>
                          </span>
                        </p>
                        {/* Search Bar */}
                        <Autocomplete
                          freeSolo={false}
                          options={searchResults}
                          getOptionLabel={(option) => option.name || ""}
                          loading={loading}
                          onInputChange={(e, value) => {
                            setSearchQuery(value); // Update the search query
                            setSearchResults([]); // Clear previous results
                          }}
                          onChange={(e, value) => {
                            if (value && typeof value === "object" && value.id) {
                              handleAddIngredient(value);
                            }
                          }}
                          ListboxProps={{
                            style: {
                              maxHeight: "100px", // Set a maximum height for the dropdown
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
                                src={option.image}
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
                              style={{ marginTop: "15px" }}
                              {...params}
                              label="Search Ingredients"
                              placeholder="Type to search and select from the list..."
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
                              helperText="Please select an ingredient from the search results"
                            />
                          )}
                        />

                        <TableContainer
                          component={Paper}
                          style={{
                            borderRadius: "12px",
                            overflow: "hidden",
                            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                            marginTop: "15px",
                            width: "100%",
                          }}
                        >
                          <Table sx={{ tableLayout: "fixed", width: "100%" }}>
                            <TableBody>
                              {Object.entries(product.ingredients).map(([id, amount]) => {
                                const productDetails = selectedProducts[id]; // Get full product details
                                return (
                                  <TableRow key={id}>
                                    <TableCell>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 2,
                                        }}
                                      >
                                        {productDetails?.image ? (
                                          <img
                                            src={productDetails.image}
                                            alt={productDetails.name}
                                            style={{
                                              width: "50px",
                                              height: "50px",
                                              objectFit: "cover",
                                              borderRadius: "4px",
                                            }}
                                          />
                                        ) : (
                                          "No Image"
                                        )}
                                        <span>{productDetails?.name || id}</span>
                                      </Box>
                                    </TableCell>
                                    <TableCell>
                                      <TextField
                                        type="number"
                                        label="Amount"
                                        value={amount}
                                        onChange={(e) => handleAmountChange(id, e.target.value)}
                                        size="small"
                                        inputProps={{ min: "0", step: "any" }}
                                        onKeyDown={(e) => {
                                          if (e.key.toLowerCase() === "e") {
                                            e.preventDefault();
                                          }
                                        }}
                                        error={
                                          !!ingredientsError &&
                                          typeof ingredientsError === "object" &&
                                          ingredientsError[id]
                                        }
                                        helperText={
                                          ingredientsError &&
                                          typeof ingredientsError === "object" &&
                                          ingredientsError[id]
                                            ? ingredientsError[id]
                                            : ""
                                        }
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleDeleteIngredient(id)}
                                        size="small"
                                      >
                                        Remove
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </TableContainer>

                        {typeof ingredientsError === "string" && ingredientsError && (
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
                        )}
                      </MDBox>
                    </MDBox>
                  </Grid>

                  {/* Right Section: Product Info */}
                  <Grid item xs={12} md={7}>
                    <form>
                      <TextField
                        fullWidth
                        label={
                          <span style={{ fontSize: "0.9em" }}>
                            Mealkit name <span style={{ color: "red" }}>*</span>
                          </span>
                        }
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
                          marginTop: "-5px",
                          marginBottom: "5px",
                        }}
                      >
                        {productNameError}
                      </p>

                      <TextField
                        fullWidth
                        label={
                          <span style={{ fontSize: "0.9em" }}>
                            Day Before Expiry (days) <span style={{ color: "red" }}>*</span>
                          </span>
                        }
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
                          marginTop: "-5px",
                          marginBottom: "5px",
                        }}
                      >
                        {dayBeforeExpiryError}
                      </p>

                      <TextField
                        fullWidth
                        label={
                          <span style={{ fontSize: "0.9em" }}>
                            Description <span style={{ color: "red" }}>*</span>
                          </span>
                        }
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
                          marginTop: "-5px",
                          marginBottom: "5px",
                        }}
                      >
                        {descriptionError}
                      </p>

                      <FormControl fullWidth>
                        <FormLabel style={{ fontSize: "0.7em", marginTop: "15px" }}>
                          <span style={{ fontSize: "0.9em" }}>
                            Article <span style={{ color: "red" }}>*</span>
                          </span>
                        </FormLabel>
                        <div style={{ marginBottom: "20px" }}>
                          <MDEditor
                            value={product.article_md}
                            onChange={(value) => handleChange("article_md", value || "")}
                          />
                        </div>
                      </FormControl>
                      <p
                        style={{
                          color: "red",
                          fontSize: "0.6em",
                          fontWeight: "450",
                          marginLeft: "5px",
                          marginTop: "-15px",
                          marginBottom: "5px",
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
                              <TableCell>
                                Instructions <span style={{ color: "red" }}>*</span>
                              </TableCell>
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

                                      // Clear instruction error if there's at least one non-empty instruction
                                      if (
                                        updatedInstructions.some((instr) => instr.trim() !== "")
                                      ) {
                                        setInstructionsError("");
                                      }
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
                            // Clear instruction error when adding a new instruction (assuming at least one other instruction exists)
                            if (
                              product.instructions &&
                              product.instructions.length > 0 &&
                              product.instructions.some((instr) => instr.trim() !== "")
                            ) {
                              setInstructionsError("");
                            }
                          }}
                          style={{ backgroundColor: "green", color: "white", margin: "10px" }}
                        >
                          Add Instruction
                        </Button>
                      </TableContainer>
                      <p
                        style={{
                          color: "red",
                          fontSize: "0.6em",
                          fontWeight: "450",
                          marginLeft: "5px",
                        }}
                      >
                        {instructionsError}
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
                              <TableCell colSpan={2}>
                                Additional Informations <span style={{ color: "red" }}>*</span>
                              </TableCell>
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
                                    onBlur={handleKeyBlur}
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    fullWidth
                                    label="Value"
                                    value={row.value}
                                    onChange={(e) => handleValueChange(index, e.target.value)}
                                    onBlur={handleValueBlur}
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
            <Button variant="outlined" color="error" onClick={() => setCropModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              style={{ color: "white", margin: "10px" }}
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
