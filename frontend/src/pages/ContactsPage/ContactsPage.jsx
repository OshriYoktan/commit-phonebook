import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Typography,
  AppBar,
  Toolbar,
  Button,
  CircularProgress,
  Box,
  Card,
  CardContent,
  Avatar,
  TextField,
  InputAdornment,
  Paper,
  Divider,
  Grid,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await api.get("/contacts");
        setContacts(res.data);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const filteredContacts = contacts.filter((c) =>
    `${c.fullName} ${c.phoneNumber} ${c.address ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const rowStyle = {
    display: "flex",
    alignItems: "center",
    gap: 1,
    mb: 1,
  };

  const textClamp = {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top left, #1e293b, #0f172a)",
        pb: 6,
      }}
    >
      <AppBar
        position="static"
        sx={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(12px)",
          boxShadow: "none",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 800 }}>
            📇 PhoneBook
          </Typography>

          <Button
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            variant="contained"
            color="error"
            sx={{ borderRadius: 3, textTransform: "none", fontWeight: 600 }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 5 }}>
        {/* SEARCH */}
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            mb: 4,
            borderRadius: 4,
            background: "rgba(255,255,255,0.95)",
          }}
        >
          <TextField
            fullWidth
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            variant="standard"
            slotProps={{
              input: {
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Paper>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 12,
            }}
          >
            <CircularProgress size={60} />
          </Box>
        ) : filteredContacts.length === 0 ? (
          <Box sx={{ textAlign: "center", mt: 10, color: "white" }}>
            <Typography variant="h5">No contacts found</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredContacts.map((c) => (
              <Grid key={c.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    background: "rgba(255,255,255,0.96)",
                    display: "flex",
                    flexDirection: "column",
                    transition: "0.25s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 18px 40px rgba(0,0,0,0.25)",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: "#6366f1",
                          width: 38,
                          height: 38,
                          fontWeight: 700,
                        }}
                      >
                        {c.fullName?.charAt(0)?.toUpperCase()}
                      </Avatar>

                      <Typography
                        fontWeight={800}
                        fontSize="1.05rem"
                        sx={textClamp}
                      >
                        {c.fullName}
                      </Typography>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Box sx={rowStyle}>
                      <PersonIcon sx={{ color: "#6366f1", fontSize: 20 }} />
                      <Typography fontWeight={600} color="text.secondary">
                        Full Name:
                      </Typography>
                      <Typography fontWeight={500} sx={textClamp}>
                        {c.fullName}
                      </Typography>
                    </Box>

                    <Box sx={rowStyle}>
                      <PhoneIcon sx={{ color: "#22c55e", fontSize: 20 }} />
                      <Typography fontWeight={600} color="text.secondary">
                        Phone:
                      </Typography>
                      <Typography fontWeight={500} sx={textClamp}>
                        {c.phoneNumber}
                      </Typography>
                    </Box>

                    {c.address && (
                      <Box sx={rowStyle}>
                        <HomeIcon sx={{ color: "#f59e0b", fontSize: 20 }} />
                        <Typography fontWeight={600} color="text.secondary">
                          Address:
                        </Typography>
                        <Typography fontWeight={500} sx={textClamp}>
                          {c.address}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}