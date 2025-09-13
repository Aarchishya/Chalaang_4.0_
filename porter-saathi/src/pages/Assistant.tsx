// src/pages/Assistant.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box, Paper, Stack, Typography, IconButton, TextField, Chip, Button,
  InputAdornment, Divider, Tooltip, Grid, Alert
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import SendIcon from "@mui/icons-material/Send";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import NavigationIcon from "@mui/icons-material/Navigation";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MapIcon from "@mui/icons-material/Map";
import WeatherIcon from "@mui/icons-material/Cloud";

// Import navigation services
import navigationService from "../services/navigationService";
import type { Location, Route } from "../services/navigationService";
import MapComponent from "../Components/MapComponent";

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

interface NavigationState {
  isNavigating: boolean;
  currentLocation: Location | null;
  route: Route | null;
  destination: string;
  currentStep: number;
  showMap: boolean;
  autoAdvance: boolean;
  isPickupNavigation: boolean;
  pickupOrder: any | null;
  weatherAlert: string | null;
  showWeatherAlert: boolean;
  lastWeatherCheck: number;
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

// Helper function to detect navigation commands
function extractDestination(text: string) {
  const englishMatch = text.match(/(?:navigate|go to|take me to|directions to|route to)\s+(.+)/i);
  if (englishMatch) return englishMatch[1].trim();
  
  const hindiMatch1 = text.match(/mujhe\s+(.+?)\s+le chalo/i);
  if (hindiMatch1) return hindiMatch1[1].trim();
  
  const hindiMatch2 = text.match(/(?:le chalo|jao|rasta dikhao|direction do)\s+(.+)/i);
  if (hindiMatch2) return hindiMatch2[1].trim();
  
  return null;
}

const quickChips = [
  { key: "emergency",  label: "🚨 Emergency",        text: "Call emergency helpline" },
  { key: "insurance",  label: "🛡️ Insurance Guide",  text: "Show me the insurance guide" },
  { key: "road",       label: "🚧 Road Alert",        text: "Any road alert on my route?" },
  { key: "earnings",   label: "💰 Earnings Today",    text: "Show my earnings for today" },
  { key: "growth",     label: "📈 Business Growth",   text: "Give me a quick business growth summary for this week" },
  { key: "onboarding", label: "🧭 Onboarding Help",   text: "Guide me through the onboarding steps" },
  { key: "navigate",   label: "🧭 Navigate",          text: "Navigate to Manyata Tech Park" },
  { key: "location",   label: "📍 My Location",       text: "Where am I?" },
  { key: "weather",    label: "🌦️ Weather Check",     text: "What's the weather like?" },
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
  const [navigation, setNavigation] = useState<NavigationState>({
    isNavigating: false,
    currentLocation: null,
    route: null,
    destination: "",
    currentStep: 0,
    showMap: false,
    autoAdvance: true,
    isPickupNavigation: false,
    pickupOrder: null,
    weatherAlert: null,
    showWeatherAlert: false,
    lastWeatherCheck: 0
  });
  const listRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<any>(null);

  const addMsg = (role: Role, content: string) =>
    setMessages((prev) => [...prev, { role, content, ts: Date.now() }]);

  // Navigation helper functions
  const startNavigation = useCallback(async (destination: string, isPickup = false, pickupOrder = null) => {
    try {
      if (!navigation.currentLocation) {
        const location = await navigationService.getCurrentLocation();
        setNavigation(prev => ({ ...prev, currentLocation: location }));
      }

      // Check weather before starting navigation
      const weatherAlert = await navigationService.checkWeatherAlert(destination);
      if (weatherAlert) {
        setNavigation(prev => ({
          ...prev,
          weatherAlert: weatherAlert,
          showWeatherAlert: true,
          destination: destination,
          isPickupNavigation: isPickup,
          pickupOrder: pickupOrder
        }));
        
        const reply = `Weather check: ${weatherAlert} Do you still want to navigate?`;
        addMsg("ai", reply); 
        speak(reply);
        return;
      }

      const route = await navigationService.startNavigation(destination);
      setNavigation(prev => ({
        ...prev,
        isNavigating: true,
        route,
        destination,
        currentStep: 0,
        isPickupNavigation: isPickup,
        pickupOrder: pickupOrder,
        weatherAlert: null,
        showWeatherAlert: false
      }));

      const reply = `Starting navigation to ${destination}. Total distance: ${route.totalDistance}, estimated time: ${route.totalDuration}. First instruction: ${route.steps[0]?.instruction}`;
      addMsg("ai", reply); 
      speak(reply);

      // Start location watching for real-time updates
      if (navigation.autoAdvance) {
        navigationService.startLocationWatch(
          async (location) => {
            setNavigation(prev => ({ ...prev, currentLocation: location }));
            
            // Check weather every 2 minutes during navigation
            const now = Date.now();
            if (now - (navigation.lastWeatherCheck || 0) > 120000) {
              const weatherAlert = await navigationService.checkWeatherAtLocation(location);
              if (weatherAlert) {
                setNavigation(prev => ({ ...prev, weatherAlert, lastWeatherCheck: now }));
                addMsg("ai", weatherAlert); 
                speak(weatherAlert);
              }
            }
          },
          (nextInstruction) => {
            if (nextInstruction === "Destination reached!") {
              if (navigation.isPickupNavigation && navigation.pickupOrder) {
                const reply = `Reached pickup location! You can collect ${navigation.pickupOrder.item}. Tracking ID: ${navigation.pickupOrder.trackingId}`;
                addMsg("ai", reply); 
                speak(reply);
              } else {
                const reply = "Destination reached! Navigation completed successfully.";
                addMsg("ai", reply); 
                speak(reply);
              }
              setNavigation(prev => ({
                ...prev,
                isNavigating: false,
                route: null,
                destination: "",
                currentStep: 0,
                isPickupNavigation: false,
                pickupOrder: null,
                weatherAlert: null,
                showWeatherAlert: false
              }));
            } else {
              setNavigation(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
              const reply = `GPS auto-advance: ${nextInstruction}`;
              addMsg("ai", reply); 
              speak(reply);
            }
          }
        );
      } else {
        navigationService.startLocationWatch((location) => {
          setNavigation(prev => ({ ...prev, currentLocation: location }));
        });
      }

    } catch (error) {
      console.error('Navigation error:', error);
      const reply = `Failed to start navigation to ${destination}. Please check location permissions.`;
      addMsg("ai", reply); 
      speak(reply);
    }
  }, [navigation.currentLocation, navigation.autoAdvance, navigation.isPickupNavigation, navigation.pickupOrder, navigation.lastWeatherCheck, addMsg]);

  const stopNavigation = useCallback(() => {
    navigationService.stopNavigation();
    setNavigation(prev => ({
      ...prev,
      isNavigating: false,
      route: null,
      destination: "",
      currentStep: 0,
      isPickupNavigation: false,
      pickupOrder: null
    }));

    const reply = "Navigation stopped.";
    addMsg("ai", reply); 
    speak(reply);
  }, [addMsg]);

  const getNextInstruction = useCallback(() => {
    if (!navigation.route || !navigation.isNavigating) {
      return null;
    }

    const nextStep = navigation.route.steps[navigation.currentStep + 1];
    if (nextStep) {
      setNavigation(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
      navigationService.setCurrentStepIndex(navigation.currentStep + 1);
      return nextStep.instruction;
    }
    return null;
  }, [navigation.route, navigation.isNavigating, navigation.currentStep]);

  const getCurrentInstruction = useCallback(() => {
    if (!navigation.route || !navigation.isNavigating) {
      return null;
    }
    return navigation.route.steps[navigation.currentStep]?.instruction;
  }, [navigation.route, navigation.isNavigating, navigation.currentStep]);

  const isAtFinalStep = useCallback(() => {
    if (!navigation.route || !navigation.isNavigating) {
      return false;
    }
    return navigation.currentStep >= navigation.route.steps.length - 1;
  }, [navigation.route, navigation.isNavigating, navigation.currentStep]);

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

  // Initialize GPS location on component mount
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        const location = await navigationService.getCurrentLocation();
        setNavigation(prev => ({
          ...prev,
          currentLocation: location
        }));
      } catch (error) {
        console.error('Failed to get location:', error);
        const reply = "GPS access denied. Please enable location services for navigation features.";
        addMsg("ai", reply); 
        speak(reply);
      }
    };

    initializeLocation();
  }, []);

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

    // Extract destination for navigation
    const destination = extractDestination(input);

    // ---- START NAVIGATION ----
    if (destination) {
      await startNavigation(destination);
      return;
    }

    // ---- STOP NAVIGATION ----
    if (/stop navigation|end navigation|cancel navigation|navigation band karo|navigation ruko/i.test(input)) {
      stopNavigation();
      return;
    }

    // ---- NEXT INSTRUCTION ----
    if (/next instruction|what's next|next step|agla instruction|agla step|kya hai agla/i.test(input)) {
      const instruction = getNextInstruction();
      if (instruction) {
        const reply = `Next: ${instruction}`;
        addMsg("ai", reply); 
        speak(reply);
      } else {
        const reply = "No more navigation instructions available.";
        addMsg("ai", reply); 
        speak(reply);
      }
      return;
    }

    // ---- CURRENT LOCATION ----
    if (/where am i|current location|my location|main kahan hun|mera location/i.test(input)) {
      if (navigation.currentLocation) {
        const coords = `${navigation.currentLocation.latitude.toFixed(4)}, ${navigation.currentLocation.longitude.toFixed(4)}`;
        const placeName = navigation.currentLocation.placeName || 'Unknown Location';
        const address = navigation.currentLocation.address || coords;
        
        const reply = `Your current location: ${placeName} (${coords}). Full address: ${address}`;
        addMsg("ai", reply); 
        speak(reply);
      } else {
        const reply = "Location not available. Please enable GPS permissions.";
        addMsg("ai", reply); 
        speak(reply);
      }
      return;
    }

    // ---- SHOW MAP ----
    if (/show map|open map|view map|map dikhao|map kholo/i.test(input)) {
      setNavigation(prev => ({ ...prev, showMap: true }));
      const reply = "Opening map view. You can see your current location and navigation route.";
      addMsg("ai", reply); 
      speak(reply);
      return;
    }

    // ---- CLOSE MAP ----
    if (/close map|hide map|map band karo/i.test(input)) {
      setNavigation(prev => ({ ...prev, showMap: false }));
      const reply = "Map closed.";
      addMsg("ai", reply); 
      speak(reply);
      return;
    }

    // ---- WEATHER CHECK COMMANDS ----
    if (/weather check|weather status|weather kaisa hai|weather condition|mausam kaisa hai|mausam check|weather update/i.test(input)) {
      if (navigation.currentLocation) {
        const weatherAlert = await navigationService.checkWeatherAtLocation(navigation.currentLocation);
        if (weatherAlert) {
          addMsg("ai", weatherAlert); 
          speak(weatherAlert);
        } else {
          const reply = "Weather conditions are normal. Safe to drive.";
          addMsg("ai", reply); 
          speak(reply);
        }
      } else {
        const reply = "Current location not available for weather check.";
        addMsg("ai", reply); 
        speak(reply);
      }
      return;
    }

    // Local reminder handling first (client-side utility)
    const reminderMatch = input.match(
      /(remind(?:\s+me)?|reminder|schedule|pickup)[^0-9]*?(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i
    );
    if (reminderMatch) { scheduleReminder(input, reminderMatch[2]); return; }

    // Everything else → unified server endpoint
    try {
      const data = await askServer(input);
      const reply = data?.reply ?? "I'm not sure about that.";
      addMsg("ai", reply);
      speak(reply);
    } catch {
      const r = "Network error. Please try again.";
      addMsg("ai", r); speak(r);
    }
  }, [navigation.currentLocation]);

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
      {/* Weather Alert */}
      {navigation.showWeatherAlert && navigation.weatherAlert && (
        <Alert 
          severity="warning" 
          sx={{ mb: 2 }}
          action={
            <Stack direction="row" spacing={1}>
              <Button 
                size="small" 
                onClick={() => {
                  const route = navigationService.startNavigation(navigation.destination);
                  route.then(routeData => {
                    setNavigation(prev => ({
                      ...prev,
                      isNavigating: true,
                      route: routeData,
                      currentStep: 0,
                      weatherAlert: null,
                      showWeatherAlert: false
                    }));
                    const reply = `Starting navigation despite weather alert. Drive carefully!`;
                    addMsg("ai", reply); 
                    speak(reply);
                  });
                }}
              >
                Continue
              </Button>
              <Button 
                size="small" 
                onClick={() => {
                  setNavigation(prev => ({
                    ...prev,
                    weatherAlert: null,
                    showWeatherAlert: false,
                    destination: "",
                    isPickupNavigation: false,
                    pickupOrder: null
                  }));
                  const reply = "Navigation cancelled due to weather alert.";
                  addMsg("ai", reply); 
                  speak(reply);
                }}
              >
                Wait
              </Button>
            </Stack>
          }
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Weather Alert
          </Typography>
          {navigation.weatherAlert}
        </Alert>
      )}

      {/* Real-time Weather Alert during Navigation */}
      {navigation.isNavigating && navigation.weatherAlert && !navigation.showWeatherAlert && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          action={
            <Button 
              size="small" 
              onClick={() => setNavigation(prev => ({ ...prev, weatherAlert: null }))}
            >
              Dismiss
            </Button>
          }
        >
          {navigation.weatherAlert}
        </Alert>
      )}

      {/* Navigation Status */}
      {navigation.isNavigating && (
        <Paper 
          sx={{ 
            p: 2, 
            mb: 2, 
            bgcolor: navigation.isPickupNavigation ? 'success.light' : 'primary.light',
            color: 'white'
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <NavigationIcon />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {navigation.isPickupNavigation ? 'Pickup Navigation' : 'Navigating to'} {navigation.destination}
              </Typography>
              {navigation.isPickupNavigation && navigation.pickupOrder && (
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  📦 {navigation.pickupOrder.item} (Qty: {navigation.pickupOrder.qty}) • ID: {navigation.pickupOrder.trackingId}
                </Typography>
              )}
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {navigation.route && `Distance: ${navigation.route.totalDistance} • Time: ${navigation.route.totalDuration}`}
              </Typography>
              {navigation.currentLocation && (
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  📍 {navigation.currentLocation.placeName || 'Current Location'}
                </Typography>
              )}
            </Box>
            <Button
              onClick={() => setNavigation(prev => ({ ...prev, autoAdvance: !prev.autoAdvance }))}
              sx={{ 
                bgcolor: navigation.autoAdvance ? 'success.main' : 'grey.500',
                color: 'white',
                mr: 1
              }}
            >
              {navigation.autoAdvance ? 'GPS Auto' : 'Manual'}
            </Button>
            <Button
              onClick={stopNavigation}
              sx={{ bgcolor: 'error.main', color: 'white' }}
            >
              Stop
            </Button>
          </Stack>
        </Paper>
      )}

      {/* Current Navigation Instruction */}
      {navigation.isNavigating && getCurrentInstruction() && (
        <Paper sx={{ p: 2, mb: 2, border: '2px solid', borderColor: 'primary.main' }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <LocationOnIcon color="primary" />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Step {navigation.currentStep + 1} of {navigation.route?.steps.length}
              </Typography>
              <Typography variant="body1">
                {getCurrentInstruction()}
              </Typography>
            </Box>
            <Button
              onClick={() => {
                if (isAtFinalStep()) {
                  if (navigation.isPickupNavigation && navigation.pickupOrder) {
                    const reply = `Reached pickup location! You can collect ${navigation.pickupOrder.item}. Tracking ID: ${navigation.pickupOrder.trackingId}`;
                    addMsg("ai", reply); 
                    speak(reply);
                  } else {
                    const reply = "Destination reached! Navigation completed successfully.";
                    addMsg("ai", reply); 
                    speak(reply);
                  }
                  stopNavigation();
                } else {
                  const next = getNextInstruction();
                  if (next) {
                    const reply = `Next: ${next}`;
                    addMsg("ai", reply); 
                    speak(reply);
                  }
                }
              }}
              variant="contained"
              disabled={navigation.autoAdvance}
            >
              {isAtFinalStep() ? (navigation.isPickupNavigation ? 'Pickup!' : 'Reached!') : 'Next'}
            </Button>
          </Stack>
        </Paper>
      )}

      {/* Quick actions: 3 per row on small+ screens, 1 per row on mobile */}
      <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
        {quickChips.map((c) => (
          <Grid size={{ xs: 12, sm: 4 }} key={c.key} display="flex" justifyContent="center">
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

      {/* Map Component */}
      <MapComponent
        currentLocation={navigation.currentLocation}
        destination={navigation.destination}
        isVisible={navigation.showMap}
        onClose={() => setNavigation(prev => ({ ...prev, showMap: false }))}
      />
    </Box>
  );
};

export default Assistant;
