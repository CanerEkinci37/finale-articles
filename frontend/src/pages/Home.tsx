import { useEffect, useState } from "react";
import { articlesApi } from "../api/articles";
import ArticleList from "../components/ArticleList";
import Navbar from "../components/Navbar";
import { ArticleRead } from "../types/Article";
import { Container, Typography } from "@mui/material";

const Home = () => {
  const [articles, setArticles] = useState<ArticleRead[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const articles = await articlesApi.getArticles();
      setArticles(articles);
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Articles
        </Typography>
        <ArticleList articles={articles} loading={loading}/>
      </Container>
    </div>
  );
};

export default Home;
