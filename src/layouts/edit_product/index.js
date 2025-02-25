import { useEffect, useState } from "react";
import { Card, Grid, TextField, Button, MenuItem, Icon, Typography } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import axios from "axios";
import ProductService from "api/ProductService";

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
  const [productInfo, setProductInfo] = useState({
    day_before_expiry: 0,
    description: "",
    article_md: "",
    infos: {
      weight: "",
      storage_instructions: "",
      made_in: "",
    },
  });

  const [productStatus, setProductStatus] = useState({ status: "" });
  const [productQuantity, setProductQuantity] = useState({ quantity: 0, price: 0 });
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
      setWeight(response.info?.weight || "");
      setInstructions(response.info?.storage_instructions || "");
      setMadeIn(response.info?.made_in || "");

      // Đặt productInfo ban đầu
      setProductInfo({
        day_before_expiry: response.day_before_expiry || 0,
        description: response.description || "",
        article_md: response.article || "",
        infos: {
          weight: response.info?.weight || "",
          storage_instructions: response.info?.storage_instructions || "",
          made_in: response.info?.made_in || "",
        },
      });
    } catch (error) {
      console.error(
        "Error during API calls:",
        error.response ? error.response.data : error.message
      );
    }
  };

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

  const updateQuantity = async (e) => {
    e.preventDefault();
    QuantityBlur();
    if (!quantityError && quantity) {
      try {
        const response = await ProductService.updateProductQuantity(
          prod_id,
          parseInt(quantity),
          Number(price)
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
    ArticleMdBlur();
    WeightBlur();
    InstructionsBlur();
    MadeInBlur();
    if (
      !prod_id ||
      dayBeforeExpiryError ||
      weightError ||
      descriptionError ||
      articleMdError ||
      instructionsError ||
      madeInError ||
      !dayBeforeExpiry ||
      !weight ||
      !description ||
      !articleMd ||
      !instructions ||
      !madeIn
    ) {
      console.error("Invalid input data");
      return;
    } else {
      try {
        const response = await ProductService.updateProductInfo(prod_id, productInfo);
        console.log("Update infos successful", response);
        setUpdateInfomationSuccess("Infor of ingredients updated successfully.");
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
    } else if (price < 1) {
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
    } else if (sale_percent < 1) {
      setSaleError("Please enter a sale persent greater than 1");
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
    } else if (dayBeforeExpiry < 1) {
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

  const ArticleMdChange = (e) => {
    const { value } = e.target;
    setArticleMd(value);
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
                  Edit Ingredient
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
                    <p style={{ fontSize: "0.8em" }}>
                      INGREDIENT NAME: <strong>{product.product_name}</strong>
                    </p>
                    <div>
                      <p
                        style={{
                          fontWeight: "700",
                          fontSize: "0.6em",
                          marginTop: "15px",
                          marginBottom: "-5px",
                        }}
                      >
                        UPDATE QUANTITY
                      </p>
                      {/* Quantity */}
                      <TextField
                        fullWidth
                        type="number"
                        value={quantity || ""}
                        onChange={QuantityChange}
                        onBlur={QuantityBlur}
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
                        label="Price"
                        type="number"
                        value={price}
                        onChange={PriceChange}
                        onBlur={PriceBlur}
                        margin="normal"
                      />
                      {priceError && (
                        <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                          {priceError}
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
                    </div>

                    <p
                      style={{
                        fontWeight: "700",
                        fontSize: "0.6em",
                        marginTop: "40px",
                        marginBottom: "-5px",
                      }}
                    >
                      UPDATE PRICE AND SALE PERCENT
                    </p>

                    <TextField
                      fullWidth
                      label="Price"
                      type="number"
                      value={price}
                      onChange={PriceChange}
                      onBlur={PriceBlur}
                      margin="normal"
                    />
                    {priceError && (
                      <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                        {priceError}
                      </p>
                    )}

                    <TextField
                      fullWidth
                      label="Sale Percent"
                      type="number"
                      value={sale_percent}
                      onChange={SalePersentChange}
                      onBlur={SalePersentBlur}
                      margin="normal"
                    />
                    {saleError && (
                      <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                        {saleError}
                      </p>
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

                    <p
                      style={{
                        fontWeight: "700",
                        fontSize: "0.6em",
                        marginTop: "40px",
                        marginBottom: "-5px",
                      }}
                    >
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
                      label="Production Date"
                      value={
                        product.price_list && product.price_list[0]?.date
                          ? new Date(product.price_list[0]?.date).toLocaleString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/A"
                      }
                      margin="normal"
                      InputProps={{
                        readOnly: true,
                      }}
                    />

                    <TextField
                      fullWidth
                      type="number"
                      label="Day before expiry"
                      value={dayBeforeExpiry || ""}
                      onChange={DayBeforeExpiryChange}
                      onBlur={DayBeforeExpiryBlur}
                      margin="normal"
                    />
                    {dayBeforeExpiryError && (
                      <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                        {dayBeforeExpiryError}
                      </p>
                    )}

                    <TextField
                      fullWidth
                      type="text"
                      label="Article"
                      value={articleMd || ""}
                      onChange={ArticleMdChange}
                      onBlur={ArticleMdBlur}
                      margin="normal"
                    />
                    {articleMdError && (
                      <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                        {articleMdError}
                      </p>
                    )}

                    <TextField
                      fullWidth
                      type="number"
                      label="Weight (gam)"
                      value={weight || ""}
                      onChange={WeightChange}
                      onBlur={WeightBlur}
                      margin="normal"
                      inputProps={{ min: 0 }}
                    />
                    {weightError && (
                      <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                        {weightError}
                      </p>
                    )}

                    <TextField
                      fullWidth
                      type="text"
                      label="Storage instructions"
                      value={instructions || ""}
                      onChange={InstructionsChange}
                      onBlur={InstructionsBlur}
                      margin="normal"
                    />
                    {instructionsError && (
                      <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                        {instructionsError}
                      </p>
                    )}

                    <TextField
                      fullWidth
                      type="text"
                      label="Made in"
                      value={madeIn || ""}
                      onChange={MadeInChange}
                      onBlur={MadeInBlur}
                      margin="normal"
                    />
                    {madeInError && (
                      <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                        {madeInError}
                      </p>
                    )}
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
                    <hr style={{ marginTop: "40px" }} />

                    <p
                      style={{
                        fontWeight: "700",
                        fontSize: "0.6em",
                        marginTop: "40px",
                        marginBottom: "-5px",
                      }}
                    >
                      UPDATE STATUS
                    </p>
                    {/* Product Status */}
                    <Grid item xs={12}>
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
                      <hr style={{ marginTop: "40px" }} />
                    </Grid>
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

export default EditProduct;
