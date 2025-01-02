import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  CircularProgress,
  Alert,
  Grid,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import { UserRead } from "../types/User";
import { ArticleRead } from "../types/Article";
import { articlesApi } from "../api/articles";
import ArticleList from "../components/ArticleList";
import Navbar from "../components/Navbar";
import { usersApi } from "../api/users";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArticleIcon from "@mui/icons-material/Article";

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserRead | null>(null);
  const [articles, setArticles] = useState<ArticleRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndArticles = async () => {
      try {
        const userData = await usersApi.getUserById(id!);
        setUser(userData);
        const userArticles = await articlesApi.getArticlesByAuthorId(
          userData.id
        );
        setArticles(userArticles);
      } catch (err) {
        console.error("Error in fetchUserAndArticles:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch user profile"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserAndArticles();
    } else {
      setLoading(false);
    }
  }, [id]);

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

  if (!user) {
    return <Typography>User not found</Typography>;
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {/* Sol Taraf - Kullanıcı Bilgileri */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    margin: "0 auto",
                    bgcolor: "primary.main",
                    fontSize: "3rem",
                  }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h5" sx={{ mt: 2 }}>
                  {user.username}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <EmailIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography>{user.email}</Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <CalendarTodayIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography>
                    Joined:{" "}
                    {new Date(user.created_at).toLocaleDateString("tr-TR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <ArticleIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography>Total Articles: {articles.length}</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Sağ Taraf - Makaleler */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                <ArticleIcon sx={{ mr: 1 }} />
                Articles by {user.username}
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {articles.length === 0 ? (
                <Card sx={{ bgcolor: "grey.100" }}>
                  <CardContent>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      align="center"
                    >
                      No articles found
                    </Typography>
                  </CardContent>
                </Card>
              ) : (
                <ArticleList articles={articles} loading={false} />
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default UserProfile;
