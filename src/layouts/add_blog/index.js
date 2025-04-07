import { useState } from "react";
import Card from "@mui/material/Card";
import {
  Grid,
  TextField,
  Button,
  Icon,
  MenuItem,
  Modal,
  Slider,
  Box,
  IconButton,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  TableHead,
  Table,
  Paper,
  FormControl,
  FormLabel,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Link, useNavigate } from "react-router-dom";
import BlogService from "api/BlogService";
import Cropper from "react-easy-crop";
import getCroppedImg from "utils/cropImage";
import ReactMarkdown from "react-markdown";
import MDEditor from "@uiw/react-md-editor";
import "react-quill/dist/quill.snow.css";

function AddBlog() {
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [mainImageError, setMainImageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [markdownTextError, setMarkdownTextError] = useState("");
  const navigate = useNavigate();
  const [servesError, setServesError] = useState("");
  const [tagsError, setTagsError] = useState("");
  const [cookTimeError, setCookTimeError] = useState("");
  const [blog, setBlog] = useState({
    title: "",
    description: "",
    markdown_text: "",
    infos: {},
  });

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);

  const [infoRows, setInfoRows] = useState([{ key: "", value: "" }]);

  // Modify the handleKeyChange function to stop updating on every keystroke
  const handleKeyChange = (index, key) => {
    const updatedRows = [...infoRows];
    updatedRows[index].key = key;
    setInfoRows(updatedRows);
    // Remove immediate update to blog.infos
  };

  // Modify the handleValueChange function to stop updating on every keystroke
  const handleValueChange = (index, value) => {
    const updatedRows = [...infoRows];
    updatedRows[index].value = value;
    setInfoRows(updatedRows);
    // Remove immediate update to blog.infos
  };

  // Add synchronization function
  const synchronizeInfosWithRows = () => {
    const updatedInfos = {};
    infoRows.forEach((row) => {
      if (row.key && row.key.trim() !== "") {
        updatedInfos[row.key] = row.value;
      }
    });

    setBlog((prev) => ({
      ...prev,
      infos: updatedInfos,
    }));
  };

  const handleRemoveRow = (index) => {
    const updatedRows = infoRows.filter((_, i) => i !== index);
    setInfoRows(updatedRows);

    // Update blog state immediately with the new infos
    const updatedInfos = {};
    updatedRows.forEach((row) => {
      if (row.key && row.key.trim() !== "") {
        updatedInfos[row.key] = row.value;
      }
    });

    setBlog((prev) => ({
      ...prev,
      infos: updatedInfos,
    }));
  };

  // Add blur handlers
  const handleKeyBlur = () => {
    synchronizeInfosWithRows();
  };

  const handleValueBlur = () => {
    synchronizeInfosWithRows();
  };

  const addInfoRow = () => {
    setInfoRows((prev) => [...prev, { key: "", value: "" }]);
  };

  const handleChange = (field, value) => {
    setBlog((prev) => ({
      ...prev,
      [field]: value,
    }));
    switch (field) {
      default:
        break;
    }
    setErrorMessage("");
    setSuccessMessage("");
  };

  const validateForm = () => {
    return true;
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

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropSave = async () => {
    try {
      const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
      setMainImage(croppedImage);
      setMainImagePreview(URL.createObjectURL(croppedImage));
      setCropModalOpen(false);
      setMainImageError("");
    } catch (error) {}
  };

  const handleSubmit = async () => {
    if (!validateForm() || mainImageError) return;
    const formData = new FormData();
    formData.append("main_image", mainImage);
    formData.append("blog_info", JSON.stringify(blog));
    try {
      const response = await BlogService.addBlog(formData);
      setMainImageError(false);
      setSuccessMessage("Blog added successfully!");
      setTimeout(() => {
        navigate(`/view_blog/${response.id}`);
      }, 1500);
    } catch (error) {}
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
                  Add Blog
                </MDTypography>
              </MDBox>

              {/* Content */}
              <MDBox p={3}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={5}>
                    <Link
                      to="/blog"
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
                    </MDBox>

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
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => setCropModalOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="contained"
                            style={{ color: "white", margin: "10px" }}
                            onClick={handleCropSave}
                          >
                            Save
                          </Button>
                        </Box>
                      </Box>
                    </Modal>

                    {/* Additional Info Table */}
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

                  <Grid item xs={12} md={7}>
                    <form>
                      <TextField
                        fullWidth
                        label="Title"
                        value={blog.title}
                        onChange={(e) => handleChange("title", e.target.value)}
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
                        {titleError}
                      </p>

                      <TextField
                        fullWidth
                        label="Content"
                        value={blog.description}
                        onChange={(e) => handleChange("description", e.target.value)}
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
                        {descriptionError}
                      </p>

                      <FormControl fullWidth>
                        <FormLabel style={{ fontSize: "0.7em", marginTop: "15px" }}>
                          Article
                        </FormLabel>
                        <div style={{ marginBottom: "20px" }}>
                          <MDEditor
                            value={blog.markdown_text}
                            onChange={(value) => handleChange("markdown_text", value || "")}
                          />
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
                        {markdownTextError}
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
                          Add Blog
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

export default AddBlog;
