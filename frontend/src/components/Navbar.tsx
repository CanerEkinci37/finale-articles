import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { UserRead } from "../types/User";
import { meApi } from "../api/me";

export default function Navbar() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserRead | null>(null);
  const [loading, setLoading] = useState(true);

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
    </Box>
  );
}
