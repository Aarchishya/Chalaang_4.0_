import Grid from "@mui/material/Grid"; // v7 Grid (uses `size` prop)
import {
  Box,
  Container,
  Stack,
  Typography,
  Link,
  IconButton,
  Divider,
  Paper,
} from "@mui/material";

import MicOutlinedIcon from "@mui/icons-material/MicOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const col = (title: string, items: { label: string; href?: string }[]) => (
  <Stack spacing={1.25}>
    <Typography variant="h6" fontWeight={900} sx={{ mb: 1 }}>
      {title}
    </Typography>
    {items.map((i) => (
      <Link
        key={i.label}
        href={i.href ?? "#"}
        underline="hover"
        color="text.secondary"
        sx={{ "&:hover": { color: "primary.main" } }}
      >
        {i.label}
      </Link>
    ))}
  </Stack>
);

export default function Footer() {
  return (
    <Box component="footer" sx={{ mt: { xs: 8, md: 12 } }}>
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 8 } }}>
        <Grid container spacing={{ xs: 6, md: 10 }}>
          {/* Brand + blurb + contacts + socials */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2.5}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    bgcolor: "primary.main",
                    color: "common.white",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <MicOutlinedIcon fontSize="small" />
                </Box>
                <Box sx={{ lineHeight: 1 }}>
                  <Typography variant="h6" fontWeight={900}>
                    Porter Saathi
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    AI Voice Partner
                  </Typography>
                </Box>
              </Stack>

              <Typography color="text.secondary" sx={{ maxWidth: 460 }}>
                Empowering logistics with voice-first AI technology. Making
                delivery services accessible and easy for everyone across India.
              </Typography>

              <Stack spacing={1.25}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <EmailOutlinedIcon sx={{ fontSize: 18 }} />
                  <Link href="mailto:saathi@porter.in" underline="hover" color="text.primary">
                    saathi@porter.in
                  </Link>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CallOutlinedIcon sx={{ fontSize: 18 }} />
                  <Typography>1800-266-7837</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PlaceOutlinedIcon sx={{ fontSize: 18 }} />
                  <Typography>22+ Cities across India</Typography>
                </Stack>
              </Stack>

              <Stack direction="row" spacing={1}>
                <IconButton size="small" aria-label="Twitter" sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}>
                  <TwitterIcon />
                </IconButton>
                <IconButton size="small" aria-label="Facebook" sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}>
                  <FacebookOutlinedIcon />
                </IconButton>
                <IconButton size="small" aria-label="Instagram" sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}>
                  <InstagramIcon />
                </IconButton>
                <IconButton size="small" aria-label="LinkedIn" sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}>
                  <LinkedInIcon />
                </IconButton>
              </Stack>
            </Stack>
          </Grid>

          {/* Link columns */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Grid container spacing={{ xs: 4, md: 6 }}>
              <Grid size={{ xs: 6, sm: 3 }}>
                {col("Porter Services", [
                  { label: "Book a Delivery" },
                  { label: "Track Package" },
                  { label: "Porter for Business" },
                  { label: "Pricing" },
                ])}
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                {col("Porter Saathi", [
                  { label: "Voice Commands", href: "/#ai-features" },
                  { label: "Accessibility Features", href: "/#ai-features" },
                  { label: "Language Support", href: "/#ai-features" },
                  { label: "Getting Started", href: "/signup" },
                ])}
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                {col("Support", [
                  { label: "Help Center" },
                  { label: "Contact Us", href: "/#contact" },
                  { label: "Safety" },
                  { label: "Terms of Service", href: "/terms-of-service" },
                ])}
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                {col("Company", [
                  { label: "About Porter", href: "/#about-porter" },
                  { label: "Careers" },
                  { label: "Blog" },
                  { label: "Press" },
                ])}
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Bottom bar */}
        <Divider sx={{ my: { xs: 4, md: 6 } }} />
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Porter Saathi. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={3}>
            <Link href="/privacy-policy" underline="hover" color="text.secondary">Privacy Policy</Link>
            <Link href="/cookie-policy" underline="hover" color="text.secondary">Cookie Policy</Link>
            <Link href="/accessibility" underline="hover" color="text.secondary">Accessibility</Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
