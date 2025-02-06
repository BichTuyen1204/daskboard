import { useState } from "react";
import Card from "@mui/material/Card";
import { Grid, TextField, Button, Icon, MenuItem } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Link } from "react-router-dom";
import CouponService from "api/CouponService";
import BlogService from "api/BlogService";

function AddBlog() {
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [mainImageError, setMainImageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [markdownTextError, setMarkdownTextError] = useState("");
  const [servesError, setServesError] = useState("");
  const [tagsError, setTagsError] = useState("");
  const [cookTimeError, setCookTimeError] = useState("");
  const [blog, setBlog] = useState({
    title: "",
    description: "",
    markdown_text: "",
    infos: {
      serves: "",
      cook_time: "",
      tags: "",
    },
  });

  const handleChange = (field, value) => {
    setBlog((prev) => ({
      ...prev,
      [field]: value,
    }));
    switch (field) {
      case "title":
        if (!value.trim()) {
          setTitleError("Title is required.");
        } else {
          setTitleError("");
        }
        break;
      case "description":
        if (!value.trim()) {
          setDescriptionError("Description is required.");
        } else {
          setDescriptionError("");
        }
        break;
      case "markdown_text":
        if (!value.trim()) {
          setMarkdownTextError("Markdown text is required.");
        } else {
          setMarkdownTextError("");
        }
        break;
      default:
        break;
    }
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleNestedChange = (field, nestedField, value) => {
    setBlog((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [nestedField]: value,
      },
    }));
    if (field === "infos") {
      switch (nestedField) {
        case "serves":
          if (!value.trim()) {
            setServesError("Serves is required.");
          } else {
            setServesError("");
          }
          break;
        case "cook_time":
          if (!value.trim()) {
            setCookTimeError("Cook time is required.");
          } else {
            setCookTimeError("");
          }
          break;
        case "tags":
          if (!value.trim()) {
            setTagsError("Tags are required.");
          } else {
            setTagsError("");
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
    if (file) {
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
      setMainImageError("");
      setErrorMessage("");
      setSuccessMessage("");
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("main_image", mainImage);
    formData.append("blog_info", JSON.stringify(blog));
    try {
      const response = await BlogService.addBlog(formData);
      console.log("API Response:", response);
      setSuccessMessage("Blog added successfully!");
    } catch (error) {
      console.error("API Error:", error.response || error.message);
      const errorMsg = error.response
        ? error.response.data.message || error.response.statusText
        : error.message;
      setErrorMessage("Blog was not added. Check the server response.");
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
                    </MDBox>
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

                      <TextField
                        fullWidth
                        label="Markdown text"
                        value={blog.markdown_text}
                        onChange={(e) => handleChange("markdown_text", e.target.value)}
                        margin="normal"
                        sx={{ height: "45px", ".MuiInputBase-root": { height: "45px" } }}
                      />
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

                      <TextField
                        fullWidth
                        type="text"
                        label="Serves"
                        value={blog.infos.serves}
                        onChange={(e) => handleNestedChange("infos", "serves", e.target.value)}
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
                        {servesError}
                      </p>

                      <TextField
                        fullWidth
                        type="text"
                        label="Cook time"
                        value={blog.infos.cook_time}
                        onChange={(e) => handleNestedChange("infos", "cook_time", e.target.value)}
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
                        {cookTimeError}
                      </p>

                      <TextField
                        fullWidth
                        label="Tags"
                        value={blog.infos.tags}
                        onChange={(e) => handleNestedChange("infos", "tags", e.target.value)}
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
                        {tagsError}
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
