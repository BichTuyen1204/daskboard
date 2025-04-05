import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import {
  Grid,
  TextField,
  Button,
  Icon,
  IconButton,
  Modal,
  Box,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  FormLabel,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Link, useNavigate, useParams } from "react-router-dom";
import BlogService from "api/BlogService";
import MDEditor from "@uiw/react-md-editor";

function EditBlog() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [markdownText, setMarkdownText] = useState("");
  const [markdownTextError, setMarkdownTextError] = useState("");
  const [serves, setServes] = useState("");
  const [servesError, setServesError] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [cookTimeError, setCookTimeError] = useState("");
  const [tags, setTags] = useState("");
  const [tagsError, setTagsError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [mainImageError, setMainImageError] = useState("");
  const [zoom, setZoom] = useState(1);
  const [infoRows, setInfoRows] = useState([{ key: "", value: "" }]);

  // Ensure user is authenticated
  useEffect(() => {
    if (!jwtToken) navigate("/sign-in", { replace: true });
  }, [navigate, jwtToken]);

  const [blog, setBlog] = useState({
    title: "",
    description: "",
    markdown_text: "",
    infos: {},
  });

  const getBlogDetail = async () => {
    try {
      const response = await BlogService.getBlogDetail(id);
      setBlog(response);
      setTitle(response.title);
      setDescription(response.description);
      setMarkdownText(response.article);
      setTags(response.infos?.tags);
      setServes(response.infos?.serves);
      setCookTime(response.infos?.cook_time);

      // Dynamically load additional info rows from JSON
      const additionalInfoRows = Object.entries(response.infos || {}).map(([key, value]) => ({
        key,
        value,
      }));
      setInfoRows(additionalInfoRows);

      // Load thumbnail from JSON response
      if (response.thumbnail) {
        setMainImagePreview(response.thumbnail); // Set the thumbnail preview
      } else {
        setMainImagePreview(""); // Fallback if no image URL is provided
      }

      setBlog({
        title: response.title || "",
        description: response.description || "",
        markdown_text: response.article || "",
        infos: response.infos || {},
      });
    } catch (error) {
      console.error("Can't access the server", error);
    }
  };

  useEffect(() => {
    getBlogDetail(id);
  }, [id]);

  const updateField = (field, value) => {
    setBlog((prevState) => ({
      ...prevState,
      [field]: value !== undefined && value !== null ? value : prevState[field],
    }));
  };

  const updateInfoField = (field, value) => {
    setBlog((prevState) => ({
      ...prevState,
      infos: {
        ...prevState.infos,
        [field]: value !== undefined && value !== null ? value : prevState.infos[field],
      },
    }));
  };

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

  // Add synchronization function to update blog.infos from infoRows
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

  // Add blur handlers for key and value fields
  const handleKeyBlur = () => {
    synchronizeInfosWithRows();
  };

  const handleValueBlur = () => {
    synchronizeInfosWithRows();
  };

  const addInfoRow = () => {
    setInfoRows((prev) => [...prev, { key: "", value: "" }]);
  };

  const TitleChange = (e) => {
    const { value } = e.target;
    setTitle(value);
    updateField("title", value);
    setSuccessMessage(false);
  };

  const TitleBlur = (e) => {
    if (title === "") {
      setTitleError("Please input the title");
    } else {
      setTitleError("");
    }
  };

  const DescriptionChange = (e) => {
    const { value } = e.target;
    setDescription(value);
    updateField("description", value);
    setSuccessMessage(false);
  };

  const DescriptionBlur = (e) => {
    if (description === "") {
      setDescriptionError("Please input the description");
    } else {
      setDescriptionError("");
    }
  };

  const MarkdownChange = (e) => {
    const { value } = e.target;
    setMarkdownText(value);
    updateField("markdown_text", value);
    setSuccessMessage(false);
  };

  const MarkdownBlur = (e) => {
    if (markdownText === "") {
      setMarkdownTextError("Please input the markdown text");
    } else {
      setMarkdownTextError("");
    }
  };

  const UpdateBlog = async (e) => {
    e.preventDefault();
    TitleBlur();
    DescriptionBlur();
    MarkdownBlur();
    if (
      !id ||
      titleError ||
      descriptionError ||
      markdownTextError ||
      !title ||
      !description ||
      !markdownText
    ) {
      return;
    } else {
      const formData = new FormData();
      formData.append("main_image", mainImage);
      formData.append("blog_info", JSON.stringify(blog));
      try {
        console.log(formData);
        await BlogService.updateBlog(id, blog);
        setSuccessMessage("Blog updated successfully!");
        setErrorMessage("");
      } catch (error) {
        console.error("API Error:", error.response || error.message);
        const errorMsg = error.response
          ? error.response.data.message || error.response.statusText
          : error.message;
        setErrorMessage(errorMsg || "An error occurred while updating the blog.");
        setSuccessMessage("");
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
                  Edit Blog
                </MDTypography>
              </MDBox>

              {/* Content */}
              <MDBox p={3}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={5}>
                    <Link to="/blog">
                      <Icon sx={{ cursor: "pointer", "&:hover": { color: "gray" } }}>
                        arrow_back
                      </Icon>
                    </Link>

                    <MDBox>
                      {/* Thumbnail */}
                      <MDTypography variant="h6" mb={2}>
                        Thumbnail
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
                            alt="Thumbnail Preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          <MDTypography variant="body2" color="textSecondary" textAlign="center">
                            No Thumbnail Available
                          </MDTypography>
                        )}
                      </MDBox>
                    </MDBox>

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
                        onChange={TitleChange}
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
                        onChange={DescriptionChange}
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
                            onChange={(value) => MarkdownChange({ target: { value } })}
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
                          onClick={UpdateBlog}
                          style={{ backgroundColor: "green", color: "white" }}
                        >
                          Update Blog
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

export default EditBlog;
