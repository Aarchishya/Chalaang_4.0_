// src/components/Assistant.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box, Paper, Stack, Typography, IconButton, TextField, Chip, Button,
  InputAdornment, Divider, Tooltip, Grid
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import SendIcon from "@mui/icons-material/Send";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

// ---- Speech APIs (browser guards)
const SpeechRecognition: any =
  (typeof window !== "undefined" && (window as any).SpeechRecognition) ||
  (typeof window !== "undefined" && (window as any).webkitSpeechRecognition);

const synth = (typeof window !== "undefined" && window.speechSynthesis) || null;

// ---- types
type Role = "user" | "ai";
interface ChatMessage { role: Role; content: string; ts: number }
interface Reminder { time: string; text: string; when: number; timeoutId?: number }
interface AiResponseBody {
  reply: string;
  action?: string;
  order?: any;
  orders?: any[];
  trackingId?: string;
  error?: string;
}

// ---- config
const API_URL = (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_URL) || "";

// ---- helpers
const parseTimeToDate = (input: string): Date | null => {
  const timeRe = /(\b\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i;
  const m = input.match(timeRe);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = m[2] ? parseInt(m[2], 10) : 0;
  const ampm = m[3]?.toLowerCase();
  if (ampm) {
    if (ampm === "pm" && h < 12) h += 12;
    if (ampm === "am" && h === 12) h = 0;
  }
  const d = new Date();
  d.setSeconds(0, 0);
  d.setHours(h, min, 0, 0);
  if (d.getTime() < Date.now()) d.setDate(d.getDate() + 1);
  return d;
};

const speak = (text: string) => {
  if (!synth) return;
  try {
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    synth.speak(utter);
  } catch {}
};

const bubble = (role: Role) =>
  role === "user"
    ? {
        alignSelf: "flex-end",
        bgcolor: "primary.main",
        color: "#fff",
        borderTopRightRadius: 8,
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
      }
    : {
        alignSelf: "flex-start",
        bgcolor: "rgba(3,70,219,0.06)", // soft blue tint on white
        color: "inherit",
        borderTopRightRadius: 20,
        borderTopLeftRadius: 8,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        border: "1px solid rgba(3,70,219,0.15)",
      };

const quickChips = [
  { key: "emergency",  label: "🚨 Emergency",        text: "Call emergency helpline" },
  { key: "insurance",  label: "🛡️ Insurance Guide",  text: "Show me the insurance guide" },
  { key: "road",       label: "🚧 Road Alert",        text: "Any road alert on my route?" },
  { key: "earnings",   label: "💰 Earnings Today",    text: "Show my earnings for today" },
  { key: "growth",     label: "📈 Business Growth",   text: "Give me a quick business growth summary for this week" },
  { key: "onboarding", label: "🧭 Onboarding Help",   text: "Guide me through the onboarding steps" },
] as const;

// ---- server call
async function askServer(text: string): Promise<AiResponseBody> {
  const userId = localStorage.getItem("uid") || "demo-user";
  const url = (API_URL ? API_URL : "") + "/api/ai"; // supports proxy or absolute base
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, userId }),
  });
  if (!res.ok) throw new Error("Server error");
  return res.json();
}

const Assistant: React.FC = () => {
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<any>(null);

  // auto scroll
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  // init recognition
  useEffect(() => {
    if (!SpeechRecognition) return;
    const r = new SpeechRecognition();
    r.lang = "en-IN";
    r.continuous = false;
    r.interimResults = false;
    recRef.current = r;

    r.onresult = (ev: any) => {
      const transcript = ev.results?.[0]?.[0]?.transcript ?? "";
      if (transcript) handleUserText(transcript);
    };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
  }, []);

  const addMsg = (role: Role, content: string) =>
    setMessages((prev) => [...prev, { role, content, ts: Date.now() }]);

  const handleMic = () => {
    if (!recRef.current) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }
    if (!listening) {
      setListening(true);
      recRef.current.start();
    } else {
      recRef.current.stop();
      setListening(false);
    }
  };

  const scheduleReminder = (wholeText: string, whenText: string) => {
    const whenDate = parseTimeToDate(whenText);
    if (!whenDate) {
      const reply = "Sorry, I couldn’t parse the time. Try ‘remind me at 5:30 pm’.";
      addMsg("ai", reply); speak(reply); return;
    }
    const delay = Math.max(0, whenDate.getTime() - Date.now());
    const timeoutId = window.setTimeout(() => {
      const note = `Reminder: ${wholeText}`;
      addMsg("ai", note); speak(note);
      if ("Notification" in window) {
        if (Notification.permission === "granted") new Notification("Reminder", { body: wholeText });
        else if (Notification.permission !== "denied") Notification.requestPermission();
      }
    }, delay);

    const rem: Reminder = {
      time: whenDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: wholeText,
      when: whenDate.getTime(),
      timeoutId,
    };
    setReminders((r) => [...r, rem]);

    const reply = `Okay, I’ll remind you at ${rem.time}.`;
    addMsg("ai", reply); speak(reply);
  };

  const handleUserText = useCallback(async (raw: string) => {
    const input = raw.trim();
    if (!input) return;

    addMsg("user", input);

    // Local reminder handling first (client-side utility)
    const reminderMatch = input.match(
      /(remind(?:\s+me)?|reminder|schedule|pickup)[^0-9]*?(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i
    );
    if (reminderMatch) { scheduleReminder(input, reminderMatch[2]); return; }

    // Everything else → unified server endpoint
    try {
      const data = await askServer(input);
      const reply = data?.reply ?? "I’m not sure about that.";
      addMsg("ai", reply);
      speak(reply);
    } catch {
      const r = "Network error. Please try again.";
      addMsg("ai", r); speak(r);
    }
  }, []);

  const onSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (text.trim()) {
      const t = text.trim();
      setText("");
      handleUserText(t);
    }
  };

  const clearReminders = () => {
    reminders.forEach((r) => r.timeoutId && clearTimeout(r.timeoutId));
    setReminders([]);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 960, mx: "auto", py: 3 }}>
      {/* Quick actions: 3 per row on small+ screens, 1 per row on mobile */}
      <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
        {quickChips.map((c) => (
          <Grid item xs={12} sm={4} key={c.key} display="flex" justifyContent="center">
            <Chip
              label={c.label}
              clickable
              onClick={() => handleUserText(c.text)}
              sx={{
                px: 2, py: 1, fontWeight: 600,
                bgcolor: "rgba(3,70,219,0.08)",
                border: "1px solid rgba(3,70,219,0.25)",
                color: "primary.main",
                width: "100%",
                justifyContent: "center",
              }}
            />
          </Grid>
        ))}
      </Grid>

      <Paper variant="outlined" sx={{ p: 2, minHeight: 520, display: "flex", flexDirection: "column", gap: 2 }}>
        <Box
          ref={listRef}
          sx={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 1.5, px: { xs: 0.5, sm: 2 }, pt: 1 }}
        >
          {messages.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              Try: “create order for 2 shirts to MG Road Pune”, “track order ORD-XXXX”, “update ORD-XXXX to shipped”, “remind me at 5:30 pm”
            </Typography>
          )}
          {messages.map((m, i) => (
            <Box key={i} sx={{ display: "flex", flexDirection: "column", maxWidth: "85%", ...bubble(m.role), px: 2, py: 1.5 }}>
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.45 }}>
                {m.content}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, opacity: 0.7 }}>
                {new Date(m.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box component="form" onSubmit={onSend} sx={{ display: "flex", gap: 1 }}>
          <Tooltip title={listening ? "Stop listening" : "Start voice command"}>
            <span>
              <IconButton color={listening ? "error" : "primary"} onClick={handleMic} size="large">
                {listening ? <StopCircleIcon /> : <MicIcon />}
              </IconButton>
            </span>
          </Tooltip>

          <TextField
            fullWidth
            size="medium"
            placeholder="Ask anything"
            value={text}
            onChange={(e) => setText(e.target.value)}
            InputProps={{
              sx: { borderRadius: 3 },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit" color="primary">
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Paper>

      {reminders.length > 0 && (
        <Paper sx={{ mt: 2, p: 2 }} variant="outlined">
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle2">Reminders</Typography>
            <Button size="small" startIcon={<DeleteForeverIcon />} onClick={clearReminders}>
              Clear all
            </Button>
          </Stack>
          <Divider sx={{ my: 1 }} />
          <Stack spacing={1}>
            {reminders
              .sort((a, b) => a.when - b.when)
              .map((r, idx) => (
                <Typography key={idx} variant="body2">
                  <strong>{new Date(r.when).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</strong>: {r.text}
                </Typography>
              ))}
          </Stack>
        </Paper>
      )}
    </Box>
  );
};

export default Assistant;
