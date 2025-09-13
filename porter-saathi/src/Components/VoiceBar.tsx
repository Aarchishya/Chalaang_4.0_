// src/components/VoiceBar.tsx
import { Button, Stack, Typography, Paper } from "@mui/material";
import MicNoneOutlined from "@mui/icons-material/MicNoneOutlined";
import StopCircleOutlined from "@mui/icons-material/StopCircleOutlined";

export default function VoiceBar(props: {
  listening: boolean;
  onStart: () => void;
  onStop: () => void;
  hint?: string;
}) {
  const { listening, onStart, onStop, hint } = props;
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
      <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between">
        <Typography fontWeight={800}>Voice Control</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography color="text.secondary" sx={{ display: { xs: "none", sm: "block" } }}>
            {hint ?? "Tap mic and speak…"}
          </Typography>
          {listening ? (
            <Button variant="outlined" color="warning" startIcon={<StopCircleOutlined />} onClick={onStop}>
              Stop
            </Button>
          ) : (
            <Button variant="contained" startIcon={<MicNoneOutlined />} onClick={onStart}>
              Start
            </Button>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}
