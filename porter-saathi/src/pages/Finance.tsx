// src/pages/Finance.tsx
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { Box, Paper, Stack, Typography, TextField, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useSpeech } from "../hooks/useSpeech";
import VoiceBar from "../components/VoiceBar";

type DayRecord = { date: string; earnings: number; expenses: number; penalties: number; rewards: number };
const SAMPLE: DayRecord[] = [
  { date: "2025-09-10", earnings: 1800, expenses: 300, penalties: 0, rewards: 100 },
  { date: "2025-09-11", earnings: 2200, expenses: 350, penalties: 50, rewards: 200 },
  { date: "2025-09-12", earnings: 2000, expenses: 320, penalties: 0, rewards: 150 },
];

function calcToday(d = SAMPLE[SAMPLE.length - 1]) {
  const gross = d.earnings + d.rewards - d.penalties;
  const net = gross - d.expenses;
  return { gross, net, ...d };
}

/** Normalize common Hindi (Devanagari) phrases to roman tokens for intent matching. */
function normalizeIntent(input: string) {
  let t = input.normalize("NFC").toLowerCase();

  const map: Array<[RegExp, string]> = [
    [/खर्चा|खर्च/g, "kharcha"],
    [/(काट|घटा)(कर|के)?/g, "kaat"],
    [/कमाय[ािे]/g, "kamaya"],
    [/कुल|टोटल/g, "gross"],
    [/इनाम|रिवॉ?र्ड/g, "reward"],
    [/जुर्माना|पेनल्टी/g, "penalty"],
    [/बेहतर|बेत्तर/g, "better"],
    [/पिछले\s*हफ्ते|गत\s*हफ्ते|पिछले\s*सप्ताह/g, "pichle-hafte"],
    [/खर्चे|खर्चों/g, "kharcha"],
  ];

  for (const [re, rep] of map) t = t.replace(re, rep);
  return t;
}

export default function Finance() {
  const [{ net, gross, earnings, expenses, penalties, rewards }] = useState(calcToday());
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState("");
  const { listening, start, stop, lastTranscript, speak } = useSpeech({ lang: "hi-IN", rate: 1 });

  // Tiny rule-based Q&A with Hindi normalization
  const answerQuestion = (text: string) => {
    const norm = normalizeIntent(text); // works for Hindi + English + Hinglish

    if (/(kharcha|expense).*(kaat)|\bnet\b/.test(norm)) {
      const a = `आज खर्चा काट के कमाई ₹${net} है।`;
      setAnswer(a); speak(a);
      return;
    }

    if (/(gross|total)/.test(norm)) {
      const a = `आज कुल आमदनी ₹${gross} है।`;
      setAnswer(a); speak(a);
      return;
    }

    if (/penalt/.test(norm)) {
      const a = `आज जुर्माना ₹${penalties} लगा है।`;
      setAnswer(a); speak(a);
      return;
    }

    if (/reward|bonus/.test(norm)) {
      const a = `आज रिवॉर्ड ₹${rewards} मिला है।`;
      setAnswer(a); speak(a);
      return;
    }

    if (/(kharcha|expense)/.test(norm)) {
      const a = `आज का खर्चा ₹${expenses} है।`;
      setAnswer(a); speak(a);
      return;
    }

    if (/(better|pichle-hafte)/.test(norm)) {
      const prevAvg =
        SAMPLE.slice(0, SAMPLE.length - 1)
          .reduce((s, d) => s + (d.earnings + d.rewards - d.penalties - d.expenses), 0) /
        (SAMPLE.length - 1);

      const diff = Math.round(net - prevAvg);
      const a =
        diff >= 0
          ? `हाँ, आज का नेट ₹${diff} ज़्यादा है पिछले दिनों से।`
          : `नहीं, आज का नेट ₹${Math.abs(diff)} कम है पिछले दिनों से।`;
      setAnswer(a); speak(a);
      return;
    }

    const fallback = "मुझे समझ नहीं आया। आप पूछ सकते हैं: “आज खर्चा काट के कितना कमाया?”";
    setAnswer(fallback); speak(fallback);
  };

  // Use the latest transcript once (avoid calling during render)
  useEffect(() => {
    if (lastTranscript) {
      answerQuestion(lastTranscript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastTranscript]);

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 8 } }}>
        <Stack spacing={3}>
          <Typography variant="h4" fontWeight={900}>Business Summary</Typography>

          <VoiceBar
            listening={listening}
            onStart={start}
            onStop={stop}
            hint="बोलिए: “आज खर्चा काट के कितना कमाया?”"
          />

          {/* Key cards */}
          <Grid container spacing={{ xs: 3, md: 4 }}>
            {[
              { t: "Gross (आज)", v: `₹${gross}` },
              { t: "Net (खर्चा के बाद)", v: `₹${net}` },
              { t: "Earnings", v: `₹${earnings}` },
              { t: "Expenses", v: `₹${expenses}` },
              { t: "Penalties", v: `₹${penalties}` },
              { t: "Rewards", v: `₹${rewards}` },
            ].map((c) => (
              <Grid key={c.t} size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                  <Typography fontWeight={800}>{c.t}</Typography>
                  <Typography variant="h5" sx={{ mt: 0.5 }}>{c.v}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Ask with text */}
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <TextField
                fullWidth
                placeholder="हिंदी/English में प्रश्न लिखें…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && answerQuestion(q)}
              />
              <Button variant="contained" onClick={() => answerQuestion(q)}>Ask</Button>
            </Stack>
          </Paper>

          {answer && (
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
              <Typography fontWeight={800} sx={{ mb: 0.5 }}>Answer</Typography>
              <Typography color="text.secondary">{answer}</Typography>
            </Paper>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
