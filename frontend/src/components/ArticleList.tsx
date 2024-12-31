import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  Box,
  Chip,
  Skeleton,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { articlesApi } from '../api/articles';
import { ArticleRead } from '../types/Article';

const ArticleList = () => {
  const [articles, setArticles] = useState<ArticleRead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const articles = await articlesApi.getAll();
      setArticles(articles);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const isEdited = (article: ArticleRead) => {
    return new Date(article.updated_at).getTime() > new Date(article.created_at).getTime();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {loading
          ? Array.from(new Array(3)).map((_, index) => (
              <Grid item xs={12} key={index}>
                <Card>
                  <CardContent>
                    <Skeleton variant="text" width="40%" height={40} />
                    <Skeleton variant="text" width="100%" height={100} />
                    <Skeleton variant="text" width="20%" />
                  </CardContent>
                </Card>
              </Grid>
            ))
          : articles.map((article) => (
              <Grid item xs={12} key={article.id}>
                <Card 
                  sx={{ 
                    '&:hover': {
                      boxShadow: 6,
                      transition: 'box-shadow 0.3s ease-in-out'
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h5" component="div">
                        {article.title}
                      </Typography>
                      {isEdited(article) && (
                        <Chip
                          icon={<EditIcon />}
                          label="Düzenlendi"
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      )}
                    </Box>
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      sx={{ 
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {article.content}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Yazar: {article.author.username}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(article.created_at).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
      </Grid>
    </Container>
  );
};

export default ArticleList;
