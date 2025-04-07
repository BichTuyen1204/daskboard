import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import { Grid, TextField, Button, Icon, Box, Typography } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Link, useNavigate, useParams } from "react-router-dom";
import BlogService from "api/BlogService";

function ViewBlog() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [blog, setBlog] = useState("");
  const jwtToken = sessionStorage.getItem("jwtToken");

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      navigate("/sign-in", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const getBlogDetail = async () => {
      if (jwtToken) {
        try {
          const response = await BlogService.getBlogDetail(id);
          setBlog(response);
        } catch (error) {}
      }
    };
    getBlogDetail();
  }, [id, jwtToken]);

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
                  View Blog Detail
                </MDTypography>
              </MDBox>

              {/* Content */}
              <MDBox p={3}>
                <Grid container spacing={3}>
                  {/* Right Section: Product Info */}
                  <Grid item xs={12} md={12}>
                    <Link to="/blog">
                      <Icon sx={{ cursor: "pointer", "&:hover": { color: "gray" } }}>
                        arrow_back
                      </Icon>
                    </Link>
                    <form>
                      {/* Article */}
                      <TextField
                        fullWidth
                        label="Article"
                        type="text"
                        value={blog.article || ""}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />

                      {/* Title */}
                      <TextField
                        fullWidth
                        label="Title"
                        type="text"
                        value={blog.title || ""}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />

                      {/* Description */}
                      <Box
                        sx={{
                          border: "1px solid #e0e0e0",
                          marginTop: "15px",
                          borderRadius: "12px",
                          padding: 2,
                          backgroundColor: "#fff",
                          maxHeight: 300,
                          overflowY: "auto",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 600, color: "#444", fontSize: "0.8em" }}
                          >
                            Description
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            color: "#333",
                            fontSize: "1rem",
                            whiteSpace: "pre-wrap",
                            fontSize: "0.65em",
                          }}
                          dangerouslySetInnerHTML={{ __html: blog?.description || "" }}
                        />
                      </Box>

                      <Box>
                        {Object.entries(blog?.infos || {}).map(([key, value]) => (
                          <TextField
                            key={key}
                            fullWidth
                            label={key}
                            value={value}
                            margin="normal"
                            InputProps={{ readOnly: true }}
                            sx={{ marginBottom: 1 }}
                          />
                        ))}
                      </Box>
                      <div>
                        <p style={{ fontSize: "0.7em", marginTop: "15px" }}>
                          <strong>Image:</strong>
                        </p>
                        <div
                          style={{
                            width: "200px",
                            height: "200px",
                            marginTop: "-10px",
                            padding: "5px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <img
                            style={{
                              width: "90%",
                              height: "auto",
                              objectFit: "cover",
                              borderRadius: "15px",
                            }}
                            src={blog.thumbnail}
                          />
                        </div>
                      </div>
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

export default ViewBlog;
