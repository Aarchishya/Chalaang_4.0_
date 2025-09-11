import { useState } from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  Link,
  Button,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid"; // v7 Grid (use `size` prop)
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import MicIcon from "@mui/icons-material/Mic";
import { Link as RouterLink } from "react-router-dom";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Paper
      elevation={0}
      sx={{
        maxWidth: 620,
        mx: "auto",
        my: { xs: 2, md: 4 },
        p: { xs: 3, md: 4 },
        borderRadius: 4,
        border: 1,
        borderColor: "divider",
      }}
    >
      {/* Welcome */}
      <Stack spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h4" fontWeight={900}>Welcome</Typography>
        <Typography color="text.secondary" align="center">
          Sign in to access your voice-first logistics partner
        </Typography>
      </Stack>

      {/* Pill Tabs */}
      <Box sx={{ bgcolor: "grey.100", borderRadius: 999, p: 0.5, mb: 3 }}>
        <Tabs
          value={1}
          variant="fullWidth"
          TabIndicatorProps={{ sx: { display: "none" } }}
          sx={{
            minHeight: 44,
            "& .MuiTab-root": { minHeight: 40, borderRadius: 999, textTransform: "none", fontWeight: 600 },
            "& .Mui-selected": { bgcolor: "common.white", boxShadow: "inset 0 0 0 1px var(--mui-palette-divider)" },
          }}
        >
          <Tab label="Login" component={RouterLink} to="/login" />
          <Tab label="Sign Up" />
        </Tabs>
      </Box>

      {/* Form */}
      <Stack component="form" spacing={2.5}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box>
              <Typography variant="body2" fontWeight={700} sx={{ mb: 1 }}>First Name</Typography>
              <TextField placeholder="First name" fullWidth />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box>
              <Typography variant="body2" fontWeight={700} sx={{ mb: 1 }}>Last Name</Typography>
              <TextField placeholder="Last name" fullWidth />
            </Box>
          </Grid>
        </Grid>

        <Box>
          <Typography variant="body2" fontWeight={700} sx={{ mb: 1 }}>Email</Typography>
          <TextField
            placeholder="Enter your email"
            type="email"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineOutlinedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box>
          <Typography variant="body2" fontWeight={700} sx={{ mb: 1 }}>Phone Number</Typography>
          <TextField
            placeholder="+91 XXXXX XXXXX"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIphoneOutlinedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box>
          <Typography variant="body2" fontWeight={700} sx={{ mb: 1 }}>Password</Typography>
          <TextField
            placeholder="Create a password"
            type={showPassword ? "text" : "password"}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(s => !s)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <FormControlLabel
          control={<Checkbox size="small" />}
          label={
            <Typography variant="body2">
              I agree to the{" "}
              <Link component={RouterLink} to="/terms-of-service" underline="hover">Terms of Service</Link>{" "}
              and{" "}
              <Link component={RouterLink} to="/privacy-policy" underline="hover">Privacy Policy</Link>
            </Typography>
          }
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ borderRadius: 2, py: 1.25, "&:hover": { bgcolor: "grey.900" } }}
        >
          Create Account
        </Button>
      </Stack>

      <Divider sx={{ my: 3 }}>
        <Typography variant="caption" color="text.secondary">OR SIGN UP WITH</Typography>
      </Divider>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Button variant="outlined" fullWidth startIcon={<KeyOutlinedIcon />}>OTP</Button>
        <Button variant="outlined" fullWidth startIcon={<MicIcon />}>Voice</Button>
      </Stack>
    </Paper>
  );
}
