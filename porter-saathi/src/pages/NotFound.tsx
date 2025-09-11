import { Box, Button, Stack, Typography } from "@mui/material";

export default function NotFound() {
  return (
    <Stack spacing={2} alignItems="center" sx={{ py: 8 }}>
      <Typography variant="h2" fontWeight={900}>404</Typography>
      <Typography color="text.secondary">Page not found.</Typography>
      <Button href="/" variant="contained">Go home</Button>
    </Stack>
  );
}
