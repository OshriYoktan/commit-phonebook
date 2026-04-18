import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Alert,
  InputAdornment,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setError("");

      if (!username || !password) {
        setError("Please fill all fields");
        return;
      }

      setLoading(true);

      const res = await api.post("/auth/login", { username, password });

      const { accessToken, refreshToken, user } = res.data;

      login(accessToken, refreshToken, user);

      navigate("/contacts");
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top left, #1e293b, #0f172a)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 6,
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              bgcolor: "primary.main",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: "0 8px 16px rgba(25, 118, 210, 0.3)",
            }}
          >
            <ContactPhoneIcon sx={{ color: "white", fontSize: 32 }} />
          </Box>

          <Typography variant="h4" fontWeight="800" gutterBottom>
            PhoneBook
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={4}>
            Enter your credentials to access the contacts
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2.5,
              }}
            >
              {error && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <TextField
                label="Username"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              />

              <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 1,
                  borderRadius: 3,
                  py: 1.8,
                  fontWeight: "bold",
                  fontSize: "1rem",
                  textTransform: "none",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
                }}
              >
                {loading ? (
                  <CircularProgress size={26} color="inherit" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}