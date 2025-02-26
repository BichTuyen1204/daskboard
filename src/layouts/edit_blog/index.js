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

  // Ensure user is authenticated
  useEffect(() => {
    if (!jwtToken) navigate("/sign-in", { replace: true });
  }, [navigate, jwtToken]);

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

      setBlog({
        title: response.title || "",
        description: response.description || "",
        markdown_text: response.article || "",
        infos: {
          serves: response.infos?.serves || "",
          cook_time: response.infos?.cook_time || "",
          tags: response.infos?.tags || "",
        },
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

  const ServesChange = (e) => {
    const { value } = e.target;
    setServes(value);
    updateInfoField("serves", value);
    setSuccessMessage(false);
  };

  const ServesBlur = (e) => {
    if (serves === "") {
      setServesError("Please input the serves");
    } else if (serves < 1) {
      setServesError("Please input the cook time greater than 0");
    } else {
      setServesError("");
    }
  };

  const CookTimeChange = (e) => {
    const { value } = e.target;
    setCookTime(value);
    updateInfoField("cook_time", value);
    setSuccessMessage(false);
  };

  const CookTimeBlur = (e) => {
    if (cookTime === "") {
      setCookTimeError("Please input the cook time");
    } else if (cookTime < 1) {
      setCookTimeError("Please input the cook time greater than 0");
    } else {
      setCookTimeError("");
    }
  };

  const TagsChange = (e) => {
    const { value } = e.target;
    setTags(value);
    updateInfoField("tags", value);
    setSuccessMessage(false);
  };

  const TagsBlur = (e) => {
    if (tags === "") {
      setTagsError("Please input the tags");
    } else {
      setTagsError("");
    }
  };

  const UpdateBlog = async (e) => {
    e.preventDefault();
    TitleBlur();
    DescriptionBlur();
    MarkdownBlur();
    ServesBlur();
    CookTimeBlur();
    TagsBlur();
    if (
      !id ||
      titleError ||
      descriptionError ||
      markdownTextError ||
      servesError ||
      cookTimeError ||
      tagsError ||
      !title ||
      !description ||
      !markdownText ||
      !serves ||
      !cookTime ||
      !tags
    ) {
      return;
    } else {
      try {
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
                        onChange={TitleChange}
                        onBlur={TitleBlur}
                      />
                      {titleError && (
                        <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                          {titleError}
                        </p>
                      )}

                      {/* Description */}
                      <TextField
                        fullWidth
                        label="Description"
                        type="text"
                        value={blog.description || ""}
                        margin="normal"
                        onChange={DescriptionChange}
                        onBlur={DescriptionBlur}
                      />
                      {descriptionError && (
                        <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                          {descriptionError}
                        </p>
                      )}

                      {/* Markdown Text */}
                      <TextField
                        fullWidth
                        label="Markdown Text"
                        type="text"
                        value={blog.markdown_text || ""}
                        margin="normal"
                        onChange={MarkdownChange}
                        onBlur={MarkdownBlur}
                      />
                      {markdownTextError && (
                        <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                          {markdownTextError}
                        </p>
                      )}

                      {/* Serves */}
                      <TextField
                        fullWidth
                        label="Serves"
                        type="number"
                        value={blog.infos?.serves || ""}
                        margin="normal"
                        onChange={ServesChange}
                        onBlur={ServesBlur}
                      />
                      {servesError && (
                        <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                          {servesError}
                        </p>
                      )}

                      {/* Cook Time */}
                      <TextField
                        fullWidth
                        label="Cook Time (minutes)"
                        type="number"
                        value={blog.infos?.cook_time || ""}
                        margin="normal"
                        onChange={CookTimeChange}
                        onBlur={CookTimeBlur}
                      />
                      {cookTimeError && (
                        <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                          {cookTimeError}
                        </p>
                      )}

                      {/* Tags */}
                      <TextField
                        fullWidth
                        label="Tags"
                        type="text"
                        value={blog.infos?.tags || ""}
                        margin="normal"
                        onChange={TagsChange}
                        onBlur={TagsBlur}
                      />
                      {tagsError && (
                        <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                          {tagsError}
                        </p>
                      )}
                      {/* Messages */}
                      {errorMessage && (
                        <p style={{ color: "red", fontSize: "0.6em", marginLeft: "5px" }}>
                          {errorMessage}
                        </p>
                      )}
                      {successMessage && (
                        <p
                          style={{
                            color: "green",
                            fontSize: "0.6em",
                            fontWeight: "600",
                            marginLeft: "5px",
                            marginBottom: "5px",
                          }}
                        >
                          {successMessage}
                        </p>
                      )}
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={UpdateBlog}
                        sx={{ mt: 2 }}
                        style={{ color: "white" }}
                      >
                        Update Blog
                      </Button>
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
