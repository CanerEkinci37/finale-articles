import { useEffect, useState } from "react";
import { Container, Typography } from "@mui/material";
import { ArticleRead } from "../types/Article";
import { articlesApi } from "../api/articles";
import ArticleList from "../components/ArticleList";
import Navbar from "../components/Navbar";
import { meApi } from "../api/me";

const MyArticles = () => {
  const [articles, setArticles] = useState<ArticleRead[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUserArticles = async () => {
    try {
      const user = await meApi.getMe();
      if (user.id) {
        const articles = await articlesApi.getArticlesByAuthorId(user?.id); 
        setArticles(articles);
      }
    } catch (error) {
      console.error('Failed to fetch my articles:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCurrentUserArticles();
  }, []);

  console.log(articles)

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Articles
        </Typography>
        <ArticleList articles={articles} loading={loading} />
      </Container>
    </>
  );
};

export default MyArticles;
