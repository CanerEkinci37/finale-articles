import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import ArticleIcon from "@mui/icons-material/Article";
import AddIcon from "@mui/icons-material/Add";
import { UserRead } from "../types/User";
import { meApi } from "../api/me";

export default function Navbar() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserRead | null>(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchAndSetUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setCurrentUser(null);
          return;
        }
        const user = await meApi.getMe();
        setCurrentUser(user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    navigate("/login");
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Create Article', icon: <AddIcon />, path: '/create-article' },
    { text: 'My Articles', icon: <ArticleIcon />, path: '/my-articles' },
  ];

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && 
        ((event as React.KeyboardEvent).key === 'Tab' || 
         (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
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
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Button
            color="inherit"
            onClick={() => navigate("/")}
            sx={{ mr: 'auto' }}
          >
            Articles API
          </Button>

          {!loading && (
            <>
              {currentUser ? (
                <>
                  <Typography sx={{ mr: 2 }}>
                    Welcome, {currentUser.username}
                  </Typography>
                  <Button
                    color="inherit"
                    onClick={() => navigate("/me")}
                    sx={{ mr: 1 }}
                  >
                    Profile
                  </Button>
                  <Button color="inherit" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    color="inherit"
                    onClick={() => navigate("/login")}
                    sx={{ mr: 1 }}
                  >
                    Login
                  </Button>
                  <Button color="inherit" onClick={() => navigate("/signup")}>
                    Register
                  </Button>
                </>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 250,
            marginTop: '64px',
            height: 'calc(100% - 64px)',
            position: 'absolute',
            bgcolor: 'grey.100',
            borderRight: '1px solid',
            borderColor: 'grey.300',
          },
        }}
        variant="temporary"
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Box
          sx={{ 
            width: 250,
            bgcolor: 'grey.100',
          }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {menuItems.map((item) => (
              <Button 
                key={item.text}
                fullWidth
                onClick={() => {
                  navigate(item.path);
                  setDrawerOpen(false);
                }}
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  padding: 0,
                  '&:hover': {
                    bgcolor: 'grey.200',
                  },
                }}
              >
                <ListItem>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    sx={{
                      color: 'grey.800',
                    }} 
                  />
                </ListItem>
              </Button>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
