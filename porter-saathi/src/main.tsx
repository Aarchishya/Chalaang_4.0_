import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import theme from "./theme";
import App from "./App";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Assistant from "./pages/Assistant";
import NotFound from "./pages/NotFound";

// NEW pages
import Finance from "./pages/Finance";
import Onboarding from "./pages/Onboarding";
import Sahayata from "./pages/Sahayata";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    // (optional) show NotFound for thrown route errors
    // errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "assistant", element: <Assistant /> },

      // NEW routes
      { path: "finance", element: <Finance /> },
      { path: "onboarding", element: <Onboarding /> },
      { path: "sahayata", element: <Sahayata /> },

      // catch-all (must be last)
      { path: "*", element: <NotFound /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
