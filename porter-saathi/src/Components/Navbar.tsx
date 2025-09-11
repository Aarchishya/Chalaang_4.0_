import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Typography,
  Stack,
  Link,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MicOutlinedIcon from "@mui/icons-material/MicOutlined";
import { Link as RouterLink } from "react-router-dom";

const NAV_LINKS = [
  { label: "About Porter", href: "/#about-porter" },
  { label: "AI Features", href: "/#ai-features" },
  { label: "Coverage", href: "#coverage" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: 72 }}>
          {/* Brand */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mr: { xs: 1, md: 3 },
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: "primary.main",
                display: "grid",
                placeItems: "center",
                color: "common.white",
              }}
            >
              <MicOutlinedIcon fontSize="small" />
            </Box>

            <Box sx={{ lineHeight: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Porter Saathi
              </Typography>
              <Typography variant="caption" color="text.secondary">
                AI Voice Partner
              </Typography>
            </Box>
          </Box>

          {/* Center links (desktop) */}
          <Stack
            direction="row"
            spacing={4}
            sx={{ display: { xs: "none", md: "flex" }, mx: "auto" }}
          >
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                underline="none"
                color="text.primary"
                sx={{
                  fontSize: 16,
                  "&:hover": { color: "primary.main" },
                }}
              >
                {l.label}
              </Link>
            ))}
          </Stack>

          {/* Right CTA (desktop) */}
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Button
              component={RouterLink}
              to="/signup"
              size="medium"
              sx={{
                borderRadius: 3,
                bgcolor: "common.white",
                color: "text.primary",
                border: 1,
                borderColor: "divider",
                px: 2.5,
                "&:hover": { bgcolor: "grey.50", borderColor: "primary.main" },
              }}
            >
              Get Started
            </Button>
          </Box>

          {/* Mobile menu button */}
          <IconButton
            sx={{ display: { xs: "inline-flex", md: "none" }, ml: "auto" }}
            onClick={(e) => setAnchorEl(e.currentTarget)}
            aria-label="Open menu"
          >
            <MenuIcon />
          </IconButton>

          {/* Mobile menu */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            {NAV_LINKS.map((l) => (
              <MenuItem
                key={l.label}
                onClick={() => setAnchorEl(null)}
                component="a"
                href={l.href}
              >
                {l.label}
              </MenuItem>
            ))}
            <MenuItem
              onClick={() => setAnchorEl(null)}
              component={RouterLink}
              to="/signup"
              sx={{ mt: 0.5 }}
            >
              Get Started
            </MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
