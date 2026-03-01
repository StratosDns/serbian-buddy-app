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

let retryTimeoutId: number | null = null;
let startTimeoutId: number | null = null;
let speechRequestId = 0;

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

function buildUtterance(text: string, voice: SpeechSynthesisVoice | null): SpeechSynthesisUtterance {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.85;
  utterance.pitch = 1;

  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = "en-US";
  }

  return utterance;
}

export function speakSerbian(text: string): void {
  if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
    return;
  }

  const synth = window.speechSynthesis;
  const requestId = ++speechRequestId;

  if (retryTimeoutId) {
    window.clearTimeout(retryTimeoutId);
    retryTimeoutId = null;
  }

  if (startTimeoutId) {
    window.clearTimeout(startTimeoutId);
    startTimeoutId = null;
  }

  if (synth.paused) {
    synth.resume();
  }

  const voices = synth.getVoices();
  const voice = resolveSpeechVoice(voices);
  const hasSerbianVoice = Boolean(voice?.lang.toLowerCase().startsWith("sr"));
  const speechText = prepareSerbianSpeechText(text, hasSerbianVoice);

  if (!speechText) {
    return;
  }

  const speakNow = () => {
    if (requestId !== speechRequestId) {
      return;
    }

    synth.speak(buildUtterance(speechText, voice));
  };

  // Cancel ongoing queue/speech, then start slightly after to avoid race conditions
  // where engines ignore immediate speak() right after cancel().
  if (synth.speaking || synth.pending) {
    synth.cancel();
    startTimeoutId = window.setTimeout(speakNow, 35);
  } else {
    speakNow();
  }

  // Retry once only for the latest request if nothing actually started.
  retryTimeoutId = window.setTimeout(() => {
    if (requestId !== speechRequestId) {
      return;
    }

    if (synth.speaking || synth.pending) {
      return;
    }

    synth.cancel();
    synth.speak(buildUtterance(speechText, voice));
  }, 220);
}
