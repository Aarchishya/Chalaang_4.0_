import { useState } from "react";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

export default function Assistant() {
  const [listening, setListening] = useState(false);

  return (
    <Stack spacing={4} alignItems="center">
      <Box textAlign="center">
        <Typography variant="h4" fontWeight={900}>Porter Saathi Assistant</Typography>
        <Typography color="text.secondary" mt={1}>
          Tap to speak. Hands-free guidance for your task.
        </Typography>
      </Box>

      <Paper sx={{ p: 4, maxWidth: 680, width: "100%", borderRadius: 3 }} elevation={1}>
        <Stack spacing={3} alignItems="center">
          <Button
            size="large"
            variant="contained"
            onClick={() => setListening((v) => !v)}
            startIcon={listening ? <MicIcon /> : <MicIcon />}
            sx={{ height: 80, px: 4, borderRadius: 999 }}
          >
            {listening ? "Listening…" : "Start"}
          </Button>

        <Typography variant="body2" color={listening ? "primary.main" : "text.secondary"}>
          <FiberManualRecordIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: "middle" }} />
          {listening ? "Listening" : "Idle"}
        </Typography>

          <Box sx={{ bgcolor: "grey.50", border: 1, borderColor: "divider", p: 2, borderRadius: 2, width: "100%", minHeight: 96 }}>
            <Typography variant="body2" color="text.secondary">Transcript will appear here.</Typography>
          </Box>

          <Button variant="outlined" color="inherit" startIcon={<MicOffIcon />}>Stop</Button>
        </Stack>
      </Paper>
    </Stack>
  );
}
