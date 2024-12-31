import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { UserCreate, UserSignUp } from "../types/User";
import { authApi } from "../api/auth";

const SignUp = () => {
  const navigate = useNavigate();

  const [userFormData, setUserFormData] = useState<UserSignUp>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (userFormData.password !== userFormData.confirmPassword) {
      setValidationError("Passwords don't match");
      return;
    }

    if (userFormData.password.length < 6) {
      setValidationError("Password must be at least 6 characters long");
      return;
    }

    try {
      const { confirmPassword, ...signUpData } = userFormData;
      // convert to userCreate
      const userCreate: UserCreate = {
        username: signUpData.username,
        email: signUpData.email,
        password: signUpData.password,
      };

      const response = await authApi.signup(userCreate);
      console.log(response);
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>
        {validationError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {validationError}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            margin="normal"
            required
            value={userFormData.username}
            onChange={(e) =>
              setUserFormData({ ...userFormData, username: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            required
            value={userFormData.email}
            onChange={(e) =>
              setUserFormData({ ...userFormData, email: e.target.value })
            }
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            margin="normal"
            required
            value={userFormData.password}
            onChange={(e) =>
              setUserFormData({ ...userFormData, password: e.target.value })
            }
          />
          <TextField
            fullWidth
            type="password"
            label="Confirm Password"
            margin="normal"
            required
            value={userFormData.confirmPassword}
            onChange={(e) =>
              setUserFormData({
                ...userFormData,
                confirmPassword: e.target.value,
              })
            }
          />
          <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
            Sign Up
          </Button>
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2">
              Already have an account? <Link to="/login">Login here</Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignUp;
