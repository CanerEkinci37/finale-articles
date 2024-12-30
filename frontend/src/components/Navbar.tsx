import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useAppDispatch, useAppSelector } from '../hooks/appSelector';
import { logout } from '../redux/authSlice';
import { meApi } from '../api/me';
import { UserRead } from '../types/User';

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [currentUser, setCurrentUser] = useState<UserRead | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (isAuthenticated) {
        try {
          const user = await meApi.getMe();
          setCurrentUser(user);
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      } else {
        setCurrentUser(null);
      }
    };

    fetchUser();
  }, [isAuthenticated]);

  const handleLogout = () => {
    setCurrentUser(null);
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Articles API
          </Typography>
          {isAuthenticated ? (
            <>
              <Typography sx={{ mr: 2 }}>
                Welcome, {currentUser?.username}
              </Typography>
              <Button color="inherit" onClick={() => navigate('/me')}>
                Profile
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate('/register')}>
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
