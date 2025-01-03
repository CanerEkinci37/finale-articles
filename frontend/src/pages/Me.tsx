import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Avatar,
  IconButton,
  Alert,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import { meApi } from "../api/me";
import { UserRead, UserUpdate } from "../types/User";
import Navbar from "../components/Navbar";

const Me = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserRead | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userUpdateData, setUserUpdateData] = useState<Partial<UserUpdate>>({
    username: "",
    email: "",
    password: "",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const currentUser = await meApi.getMe();
      setUser(currentUser);
      setUserUpdateData({
        username: currentUser.username,
        email: currentUser.email,
        password: "",
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setError(null);

      const dataToUpdate: Partial<UserUpdate> = {
        username: userUpdateData.username,
        email: userUpdateData.email,
      };

      if (userUpdateData.password?.trim()) {
        dataToUpdate.password = userUpdateData.password;
      }

      const updatedUser = await meApi.updateMe(dataToUpdate);
      setUser(updatedUser);
      setIsEditing(false);
      navigate("/");
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || "Failed to update profile";
      setError(typeof errorMessage === "string" 
        ? errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1) 
        : errorMessage[0].loc[1].charAt(0).toUpperCase() + errorMessage[0].loc[1].slice(1) + ' ' + errorMessage[0].msg);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setError(null);
      await meApi.deleleMe();
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to delete account");
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="md">
        <Paper sx={{ p: 4, mt: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={4}>
            <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  margin: "0 auto",
                  mb: 2,
                  bgcolor: "primary.main",
                  fontSize: "3rem",
                }}
              >
                {user?.username.charAt(0).toUpperCase()}
              </Avatar>
              {!isEditing && (
                <Typography variant="h6" gutterBottom>
                  {user?.username}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} md={8}>
              <Box sx={{ position: "relative" }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  Profile Information
                  {!isEditing && (
                    <IconButton
                      onClick={() => setIsEditing(true)}
                      size="small"
                      sx={{ ml: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                </Typography>

                {isEditing ? (
                  <Box
                    component="form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleUpdate();
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Username"
                      value={userUpdateData.username}
                      onChange={(e) =>
                        setUserUpdateData({
                          ...userUpdateData,
                          username: e.target.value,
                        })
                      }
                      margin="normal"
                      required
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      value={userUpdateData.email}
                      onChange={(e) =>
                        setUserUpdateData({
                          ...userUpdateData,
                          email: e.target.value,
                        })
                      }
                      margin="normal"
                      required
                    />
                    <TextField
                      fullWidth
                      type="password"
                      label="New Password"
                      value={userUpdateData.password}
                      onChange={(e) =>
                        setUserUpdateData({
                          ...userUpdateData,
                          password: e.target.value,
                        })
                      }
                      margin="normal"
                      placeholder="Leave empty to keep current password"
                    />
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        type="submit"
                        startIcon={<SaveIcon />}
                        sx={{ mr: 1 }}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setIsEditing(false);
                          if (user) {
                            setUserUpdateData({
                              username: user.username,
                              email: user.email,
                              password: "",
                            });
                          }
                        }}
                        startIcon={<CancelIcon />}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      <strong>Username:</strong> {user?.username}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      <strong>Email:</strong> {user?.email}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      <strong>Member since:</strong>{" "}
                      {new Date(user?.created_at || "").toLocaleDateString(
                        "tr-TR",
                        { month: "long", day: "numeric", year: "numeric" }
                      )}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      sx={{ mt: 2 }}
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      Delete Account
                    </Button>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Account Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Me;
