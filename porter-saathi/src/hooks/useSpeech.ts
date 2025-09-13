// src/hooks/useSpeech.ts
import { useCallback, useEffect, useRef, useState } from "react";

type SR = SpeechRecognition & {
  lang: string;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((this: SpeechRecognition, ev: any) => any) | null;
  onend: ((this: SpeechRecognition, ev: any) => any) | null;
  onerror: ((this: SpeechRecognition, ev: any) => any) | null;
};

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SR;
    SpeechRecognition?: new () => SR;
  }
}

export function useSpeech(opts?: { lang?: string; rate?: number; pitch?: number }) {
  const [listening, setListening] = useState(false);
  const [lastTranscript, setLastTranscript] = useState("");
  const recognitionRef = useRef<SR | null>(null);
  const lang = opts?.lang ?? "hi-IN"; // default Hindi (vernacular-first)
  const rate = opts?.rate ?? 1;
  const pitch = opts?.pitch ?? 1;

  useEffect(() => {
    const SRImpl = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SRImpl) return;
    const r = new SRImpl();
    r.lang = lang;
    r.interimResults = false;
    recognitionRef.current = r;

    r.onresult = (ev: any) => {
      const text = ev.results?.[0]?.[0]?.transcript ?? "";
      setLastTranscript(text);
    };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);

    return () => {
      try { r.stop(); } catch {}
      recognitionRef.current = null;
    };
  }, [lang]);

  const speak = useCallback(
    (text: string, speakLang?: string) => {
      if (!("speechSynthesis" in window)) return;
      const u = new SpeechSynthesisUtterance(text);
      u.lang = speakLang ?? lang;
      u.rate = rate;
      u.pitch = pitch;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    },
    [lang, rate, pitch]
  );

  const start = useCallback(() => {
    if (!recognitionRef.current) return false;
    setLastTranscript("");
    setListening(true);
    try { recognitionRef.current.start(); } catch {}
    return true;
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  return { listening, lastTranscript, start, stop, speak, lang };
}
