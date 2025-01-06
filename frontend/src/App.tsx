import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/SignUp';
import { UserRead } from './types/User';
import Me from './pages/Me';
import { useEffect, useState } from 'react';
import { meApi } from './api/me';
import MyArticles from './pages/MyArticles';
import ArticleDetail from './pages/ArticleDetail';
import CreateArticle from './pages/CreateArticle';
import UserProfile from './pages/UserProfile';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [currentUser, setCurrentUser] = useState<UserRead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndSetUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setCurrentUser(null);
          setLoading(false);
          return;
        }

        const user = await meApi.getMe();
        setCurrentUser(user);
      } catch (error) {
        localStorage.removeItem('token');
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route 
          path='/me' 
          element={
            <ProtectedRoute>
              <Me />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-articles" 
          element={
            <ProtectedRoute>
              <MyArticles />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/articles/:id" 
          element={
            <ProtectedRoute>
              <ArticleDetail />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/create-article" 
          element={
            <ProtectedRoute>
              <CreateArticle />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/users/:id" 
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
