import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import DeleteIcon from "@mui/icons-material/Delete";
import ReactDOM from "react-dom";

import { deepPurple } from "@mui/material/colors";
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
  CircularProgress,
  Button,
  Avatar,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDEditor from "@uiw/react-md-editor";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Link, useNavigate, useParams } from "react-router-dom";
import BlogService from "api/BlogService";
import ReactMarkdown from "react-markdown";
import AccountService from "api/AccountService";

function ViewBlog() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [blog, setBlog] = useState("");
  const [comments, setComments] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [size] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popupDelete, setPopupDelete] = useState(false);
  const [popupDeleteSuccess, setPopupDeleteSuccess] = useState(false);
  const jwtToken = sessionStorage.getItem("jwtToken");

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      navigate("/sign-in", { replace: true });
    }
  }, [navigate]);

  const openDelete = (id) => {
    setSelectedId(id);
    setPopupDelete(true);
  };

  const closerDelete = () => {
    setPopupDelete(false);
  };

  const deleteComment = async (id) => {
    if (!jwtToken) return;
    try {
      await BlogService.deleteComment(id);
      setPopupDelete(false);
      setPopupDeleteSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {}
  };

  const buildCommentTree = (comments) => {
    const map = {};
    const roots = [];
    const filteredComments = comments.filter((c) => c.status !== "DELETED");
    filteredComments.forEach((comment) => {
      comment.children = [];
      map[comment.id] = comment;
    });
    filteredComments.forEach((comment) => {
      if (comment.parent_comment) {
        const parent = map[comment.parent_comment];
        if (parent) {
          parent.children.push(comment);
        }
      } else {
        roots.push(comment);
      }
    });

    return roots;
  };

  const renderComment = (comment, level = 0) => (
    <Box key={comment.id} ml={level * 4} mt={2} display="flex" gap={2}>
      <Avatar sx={{ bgcolor: "#1976d2", width: 32, height: 32 }}>
        {comment.account_id?.charAt(0).toUpperCase()}
      </Avatar>
      <Box
        p={1.5}
        sx={{
          backgroundColor: "#f0f2f5",
          borderRadius: 2,
          width: "100%",
          position: "relative",
        }}
      >
        <DeleteIcon
          sx={{
            marginTop: "15px",
            position: "absolute",
            top: 8,
            right: 8,
            color: "red",
            cursor: "pointer",
            "&:hover": {
              color: "#d32f2f",
            },
          }}
          onClick={() => {
            openDelete(comment.id);
          }}
        />

        <Typography style={{ fontSize: "0.8em", color: "black", fontWeight: "500" }}>
          {comment.username}
        </Typography>
        <Typography style={{ fontSize: "0.65em", color: "black" }}>{comment.comment}</Typography>

        {comment.children.length > 0 &&
          comment.children.map((child) => renderComment(child, level + 1))}
      </Box>
    </Box>
  );

  const structuredComments = buildCommentTree(comments);

  // Call commennt + change id to username
  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await BlogService.getAllComment(id, pageIndex, size);
      const commentList = data.content || [];
      const updatedComments = await Promise.all(
        commentList.map(async (comment) => {
          try {
            const userData = await AccountService.getCustomerDetail(comment.account_id);
            return { ...comment, username: userData.username };
          } catch (error) {
            return { ...comment, username: comment.account_id };
          }
        })
      );

      setComments(updatedComments);
    } catch (error) {
      setError("Failed to load comments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id, pageIndex, size]);

  // Call Blog
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
                {/* Comment Section */}
                <Box
                  mt={5}
                  sx={{ border: "1px solid gray", borderRadius: "15px", padding: "20px" }}
                >
                  <Typography variant="h5" fontWeight="bold" mb={3}>
                    Customer Comments
                  </Typography>

                  {/* Hiển thị các comment */}
                  {loading ? (
                    <Typography variant="body1" style={{ fontSize: "0.7em", color: "black" }}>
                      Loading comments...
                    </Typography>
                  ) : structuredComments.length > 0 ? (
                    structuredComments.map((comment) => renderComment(comment))
                  ) : (
                    <Typography variant="body1" style={{ fontSize: "0.7em", color: "black" }}>
                      No comments yet.
                    </Typography>
                  )}
                </Box>
              </MDBox>

              {/* Popup delete comment */}
              {popupDelete && (
                <>
                  <div
                    style={{
                      position: "fixed",
                      top: "0",
                      left: "0",
                      width: "100vw",
                      height: "100vh",
                      backgroundColor: "rgba(87, 87, 87, 0.2)",
                      backdropFilter: "blur(0.05em)",
                      zIndex: "999",
                    }}
                    onClick={closerDelete}
                  />

                  <div
                    style={{
                      position: "fixed",
                      top: "40%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      backgroundColor: "white",
                      borderRadius: "8px",
                      padding: "15px",
                      width: "85%",
                      maxWidth: "400px",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                      zIndex: "1000",
                      textAlign: "center",
                    }}
                  >
                    <h3
                      style={{
                        marginBottom: "10px",
                        color: "#333",
                        fontWeight: "bold",
                        fontSize: "0.8em",
                      }}
                    >
                      Confirm Delete Comment
                    </h3>
                    <p
                      style={{
                        marginBottom: "20px",
                        color: "#555",
                        fontSize: "0.9em",
                        fontSize: "0.7em",
                      }}
                    >
                      Are you sure you want to delete this comment?
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                      <button
                        onClick={() => deleteComment(selectedId)}
                        style={{
                          flex: 1,
                          padding: "10px",
                          backgroundColor: "#2e7d32",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        Yes
                      </button>
                      <button
                        onClick={closerDelete}
                        style={{
                          flex: 1,
                          padding: "10px",
                          backgroundColor: "#c62828",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        No
                      </button>
                    </div>
                    <Icon
                      onClick={closerDelete}
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        cursor: "pointer",
                        color: "#555",
                      }}
                    >
                      close
                    </Icon>
                  </div>
                </>
              )}

              {/* Popup info delete successful */}
              {popupDeleteSuccess &&
                ReactDOM.createPortal(
                  <>
                    {/* Overlay */}
                    <div
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                        backdropFilter: "blur(2px)",
                        zIndex: 999,
                      }}
                      onClick={closerDelete}
                    />

                    {/* Popup */}
                    <div
                      style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "white",
                        borderRadius: "8px",
                        padding: "20px",
                        width: "90%",
                        maxWidth: "360px",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                        zIndex: 1000,
                        textAlign: "center",
                      }}
                    >
                      {/* SVG Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 52 52"
                        width="55"
                        height="55"
                        style={{
                          marginBottom: "15px",
                          animation: "popIn 0.6s ease",
                          borderRadius: "30px",
                        }}
                      >
                        <circle
                          cx="27"
                          cy="26"
                          r="25"
                          fill="none"
                          stroke="#4caf50"
                          strokeWidth="4"
                        />
                        <path fill="none" stroke="#4caf50" strokeWidth="4" d="M14 26l7 7 15-15" />
                      </svg>

                      {/* Message */}
                      <p
                        style={{
                          color: "green",
                          fontSize: "0.8em",
                          fontWeight: "600",
                          margin: 0,
                        }}
                      >
                        The comment was deleted successfully.
                      </p>
                    </div>

                    {/* Animation keyframes */}
                    <style>
                      {`
                        @keyframes popIn {
                          0% {
                            transform: scale(0);
                            opacity: 0;
                          }
                          100% {
                            transform: scale(1);
                            opacity: 1;
                          }
                        }
                      `}
                    </style>
                  </>,
                  document.body
                )}
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default ViewBlog;
