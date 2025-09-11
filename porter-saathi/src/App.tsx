import { Outlet } from "react-router-dom";
import { Box, Container } from "@mui/material";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

export default function App() {
  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: "background.default", color: "text.primary" }}>
      <Navbar />
      <Container component="main" maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Outlet />
      </Container>
      <Footer />
    </Box>
  );
}
