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

export function resolveSpeechVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const serbianVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith("sr"));
  if (serbianVoice) return serbianVoice;

  return voices.find((voice) => voice.default) ?? voices[0] ?? null;
}

export function speakSerbian(text: string): void {
  if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
    return;
  }

  const synth = window.speechSynthesis;

  const cleaned = cleanSpeakText(text);
  const latinText = hasCyrillic(cleaned) ? toLatin(cleaned) : cleaned;
  if (!latinText) {
    return;
  }

  const voice = resolveSpeechVoice(synth.getVoices());

  // Cancel only when active, avoiding flaky behavior in some engines when idle.
  if (synth.speaking || synth.pending) {
    synth.cancel();
  }

  const utterance = new SpeechSynthesisUtterance(latinText);
  utterance.rate = 0.85;
  utterance.pitch = 1;

  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    // Use a broadly available language if no voice info is available yet.
    utterance.lang = "en-US";
  }

  synth.speak(utterance);
}
