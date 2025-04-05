import { useEffect, useState } from "react";
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
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import ProductService from "api/ProductService";
import axios from "axios";
import MDEditor from "@uiw/react-md-editor";
import Container from "@mui/material/Container";

const REACT_APP_BACKEND_API_ENDPOINT = process.env.REACT_APP_BACKEND_API_ENDPOINT;

function EditProduct() {
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
  const [inPrice, setInPrice] = useState("");
  const [inPriceError, setInPriceError] = useState("");
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
  const [instructions, setInstructions] = useState([]); // Ensure it's initialized as an array
  const [instructionsError, setInstructionsError] = useState("");
  const [madeIn, setMadeIn] = useState("");
  const [madeInError, setMadeInError] = useState("");
  const [updateInfomationSuccess, setUpdateInfomationSuccess] = useState("");
  const [infoRows, setInfoRows] = useState([{ key: "", value: "" }]);

  // State for Producst Data
  const [productInfo, setProductInfo] = useState({
    day_before_expiry: 0,
    description: "",
    article_md: "",
    instructions: [],
    infos: {},
  });

  const [productStatus, setProductStatus] = useState({ status: "" });
  const [productQuantity, setProductQuantity] = useState({ quantity: 0, in_price: 0 });
  const [productPrice, setProductPrice] = useState({ price: 0, sale_percent: 0 });

  // Ensure user is authenticated
  useEffect(() => {
    if (!jwtToken) navigate("/sign-in", { replace: true });
  }, [navigate, jwtToken]);

  // Fetch Product Details
  const getProductDetail = async () => {
    try {
      const response = await ProductService.getProductDetail(prod_id);
      console.log("nice", response);

      setProduct(response);

      setQuantity(response.available_quantity);
      setStatus(response.product_status);
      setSale(response.price_list?.[0]?.sale_percent);
      setPrice(response.price_list?.[0]?.price);
      setDayBeforeExpiry(response.day_before_expiry || 0);
      setDescription(response.description || "");
      setArticleMd(response.article || "");
      setInstructions(response.instructions || []); // Ensure instructions is loaded as an array

      // Load additional info into infoRows
      const infos = response.info || {};
      const infoRowsArray = Object.entries(infos).map(([key, value]) => ({ key, value }));
      setInfoRows(infoRowsArray); // Ensure infoRows is updated here

      // Set initial productInfo
      setProductInfo({
        day_before_expiry: response.day_before_expiry || 0,
        description: response.description || "",
        article_md: response.article || "",
        instructions: response.instructions || [],
        infos: infos,
      });
    } catch (error) {
      console.error(
        "Error during API calls:",
        error.response ? error.response.data : error.message
      );
    }
  };

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

  const updateField = (field, value) => {
    setProductInfo((prevState) => ({
      ...prevState,
      [field]: value !== undefined && value !== null ? value : prevState[field],
    }));
  };

  const updateInfoField = (field, value) => {
    setProductInfo((prevState) => ({
      ...prevState,
      infos: {
        ...prevState.infos,
        [field]: value !== undefined && value !== null ? value : prevState.infos[field],
      },
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

    setProductInfo((prev) => ({
      ...prev,
      infos: updatedInfos,
    }));
  };

  const handleRemoveRow = (index) => {
    const updatedRows = infoRows.filter((_, i) => i !== index);
    setInfoRows(updatedRows);

    // Update productInfo state with the new infos
    const updatedInfos = {};
    updatedRows.forEach((row) => {
      if (row.key && row.key.trim() !== "") {
        updatedInfos[row.key] = row.value;
      }
    });

    setProductInfo((prev) => ({
      ...prev,
      infos: updatedInfos,
    }));
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

  const updateQuantity = async (e) => {
    e.preventDefault();
    QuantityBlur();
    if (!quantityError && quantity && !inPriceError && inPrice) {
      try {
        const response = await ProductService.updateProductQuantity(
          prod_id,
          parseInt(quantity),
          Number(inPrice)
        );
        console.log("Update quantity and price successful", response);
        setUpdateQuantitySuccess("Quantity and price updated successfully.");
        window.location.reload(); // Refresh the page
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
        window.location.reload(); // Refresh the page
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
    if (!prod_id || priceError || saleError || !price || !sale_percent) {
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
        setUpdatePriceSuccess("Price and sale percent updated successfully.");
        window.location.reload(); // Refresh the page
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
    InstructionsBlur();
    MadeInBlur();

    synchronizeInfosWithRows();

    if (!prod_id || dayBeforeExpiryError || descriptionError || !dayBeforeExpiry || !description) {
      console.error("Invalid input data");
      return;
    } else {
      try {
        console.log(productInfo);
        const response = await ProductService.updateProductInfo(prod_id, productInfo);
        console.log("Update infos successful", response);
        setUpdateInfomationSuccess("Infor of ingredients updated successfully.");
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

  const InPriceChange = (e) => {
    const { value } = e.target;
    setInPrice(value);
    setProductQuantity((preState) => ({ ...preState, in_price: value }));
    setUpdateQuantitySuccess(false);
  };

  const InPriceBlur = () => {
    if (inPrice === "") {
      setInPriceError("Please enter a purchase price");
    } else if (inPrice < 0) {
      setInPriceError("Please enter a purchase price greater than 0");
    } else {
      setInPriceError("");
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
    } else if (price < 0) {
      setPriceError("Please enter a price greater than 0");
    } else {
      setPriceError("");
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
      setSaleError("Please enter a sale percent less than 100");
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
    } else if (dayBeforeExpiry < 1) {
      setDayBeforeExpiryError("Please enter a day before expiry greater than 0");
    } else {
      setDayBeforeExpiryError("");
    }
  };

  const DescriptionChange = (e) => {
    const { value } = e.target;
    if (value.length > 255) {
      setDescriptionError("Description cannot be longer than 255 characters");
    } else {
      setDescriptionError("");
      setDescription(value);
      updateField("description", value);
      setUpdateInfomationSuccess(false);
    }
  };

  const DescriptionBlur = () => {
    if (description === "") {
      setDescriptionError("Please enter a description");
    } else if (description.length > 255) {
      setDescriptionError("Description cannot be longer than 255 characters");
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

  const WeightChange = (e) => {
    const { value } = e.target;
    setWeight(value);
    updateInfoField("weight", value);
    setUpdateInfomationSuccess(false);
  };

  const WeightBlur = () => {
    if (weight === "") {
      setWeightError("Please enter a weight");
    } else if (weight < 1) {
      setWeightError("Please enter a weight greater than 0");
    } else {
      setWeightError("");
    }
  };

  const InstructionsChange = (e) => {
    const { value } = e.target;
    setInstructions(value);
    updateInfoField("storage_instructions", value);
    setUpdateInfomationSuccess(false);
  };

  const InstructionsBlur = () => {
    if (instructions === "") {
      setInstructionsError("Please enter a instruction");
    } else {
      setInstructionsError("");
    }
  };

  const MadeInChange = (e) => {
    const { value } = e.target;
    setMadeIn(value);
    updateInfoField("made_in", value);
    setUpdateInfomationSuccess(false);
  };

  const MadeInBlur = () => {
    if (madeIn === "") {
      setMadeInError("Please enter a made in");
    } else {
      setMadeInError("");
    }
  };

  // Load product details when component mounts
  useEffect(() => {
    getProductDetail(prod_id);
  }, [prod_id]);

  return (
    <DashboardLayout>
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3}>
          {/* Left Column (2 parts) */}
          <Grid item xs={12} md={3}>
            <Card>
              <MDBox p={3}>
                <Link
                  to="/ingredient"
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
                  value={inPrice}
                  onChange={InPriceChange}
                  onBlur={InPriceBlur}
                  onKeyDown={(e) => {
                    if (e.key.toLowerCase() === "e") {
                      e.preventDefault();
                    }
                  }}
                  margin="normal"
                />
                {inPriceError && (
                  <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                    {inPriceError}
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

          {/* Right Column (8 parts) */}
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
                <p
                  style={{
                    color: "red",
                    fontSize: "0.6em",
                    fontWeight: "450",
                    marginLeft: "5px",
                  }}
                >
                  {articleMdError}
                </p>

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
                                  updateField("instructions", updatedInstructions);
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
                                  updateField("instructions", updatedInstructions);
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
                        updateField("instructions", [...(instructions || []), ""]);
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

export default EditProduct;
