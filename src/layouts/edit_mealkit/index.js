import { useEffect, useState, useCallback } from "react";
import {
  Card,
  Grid,
  TextField,
  Button,
  MenuItem,
  Icon,
  Typography,
  FormControl,
  FormLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import axios from "axios";
import ProductService from "api/ProductService";
import MDEditor from "@uiw/react-md-editor";
import debounce from "lodash.debounce";

const REACT_APP_BACKEND_API_ENDPOINT = process.env.REACT_APP_BACKEND_API_ENDPOINT;

function EditMealkit() {
  const navigate = useNavigate();
  const [product, setProduct] = useState("");
  const { prod_id } = useParams();
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));
  const [quantity, setQuantity] = useState("");
  const [quantityError, setQuantityError] = useState("");
  const [updateQuantitySuccess, setUpdateQuantitySuccess] = useState("");
  const [status, setStatus] = useState("");
  const [statusError, setStatusError] = useState("");
  const [updateStatusSuccess, setUpdateStatusSuccess] = useState("");
  const [price, setPrice] = useState("");
  const [priceError, setPriceError] = useState("");
  const [in_price, setInPrice] = useState("");
  const [in_priceError, setInPriceError] = useState("");
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
  const [instructions, setInstructions] = useState([]);
  const [instructionsError, setInstructionsError] = useState("");
  const [madeIn, setMadeIn] = useState("");
  const [madeInError, setMadeInError] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [ingredientError, setIngredientError] = useState("");
  const [updateInfomationSuccess, setUpdateInfomationSuccess] = useState("");
  const [infoRows, setInfoRows] = useState([{ key: "", value: "" }]);
  const [ingredientsError, setIngredientsError] = useState("");

  // State for Producst Data
  const [mealkitInfo, setMealkitInfo] = useState({
    day_before_expiry: 0,
    description: "",
    article_md: "",
    infos: {},
    instructions: [],
    ingredients: {},
  });

  const [productStatus, setProductStatus] = useState({ status: "" });
  const [productQuantity, setProductQuantity] = useState({ quantity: 0, in_price: 0 });
  const [productPrice, setProductPrice] = useState({ price: 0, sale_percent: 0 });

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState({});

  // Ensure user is authenticated
  useEffect(() => {
    if (!jwtToken) navigate("/sign-in", { replace: true });
  }, [navigate, jwtToken]);

  // Debounce the search query
  const debounceSearch = useCallback(
    debounce((query) => {
      setDebouncedQuery(query);
      setPage(0);
    }, 500),
    []
  );

  // Update the debounced query when the user types
  useEffect(() => {
    debounceSearch(searchQuery);
  }, [searchQuery, debounceSearch]);

  // Fetch products from API
  const fetchProducts = async (query, page) => {
    if (page >= totalPages && page !== 0) return;
    setLoading(true);

    try {
      // Add a small delay before making the API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      const response = await ProductService.searchProducts(query, page);
      const { content = [], total_page = 1 } = response || {};

      setSearchResults((prev) => {
        if (page === 0) {
          return content;
        }
        return [...prev, ...content];
      });

      setTotalPages(total_page);
    } catch (error) {
      console.error("Error fetching products:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products when the debounced query or page changes
  useEffect(() => {
    if (debouncedQuery.trim() !== "") {
      fetchProducts(debouncedQuery, page);
    }
  }, [debouncedQuery, page]);

  // Handle adding an ingredient
  const handleAddIngredient = (selectedProduct) => {
    setMealkitInfo((prev) => {
      if (prev.ingredients[selectedProduct.id]) {
        return prev; // Don't add duplicate ingredients
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

  // Handle changing ingredient amount
  const handleAmountChange = (id, amount) => {
    setMealkitInfo((prev) => ({
      ...prev,
      ingredients: {
        ...prev.ingredients,
        [id]: amount,
      },
    }));
  };

  // Handle deleting an ingredient
  const handleDeleteIngredient = (id) => {
    setMealkitInfo((prev) => {
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

  // Update getProductDetail function to handle ingredient data properly
  const getProductDetailWithIngredients = async () => {
    if (!jwtToken) return;
    try {
      // Get basic product info
      const response = await ProductService.getProductDetail(prod_id);
      console.log("Product detail:", response);

      setProduct(response);
      setQuantity(response.available_quantity);
      setStatus(response.product_status);
      setDayBeforeExpiry(response.day_before_expiry || 0);
      setDescription(response.description || "");
      setArticleMd(response.article || "");
      setInstructions(response.instructions || []);

      // Get ingredients using the dedicated API
      const ingredientsResponse = await ProductService.getIngredient(prod_id, 1, 100);
      console.log("Ingredients:", ingredientsResponse);

      // Process ingredients data
      const ingredients = {};
      const ingredientDetails = {};

      if (ingredientsResponse && ingredientsResponse.content) {
        ingredientsResponse.content.forEach((item) => {
          ingredients[item.id] = item.amount;
          ingredientDetails[item.id] = {
            id: item.id,
            name: item.name,
            image: item.image,
            product_name: item.name,
          };
        });
      }

      setSelectedProducts(ingredientDetails);

      // Set the complete mealkitInfo
      setMealkitInfo({
        day_before_expiry: response.day_before_expiry || 0,
        description: response.description || "",
        article_md: response.article || "",
        infos: response.info || {},
        instructions: response.instructions || [],
        ingredients: ingredients,
      });

      // Load additional info into infoRows
      const infos = response.info || {};
      const infoRowsArray = Object.entries(infos).map(([key, value]) => ({ key, value }));
      if (infoRowsArray.length > 0) {
        setInfoRows(infoRowsArray);
      } else {
        setInfoRows([{ key: "", value: "" }]);
      }
    } catch (error) {
      console.error(
        "Error during API calls:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // Replace the useEffect that calls getProductDetail
  useEffect(() => {
    getProductDetailWithIngredients();
  }, [prod_id]);

  useEffect(() => {
    async function fetchPrice() {
      try {
        const token = sessionStorage.getItem("jwtToken");
        const response = await axios.get(
          `${REACT_APP_BACKEND_API_ENDPOINT}/api/staff/product/history/stock?prod_id=${prod_id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data;
        if (data.length === 0) return;

        const latestEntry = data.sort((a, b) => new Date(b.in_date) - new Date(a.in_date))[0];
        setInPrice(latestEntry.in_price);
        console.log("Updated inPrice:", latestEntry.in_price);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    }
    fetchPrice();
  }, [prod_id]);

  const updateQuantity = async (e) => {
    e.preventDefault();
    QuantityBlur();
    if (!quantityError && quantity && !in_priceError && in_price) {
      try {
        const response = await ProductService.updateProductQuantity(
          prod_id,
          parseInt(quantity),
          Number(in_price)
        );
        console.log("Update quantity and price successful", response);
        setUpdateQuantitySuccess("Quantity and price updated successfully.");
      } catch (error) {
        console.error(
          "Error during API calls:",
          error.response ? error.response.data : error.message
        );
      }
    }
  };

  const updateStatus = async (e) => {
    e.preventDefault();
    StatusBlur();
    if (!statusError && status) {
      try {
        const response = await ProductService.updateProductStatus(prod_id, status.toString());
        console.log("Update status successful", response);
        setUpdateStatusSuccess("Status updated successfully.");
      } catch (error) {
        console.error(
          "Error during API calls:",
          error.response ? error.response.data : error.message
        );
      }
    }
  };

  const updatePrice = async (e) => {
    e.preventDefault();
    PriceBlur();
    SalePersentBlur();
    if (!prod_id || !price || saleError || priceError || !sale_percent) {
      console.error("Cannot proceed: Price or Sale Percent is still blurred.");
      return;
    } else {
      try {
        console.log("Price", price, "Sale percent", sale_percent);
        const response = await ProductService.updateProductPrice(
          prod_id,
          Number(price),
          Number(sale_percent)
        );
        console.log("Update price and sale percent successful", response);
        setUpdatePriceSuccess("Price and sale percent updated successfully.");
      } catch (error) {
        console.error(
          "Error during API calls:",
          error.response ? error.response.data : error.message
        );
      }
    }
  };

  const updateInfos = async (e) => {
    e.preventDefault();
    DayBeforeExpiryBlur();
    DescriptionBlur();

    synchronizeInfosWithRows();

    if (!prod_id || dayBeforeExpiryError || descriptionError || !dayBeforeExpiry || !description) {
      console.error("Invalid input data");
      return;
    } else {
      try {
        console.log("Sending data:", JSON.stringify(mealkitInfo, null, 2));
        const response = await ProductService.updateMealkitInfo(prod_id, mealkitInfo);
        console.log("Update infos successful", response);
        setUpdateInfomationSuccess("Information updated successfully.");
        window.location.reload(); // Refresh the page
      } catch (error) {
        console.error(
          "Error during API calls:",
          error.response ? error.response.data : error.message
        );
      }
    }
  };

  const QuantityChange = (e) => {
    const { value } = e.target;
    setQuantity(value);
    setProductQuantity((preState) => ({ ...preState, quantity: value }));
    setUpdateQuantitySuccess(false);
  };

  const QuantityBlur = () => {
    if (quantity === "") {
      setQuantityError("Please enter a quantity");
    } else if (quantity < 1) {
      setQuantityError("Please enter a quantity greater than 1");
    } else {
      setQuantityError("");
    }
  };

  const StatusChange = (e) => {
    const { value } = e.target;
    setStatus(value);
    setProductStatus((preState) => ({ ...preState, status: value }));
    setUpdateStatusSuccess(false);
  };

  const StatusBlur = () => {
    if (status.trim === "") {
      setStatusError("Please enter a status");
    } else {
      setStatusError("");
    }
  };

  const PriceChange = (e) => {
    const { value } = e.target;
    setPrice(value);
    setProductPrice((preState) => ({ ...preState, price: value }));
    setUpdatePriceSuccess(false);
  };

  const PriceBlur = () => {
    if (price === "") {
      setPriceError("Please enter a price");
    } else if (quantity < 1) {
      setPriceError("Please enter a price greater than 1");
    } else {
      setPriceError("");
    }
  };

  const InPriceChange = (e) => {
    const { value } = e.target;
    setInPrice(value);
    setProductQuantity((preState) => ({ ...preState, in_price: value }));
    setUpdateQuantitySuccess(false);
  };

  const InPriceBlur = () => {
    if (in_price === "") {
      setInPriceError("Please enter a purchase price");
    } else if (in_price < 1) {
      setInPriceError("Please enter a purchase price greater than 0");
    } else {
      setInPriceError("");
    }
  };

  const SalePersentChange = (e) => {
    const { value } = e.target;
    setSale(value);
    setProductPrice((preState) => ({ ...preState, sale_percent: value }));
    setUpdatePriceSuccess(false);
  };

  const SalePersentBlur = () => {
    if (sale_percent === "") {
      setSaleError("Please enter a sale percent");
    } else if (sale_percent < 0) {
      setSaleError("Please enter a sale percent of 0 or greater");
    } else if (sale_percent > 100) {
      setSaleError("Please enter a sale persent less than 100");
    } else {
      setSaleError("");
    }
  };

  const DayBeforeExpiryChange = (e) => {
    const { value } = e.target;
    setDayBeforeExpiry(value);
    updateField("day_before_expiry", value);
    setUpdateInfomationSuccess(false);
  };

  const DayBeforeExpiryBlur = () => {
    if (dayBeforeExpiry === "") {
      setDayBeforeExpiryError("Please enter a day before expiry");
    } else if (dayBeforeExpiry < 0) {
      setDayBeforeExpiryError("Please enter a day before expiry greater than 0");
    } else {
      setDayBeforeExpiryError("");
    }
  };

  const DescriptionChange = (e) => {
    const { value } = e.target;
    setDescription(value);
    updateField("description", value);
    setUpdateInfomationSuccess(false);
  };

  const DescriptionBlur = () => {
    if (description === "") {
      setDescriptionError("Please enter a description");
    } else {
      setDescriptionError("");
    }
  };

  const ArticleMdChange = (value) => {
    setArticleMd(value || "");
    updateField("article_md", value);
    setUpdateInfomationSuccess(false);
  };

  const ArticleMdBlur = () => {
    if (articleMd === "") {
      setArticleMdError("Please enter a article");
    } else {
      setArticleMdError("");
    }
  };

  const InstructionsChange = (e) => {
    const { value } = e.target;
    // Don't update instructions state directly from input value
    // This will be handled in the table UI instead
    setUpdateInfomationSuccess(false);
  };

  const InstructionsBlur = () => {
    if (!instructions || instructions.length === 0) {
      setInstructionsError("Please enter at least one instruction");
    } else {
      setInstructionsError("");
    }
  };

  const updateArrayField = (field, value) => {
    setMealkitInfo((prevState) => ({
      ...prevState,
      [field]: Array.isArray(value) ? value : [value],
    }));
  };

  const handleKeyChange = (index, key) => {
    const updatedRows = [...infoRows];
    updatedRows[index].key = key;
    setInfoRows(updatedRows);
  };

  const handleValueChange = (index, value) => {
    const updatedRows = [...infoRows];
    updatedRows[index].value = value;
    setInfoRows(updatedRows);
  };

  const synchronizeInfosWithRows = () => {
    const updatedInfos = {};
    infoRows.forEach((row) => {
      if (row.key && row.key.trim() !== "") {
        updatedInfos[row.key] = row.value;
      }
    });

    setMealkitInfo((prev) => ({
      ...prev,
      infos: updatedInfos,
    }));
  };

  const handleRemoveRow = (index) => {
    const updatedRows = infoRows.filter((_, i) => i !== index);
    setInfoRows(updatedRows);
  };

  const handleKeyBlur = () => {
    synchronizeInfosWithRows();
  };

  const handleValueBlur = () => {
    synchronizeInfosWithRows();
  };

  const addInfoRow = () => {
    setInfoRows((prev) => [...prev, { key: "", value: "" }]);
  };

  return (
    <DashboardLayout>
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3}>
          {/* Left Column (2 parts) */}
          <Grid item xs={12} md={3}>
            <Card>
              <MDBox p={3}>
                <Link
                  to="/mealkit"
                  onClick={() => {
                    setTimeout(() => {
                      window.location.reload();
                    }, 0);
                  }}
                >
                  <Icon sx={{ cursor: "pointer", "&:hover": { color: "gray" } }}>arrow_back</Icon>
                </Link>
                <p style={{ fontSize: "0.8em" }}>
                  INGREDIENT NAME: <strong>{product.product_name}</strong>
                </p>
                {/* Update Quantity */}
                <p style={{ fontWeight: "700", fontSize: "0.6em", marginBottom: "-5px" }}>
                  UPDATE QUANTITY
                </p>
                <TextField
                  fullWidth
                  type="number"
                  value={quantity || ""}
                  onChange={QuantityChange}
                  onBlur={QuantityBlur}
                  onKeyDown={(e) => {
                    if (e.key.toLowerCase() === "e") {
                      e.preventDefault();
                    }
                  }}
                  label="Quantity"
                  margin="normal"
                />
                {quantityError && (
                  <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                    {quantityError}
                  </p>
                )}

                <TextField
                  fullWidth
                  label="Purchase price"
                  type="number"
                  value={in_price}
                  onChange={InPriceChange}
                  onBlur={InPriceBlur}
                  onKeyDown={(e) => {
                    if (e.key.toLowerCase() === "e") {
                      e.preventDefault();
                    }
                  }}
                  margin="normal"
                />
                {in_priceError && (
                  <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                    {in_priceError}
                  </p>
                )}
                {updateQuantitySuccess && (
                  <p
                    style={{
                      color: "green",
                      fontSize: "0.6em",
                      fontWeight: "600",
                      marginLeft: "5px",
                      marginBottom: "5px",
                    }}
                  >
                    {updateQuantitySuccess}
                  </p>
                )}
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  onClick={updateQuantity}
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

                {/* Update Price */}
                <p style={{ fontWeight: "700", fontSize: "0.6em", marginBottom: "-5px" }}>
                  UPDATE PRICE AND SALE PERCENT
                </p>
                <TextField
                  fullWidth
                  label="Selling price"
                  type="number"
                  value={price}
                  onChange={PriceChange}
                  onBlur={PriceBlur}
                  onKeyDown={(e) => {
                    if (e.key.toLowerCase() === "e") {
                      e.preventDefault();
                    }
                  }}
                  margin="normal"
                />
                {priceError && (
                  <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>{priceError}</p>
                )}

                <TextField
                  fullWidth
                  label="Sale Percent"
                  type="number"
                  value={sale_percent}
                  onChange={SalePersentChange}
                  onBlur={SalePersentBlur}
                  onKeyDown={(e) => {
                    if (e.key.toLowerCase() === "e") {
                      e.preventDefault();
                    }
                  }}
                  margin="normal"
                />
                {saleError && (
                  <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>{saleError}</p>
                )}
                {updatePriceSuccess && (
                  <p
                    style={{
                      color: "green",
                      fontSize: "0.6em",
                      fontWeight: "600",
                      marginLeft: "5px",
                      marginBottom: "5px",
                    }}
                  >
                    {updatePriceSuccess}
                  </p>
                )}
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  onClick={updatePrice}
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

                {/* Update Status */}
                <p style={{ fontWeight: "700", fontSize: "0.6em", marginBottom: "-5px" }}>
                  UPDATE STATUS
                </p>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  value={status}
                  onChange={StatusChange}
                  onBlur={StatusBlur}
                  sx={{ height: "45px", ".MuiInputBase-root": { height: "45px" } }}
                  margin="normal"
                >
                  <MenuItem value="IN_STOCK">In stock</MenuItem>
                  <MenuItem value="OUT_OF_STOCK">Out of stock</MenuItem>
                  <MenuItem value="NO_LONGER_IN_SALE">No longer in sale</MenuItem>
                </TextField>
                {statusError && (
                  <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                    {statusError}
                  </p>
                )}
                {updateStatusSuccess && (
                  <p
                    style={{
                      color: "green",
                      fontSize: "0.6em",
                      fontWeight: "600",
                      marginLeft: "5px",
                      marginBottom: "5px",
                    }}
                  >
                    {updateStatusSuccess}
                  </p>
                )}
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  onClick={updateStatus}
                  style={{
                    backgroundColor: "#00C1FF",
                    color: "white",
                    padding: "5px 10px",
                    fontSize: "0.6em",
                  }}
                >
                  Save
                </Button>
              </MDBox>
            </Card>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={9}>
            <Card>
              <MDBox p={3}>
                {/* Update Information */}
                <p style={{ fontWeight: "700", fontSize: "0.6em", marginBottom: "-5px" }}>
                  UPDATE INFORMATION
                </p>
                <TextField
                  fullWidth
                  type="text"
                  label="Description"
                  value={description || ""}
                  onChange={DescriptionChange}
                  onBlur={DescriptionBlur}
                  margin="normal"
                  multiline
                  rows={4}
                />
                {descriptionError && (
                  <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                    {descriptionError}
                  </p>
                )}

                <TextField
                  fullWidth
                  type="number"
                  label="Day before expiry"
                  value={dayBeforeExpiry || ""}
                  onChange={DayBeforeExpiryChange}
                  onBlur={DayBeforeExpiryBlur}
                  onKeyDown={(e) => {
                    if (e.key.toLowerCase() === "e") {
                      e.preventDefault();
                    }
                  }}
                  margin="normal"
                />
                {dayBeforeExpiryError && (
                  <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                    {dayBeforeExpiryError}
                  </p>
                )}

                <FormControl fullWidth>
                  <FormLabel style={{ fontSize: "0.7em", marginTop: "15px" }}>Article</FormLabel>
                  <div style={{ marginBottom: "20px" }}>
                    <MDEditor value={articleMd} onChange={ArticleMdChange} />
                  </div>
                </FormControl>
                {articleMdError && (
                  <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                    {articleMdError}
                  </p>
                )}

                {/* Ingredients Section */}
                <MDBox mt={4} mb={2}>
                  <MDTypography variant="h6">Ingredients</MDTypography>

                  {/* Search Bar */}
                  <Autocomplete
                    freeSolo
                    options={searchResults}
                    getOptionLabel={(option) => option.name || ""}
                    loading={loading}
                    onInputChange={(e, value) => {
                      setSearchQuery(value);
                      setSearchResults([]);
                    }}
                    onChange={(e, value) => value && handleAddIngredient(value)}
                    ListboxProps={{
                      style: {
                        maxHeight: "100px",
                        overflow: "auto",
                      },
                      onScroll: (event) => {
                        const listboxNode = event.currentTarget;
                        if (
                          listboxNode.scrollTop + listboxNode.clientHeight ===
                          listboxNode.scrollHeight
                        ) {
                          setPage((prevPage) => prevPage + 1);
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
                        {...params}
                        label="Search Ingredients"
                        placeholder="Type to search..."
                        margin="normal"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loading ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />

                  {/* Ingredients Table */}
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
                          <TableCell>Ingredient</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(mealkitInfo.ingredients || {}).map(([id, amount]) => {
                          const productDetails = selectedProducts[id];
                          return (
                            <TableRow key={id}>
                              <TableCell>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                                    <Box
                                      sx={{
                                        width: 50,
                                        height: 50,
                                        bgcolor: "#eee",
                                        borderRadius: "4px",
                                      }}
                                    />
                                  )}
                                  <span>{productDetails?.name || id}</span>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <TextField
                                  type="text"
                                  label="Amount"
                                  value={amount}
                                  onChange={(e) => handleAmountChange(id, e.target.value)}
                                  size="small"
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

                  {ingredientsError && (
                    <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                      {ingredientsError}
                    </p>
                  )}
                </MDBox>

                <Grid item xs={12}>
                  {/* Instructions */}
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
                        {instructions?.map((instruction, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <TextField
                                fullWidth
                                label={`Instruction ${index + 1}`}
                                value={instruction}
                                onChange={(e) => {
                                  const updatedInstructions = [...instructions];
                                  updatedInstructions[index] = e.target.value;
                                  setInstructions(updatedInstructions);
                                  updateArrayField("instructions", updatedInstructions);
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => {
                                  const updatedInstructions = instructions.filter(
                                    (_, i) => i !== index
                                  );
                                  setInstructions(updatedInstructions);
                                  updateArrayField("instructions", updatedInstructions);
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
                        setInstructions((prev) => [...(prev || []), ""]);
                        updateArrayField("instructions", [...(instructions || []), ""]);
                      }}
                      style={{ backgroundColor: "green", color: "white", margin: "10px" }}
                    >
                      Add Instruction
                    </Button>
                  </TableContainer>

                  {/* Additional Informations */}
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
                </Grid>

                {updateInfomationSuccess && (
                  <p
                    style={{
                      color: "green",
                      fontSize: "0.6em",
                      fontWeight: "600",
                      marginLeft: "5px",
                      marginBottom: "5px",
                    }}
                  >
                    {updateInfomationSuccess}
                  </p>
                )}

                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  onClick={updateInfos}
                  style={{
                    backgroundColor: "#00C1FF",
                    color: "white",
                    padding: "5px 10px",
                    fontSize: "0.6em",
                  }}
                >
                  Save
                </Button>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default EditMealkit;
