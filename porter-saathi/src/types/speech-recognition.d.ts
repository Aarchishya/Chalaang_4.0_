// Minimal typings for the Web Speech Recognition API

declare global {
    interface Window {
      webkitSpeechRecognition?: new () => SpeechRecognition;
      SpeechRecognition?: new () => SpeechRecognition;
    }
  
    interface SpeechRecognition extends EventTarget {
      lang: string;
      continuous: boolean;
      interimResults: boolean;
      maxAlternatives: number;
      start(): void;
      stop(): void;
      abort(): void;
  
      onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
      onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
      onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
      onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
      onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
      onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  
      onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
      onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
      onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  
      onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
      onend: ((this: SpeechRecognition, ev: Event) => any) | null;
    }
  
    interface SpeechRecognitionEvent extends Event {
      results: SpeechRecognitionResultList;
      resultIndex: number;
    }
  
    interface SpeechRecognitionErrorEvent extends Event {
      error: string; // e.g. "no-speech" | "audio-capture" | "not-allowed"
      message?: string;
    }
  
    interface SpeechRecognitionResultList {
      length: number;
      item(index: number): SpeechRecognitionResult;
      [index: number]: SpeechRecognitionResult;
    }
  
    interface SpeechRecognitionResult {
      isFinal: boolean;
      length: number;
      item(index: number): SpeechRecognitionAlternative;
      [index: number]: SpeechRecognitionAlternative;
    }
  
    interface SpeechRecognitionAlternative {
      transcript: string;
      confidence: number;
    }
  }
  
  export {};
  