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
import { ArticleRead } from '../types/Article';
import { meApi } from '../api/me';
import { UserRead } from '../types/User';
import { useNavigate } from 'react-router-dom';

const ArticleList = ({articles, loading}: {articles: ArticleRead[], loading: boolean}) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserRead | null>(null);

  console.log(currentUser)

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await meApi.getMe();
      setCurrentUser(user);
    };
    fetchCurrentUser();
  }, []);


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
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: 6,
                      transition: 'box-shadow 0.3s ease-in-out'
                    }
                  }}
                  onClick={() => navigate(`/articles/${article.id}`)}
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
                      <Typography 
                        variant="body2" 
                        color="primary"
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/users/${article.author.id}`);
                        }}
                      >
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
