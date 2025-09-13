// src/pages/Sahayata.tsx
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { Box, Paper, Stack, Typography, Button, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import { useSpeech } from "../hooks/useSpeech";
import VoiceBar from "../Components/VoiceBar";
import WarningAmberOutlined from "@mui/icons-material/WarningAmberOutlined";

export default function Sahayata() {
  const { listening, start, stop, lastTranscript, speak } = useSpeech({ lang: "hi-IN" });
  const [phase, setPhase] = useState<"idle"|"greet"|"collect"|"done">("idle");
  const [issue, setIssue] = useState<string>("");
  const [loc, setLoc] = useState<string>("");

  useEffect(() => {
    if (phase === "greet") {
      speak("Main madad ke liye yahan hoon. Aap bataiye kya samasya hai?");
      start();
    }
  }, [phase]); // eslint-disable-line

  useEffect(() => {
    if (!lastTranscript) return;
    if (phase === "greet" || phase === "collect") {
      setIssue((p) => p ? p + " " + lastTranscript : lastTranscript);
      setPhase("collect");
      speak("Samajh gaya. Kripya shaant rahiye. Aapka location le raha hoon.");
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const s = `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
            setLoc(s);
            speak(`Aapka sthaan record ho gaya: ${s}. Madad bheji ja rahi hai.`);
            setPhase("done");
            stop();
          },
          () => {
            speak("Location nahi mil paya. Fir bhi report bheji ja rahi hai.");
            setPhase("done");
            stop();
          }
        );
      } else {
        speak("Location service uplabdh nahi. Report bheji ja rahi hai.");
        setPhase("done");
        stop();
      }
    }
  }, [lastTranscript]); // eslint-disable-line

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 8 } }}>
        <Stack spacing={3}>
          <Typography variant="h4" fontWeight={900}>Sahayata (Emergency)</Typography>
          <VoiceBar listening={listening} onStart={start} onStop={stop} hint="Sankat mein? ‘Start’ dabayein aur boliye…" />

          <Paper variant="outlined" sx={{ p: 4, borderRadius: 4, textAlign: "center" }}>
            <WarningAmberOutlined sx={{ fontSize: 48, color: "warning.main" }} />
            <Typography variant="h5" fontWeight={900} sx={{ mt: 1, mb: 2 }}>
              Zero-Reading Emergency Assistance
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Ek button, sirf awaaz par adharit sahayata.
            </Typography>
            <Grid container justifyContent="center">
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  color="error"
                  sx={{ py: 2, borderRadius: 3 }}
                  onClick={() => setPhase("greet")}
                >
                  HELP / SAHAYATA
                </Button>
              </Grid>
            </Grid>

            {phase !== "idle" && (
              <Stack spacing={1.5} sx={{ mt: 3, textAlign: "left" }}>
                <Alert severity="info">Heard: {issue || "…"} </Alert>
                <Alert severity={loc ? "success" : "warning"}>
                  {loc ? `Location: ${loc}` : "Location pending…"}
                </Alert>
              </Stack>
            )}
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
