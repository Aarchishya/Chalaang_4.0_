import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#0346DB" },
    background: { default: "#FFFFFF", paper: "#FFFFFF" },
    text: { primary: "#0b1220" },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: "none", borderRadius: 12 } } },
    MuiLink:   { styleOverrides: { root: { cursor: "pointer" } } },
  },
  typography: {
    fontFamily: [
      "Roboto",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Arial",
      "sans-serif",
    ].join(", "),
  },
});

export default theme;
