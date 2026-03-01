import { hasCyrillic, toLatin } from "@/lib/transliterate";

let currentAudio: HTMLAudioElement | null = null;

export function cleanSpeakText(text: string): string {
  let cleaned = text;

  // If text contains " / " dual-script separator, keep only the first part
  if (cleaned.includes(" / ")) {
    cleaned = cleaned.split(" / ")[0];
  }

  // Remove parenthetical content (e.g. English translations like "(This is my book.)")
  cleaned = cleaned.replace(/\([^)]*\)/g, "");

  // Remove blank placeholders (sequences of underscores)
  cleaned = cleaned.replace(/_+/g, "");

  // Collapse multiple spaces and trim
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  return cleaned;
}

export function prepareSerbianSpeechText(text: string): string {
  const cleaned = cleanSpeakText(text);
  return hasCyrillic(cleaned) ? toLatin(cleaned) : cleaned;
}

export function speakSerbian(text: string): void {
  const speechText = prepareSerbianSpeechText(text);
  if (!speechText) return;

  // Stop any currently playing audio
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

  const url =
    `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=sr&q=${encodeURIComponent(speechText)}`;

  const audio = new Audio(url);
  currentAudio = audio;

  audio.play().catch((err) => {
    console.warn("speakSerbian: audio playback failed", err);
  });
}
