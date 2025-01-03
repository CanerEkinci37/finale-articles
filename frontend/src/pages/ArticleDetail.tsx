import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { ArticleRead, ArticleUpdate } from "../types/Article";
import { articlesApi } from "../api/articles";
import { meApi } from "../api/me";
import { UserRead } from "../types/User";
import Navbar from "../components/Navbar";

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<ArticleRead | null>(null);
  const [currentUser, setCurrentUser] = useState<UserRead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editData, setEditData] = useState<ArticleUpdate>({
    title: "",
    content: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [articleData, userData] = await Promise.all([
          articlesApi.getArticleById(id!),
          meApi.getMe(),
        ]);
        setArticle(articleData);
        setCurrentUser(userData);
        setEditData({
          title: articleData.title,
          content: articleData.content,
        });
      } catch (err) {
        setError("Failed to fetch article details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

console.log(article)

  const handleUpdate = async () => {
    try {
      if (!id) return;
      const updatedArticle = await articlesApi.updateArticle(id, editData);
      setArticle(updatedArticle);
      setEditMode(false);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || "Failed to update article";
      setError(typeof errorMessage === "string" 
        ? errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1) 
        : errorMessage[0].loc[1].charAt(0).toUpperCase() + errorMessage[0].loc[1].slice(1) + ' ' + errorMessage[0].msg);
    }
  };

  const handleDelete = async () => {
    try {
      if (!id) return;
      await articlesApi.deleteArticle(id);
      navigate("/");
    } catch (err) {
      setError("Failed to delete article");
      console.error(err);
    }
  };

  const isEdited = (article: ArticleRead) => {
    return (
      new Date(article.updated_at).getTime() >
      new Date(article.created_at).getTime()
    );
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!article) {
    return <Typography>Article not found</Typography>;
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {editMode ? (
            <Box
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate();
              }}
            >
              <TextField
                fullWidth
                label="Title"
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Content"
                value={editData.content}
                onChange={(e) =>
                  setEditData({ ...editData, content: e.target.value })
                }
                margin="normal"
                required
                multiline
                rows={6}
              />
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" type="submit" sx={{ mr: 1 }}>
                  Save
                </Button>
                <Button variant="outlined" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
              </Box>
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h4" component="h1">
                  {article.title}
                </Typography>
                {isEdited(article) && (
                  <Chip
                    icon={<EditIcon />}
                    label="Edited"
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Box>

              <Typography variant="body1" sx={{ mb: 4 }}>
                {article.content}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Author: {article.author.username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(article.created_at).toLocaleDateString("tr-TR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </Box>

              {currentUser?.id === article.author.id && (
                <Box sx={{ mt: 3, display: "flex", gap: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => setEditMode(true)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => setDeleteDialog(true)}
                  >
                    Delete
                  </Button>
                </Box>
              )}
            </>
          )}
        </Paper>

        <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
          <DialogTitle>Delete Article</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this article?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
            <Button onClick={handleDelete} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default ArticleDetail;
