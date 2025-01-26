import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import { Grid, TextField, Button, Icon } from "@mui/material";
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
        } catch (error) {
          console.error("Can't access the server", error);
        }
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
                      {/* ID */}
                      <TextField
                        fullWidth
                        label="ID"
                        value={blog.id || ""}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
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
                      {/* Title */}
                      <TextField
                        fullWidth
                        label="Description"
                        type="text"
                        value={blog.description || ""}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      {/* Serves */}
                      <TextField
                        fullWidth
                        label="Serves"
                        type="text"
                        value={blog.infos?.serves || ""}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      {/* Cook time */}
                      <TextField
                        fullWidth
                        label="Cook time"
                        type="text"
                        value={blog.infos?.cook_time || ""}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      {/* Tag */}
                      <TextField
                        fullWidth
                        label="Tags"
                        type="text"
                        value={blog.infos?.tags || ""}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
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
                            style={{ width: "90%", height: "auto", objectFit: "cover" }}
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
