import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import { Grid, TextField, Button, Icon } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Link, useNavigate, useParams } from "react-router-dom";
import BlogService from "api/BlogService";

function EditBlog() {
  const navigate = useNavigate();
  const { id } = useParams();
  const jwtToken = sessionStorage.getItem("jwtToken");
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [markdownTextError, setMarkdownTextError] = useState("");
  const [servesError, setServesError] = useState("");
  const [cookTimeError, setCookTimeError] = useState("");
  const [tagsError, setTagsError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      navigate("/sign-in", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const getBlogDetail = async () => {
      if (!jwtToken) {
        return;
      } else {
        try {
          const response = await BlogService.getBlogDetail(id);
          setBlog(response);
        } catch (error) {
          console.error("Can't access the server", error);
        }
      }
    };
    getBlogDetail();
  }, [id, jwtToken]);

  const handleChange = (field, value) => {
    setBlog((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Field-specific validation
    switch (field) {
      case "title":
        setTitleError(value.trim() ? "" : "Title is required.");
        break;
      case "description":
        setDescriptionError(value.trim() ? "" : "Description is required.");
        break;
      case "markdown_text":
        setMarkdownTextError(value.trim() ? "" : "Markdown text is required.");
        break;
      default:
        break;
    }
  };

  const handleNestedChange = (field, nestedField, value) => {
    setBlog((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [nestedField]: value,
      },
    }));

    // Nested field-specific validation
    if (field === "infos") {
      switch (nestedField) {
        case "serves":
          setServesError(value.trim() ? "" : "Serves is required.");
          break;
        case "cook_time":
          setCookTimeError(value.trim() ? "" : "Cook time is required.");
          break;
        case "tags":
          setTagsError(value.trim() ? "" : "Tags are required.");
          break;
        default:
          break;
      }
    }
  };

  const UpdateBlog = async () => {
    try {
      const response = await BlogService.updateBlog(id);
      setBlog(response.data);
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
                  <Grid item xs={12} md={12}>
                    <Link to="/blog">
                      <Icon sx={{ cursor: "pointer", "&:hover": { color: "gray" } }}>
                        arrow_back
                      </Icon>
                    </Link>
                    <form>
                      {/* Title */}
                      <TextField
                        fullWidth
                        label="Title"
                        type="text"
                        value={blog.title || ""}
                        margin="normal"
                        onChange={(e) => handleChange("title", e.target.value)}
                        error={!!titleError}
                        helperText={titleError}
                      />
                      {/* Description */}
                      <TextField
                        fullWidth
                        label="Description"
                        type="text"
                        value={blog.description || ""}
                        margin="normal"
                        onChange={(e) => handleChange("description", e.target.value)}
                        error={!!descriptionError}
                        helperText={descriptionError}
                      />
                      {/* Markdown Text */}
                      <TextField
                        fullWidth
                        label="Markdown Text"
                        type="text"
                        value={blog.markdown_text || ""}
                        margin="normal"
                        onChange={(e) => handleChange("markdown_text", e.target.value)}
                        error={!!markdownTextError}
                        helperText={markdownTextError}
                      />
                      {/* Serves */}
                      <TextField
                        fullWidth
                        label="Serves"
                        type="text"
                        value={blog.infos?.serves || ""}
                        margin="normal"
                        onChange={(e) => handleNestedChange("infos", "serves", e.target.value)}
                        error={!!servesError}
                        helperText={servesError}
                      />
                      {/* Cook Time */}
                      <TextField
                        fullWidth
                        label="Cook Time"
                        type="number"
                        value={blog.infos?.cook_time || ""}
                        margin="normal"
                        onChange={(e) => handleNestedChange("infos", "cook_time", e.target.value)}
                        error={!!cookTimeError}
                        helperText={cookTimeError}
                      />
                      {/* Tags */}
                      <TextField
                        fullWidth
                        label="Tags"
                        type="text"
                        value={blog.infos?.tags || ""}
                        margin="normal"
                        onChange={(e) => handleNestedChange("infos", "tags", e.target.value)}
                        error={!!tagsError}
                        helperText={tagsError}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={UpdateBlog}
                        sx={{ mt: 2 }}
                      >
                        Update Blog
                      </Button>
                    </form>
                    {/* Messages */}
                    {errorMessage && (
                      <MDTypography color="error" variant="subtitle2" mt={2}>
                        {errorMessage}
                      </MDTypography>
                    )}
                    {successMessage && (
                      <MDTypography color="success" variant="subtitle2" mt={2}>
                        {successMessage}
                      </MDTypography>
                    )}
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
