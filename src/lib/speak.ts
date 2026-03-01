import { hasCyrillic, toLatin } from "@/lib/transliterate";

const SERBIAN_LATIN_FALLBACK_MAP: Array<[RegExp, string]> = [
  [/Dž/g, "J"],
  [/dž/g, "j"],
  [/Lj/g, "Ly"],
  [/lj/g, "ly"],
  [/Nj/g, "Ny"],
  [/nj/g, "ny"],
  [/Đ/g, "Dj"],
  [/đ/g, "dj"],
  [/Č/g, "Ch"],
  [/č/g, "ch"],
  [/Ć/g, "Ch"],
  [/ć/g, "ch"],
  [/Š/g, "Sh"],
  [/š/g, "sh"],
  [/Ž/g, "Zh"],
  [/ž/g, "zh"],
];

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

function toSerbianSpeechFallback(latinText: string): string {
  return SERBIAN_LATIN_FALLBACK_MAP.reduce((result, [pattern, replacement]) => {
    return result.replace(pattern, replacement);
  }, latinText);
}

export function resolveSpeechVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const serbianVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith("sr"));
  if (serbianVoice) return serbianVoice;

  return voices.find((voice) => voice.default) ?? voices[0] ?? null;
}

export function prepareSerbianSpeechText(text: string, hasSerbianVoice: boolean): string {
  const cleaned = cleanSpeakText(text);
  const latinText = hasCyrillic(cleaned) ? toLatin(cleaned) : cleaned;
  if (!latinText) {
    return;
  }

  if (hasSerbianVoice) {
    return latinText;
  }

  return toSerbianSpeechFallback(latinText);
}

  if (hasSerbianVoice) {
    return latinText;
  }

  return toSerbianSpeechFallback(latinText);
}

export function speakSerbian(text: string): void {
  if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
    return;
  }

  const synth = window.speechSynthesis;

  // Keep the engine active if it was previously paused by the browser.
  if (synth.paused) {
    synth.resume();
  }

  const voice = resolveSpeechVoice(synth.getVoices());
  const hasSerbianVoice = Boolean(voice?.lang.toLowerCase().startsWith("sr"));
  const speechText = prepareSerbianSpeechText(text, hasSerbianVoice);

  if (!speechText) {
    return;
  }

  // Return to the previously stable behavior: explicit reset then immediate play.
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(speechText);
  utterance.rate = 0.85;
  utterance.pitch = 1;

  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = hasSerbianVoice ? "sr-RS" : "en-US";
  }

  synth.speak(utterance);
}
