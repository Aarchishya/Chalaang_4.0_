// src/types/index.ts

export interface VoiceCommand {
    command: string;
    confidence: number;
  }
  
  export interface Response {
    text: string;
    audioUrl?: string;
  }
  