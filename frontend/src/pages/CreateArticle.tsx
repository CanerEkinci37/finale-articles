import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { ArticleCreate } from "../types/Article";
import { articlesApi } from "../api/articles";
import Navbar from "../components/Navbar";

const CreateArticle = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [articleData, setArticleData] = useState<ArticleCreate>({
    title: "",
    content: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await articlesApi.createArticle(articleData);
      navigate("/");
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || "Failed to create article";
      setError(typeof errorMessage === "string" 
        ? errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1) 
        : errorMessage[0].loc[1].charAt(0).toUpperCase() + errorMessage[0].loc[1].slice(1) + ' ' + errorMessage[0].msg);
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Create New Article
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Title"
              value={articleData.title}
              onChange={(e) =>
                setArticleData({ ...articleData, title: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Content"
              value={articleData.content}
              onChange={(e) =>
                setArticleData({ ...articleData, content: e.target.value })
              }
              margin="normal"
              required
              multiline
              rows={8}
            />
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" type="submit" sx={{ mr: 1 }}>
                Create
              </Button>
              <Button variant="outlined" onClick={() => navigate("/")}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default CreateArticle; 