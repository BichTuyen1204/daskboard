import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import {
  Grid,
  TextField,
  Icon,
  Box,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDEditor from "@uiw/react-md-editor";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Link, useNavigate, useParams } from "react-router-dom";
import BlogService from "api/BlogService";
import ReactMarkdown from "react-markdown";

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
                  {/* Left Column: Image and Additional Info */}
                  <Grid item xs={12} md={5}>
                    <Link to="/blog">
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
                          border: "1px solid #ccc",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "transparent",
                          overflow: "hidden",
                          position: "relative",
                          marginBottom: "16px",
                        }}
                      >
                        {blog.thumbnail ? (
                          <img
                            src={blog.thumbnail}
                            alt="Blog Thumbnail"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          <MDTypography variant="body2" color="textSecondary" textAlign="center">
                            No Image Available
                          </MDTypography>
                        )}
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
                              <TableCell colSpan={2}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  Additional Information
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {blog?.infos && Object.entries(blog.infos).length > 0 ? (
                              Object.entries(blog.infos).map(([key, value]) => (
                                <TableRow key={key}>
                                  <TableCell component="th" scope="row">
                                    <strong>{key}</strong>
                                  </TableCell>
                                  <TableCell>{value}</TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={2} align="center">
                                  No additional information available
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </MDBox>
                  </Grid>

                  {/* Right Column: Blog Content */}
                  <Grid item xs={12} md={7}>
                    <form>
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
                          marginBottom: 2,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600, color: "#444", marginBottom: 1 }}
                        >
                          Description
                        </Typography>

                        <Box
                          sx={{
                            color: "#333",
                            fontSize: "0.9rem",
                            whiteSpace: "pre-wrap",
                          }}
                          dangerouslySetInnerHTML={{ __html: blog?.description || "" }}
                        />
                      </Box>

                      {/* Article */}
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, color: "#444", marginBottom: 1 }}
                      >
                        Article
                      </Typography>
                      <Box
                        sx={{
                          border: "1px solid #e0e0e0",
                          borderRadius: "12px",
                          padding: 2,
                          backgroundColor: "#fff",
                          minHeight: 200,
                          maxHeight: 500,
                          overflowY: "auto",
                        }}
                      >
                        <Box sx={{ padding: 1, "& img": { maxWidth: "100%" } }}>
                          <MDBox mt={2} mb={2}>
                            <Paper elevation={0} style={{ padding: "16px" }}>
                              <MDEditor.Markdown source={blog.article} />
                            </Paper>
                          </MDBox>
                        </Box>
                      </Box>
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
