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

function pickSerbianVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  return voices.find((voice) => voice.lang.toLowerCase().startsWith("sr")) ?? null;
}

export function prepareSerbianSpeechText(text: string, hasSerbianVoice: boolean): string {
  const cleaned = cleanSpeakText(text);
  const latinText = hasCyrillic(cleaned) ? toLatin(cleaned) : cleaned;

  if (hasSerbianVoice) {
    return latinText;
  }

  // Fallback for environments without Serbian voices where diacritics are often skipped.
  return toSerbianSpeechFallback(latinText);
}

function buildUtterance(text: string, voice: SpeechSynthesisVoice | null): SpeechSynthesisUtterance {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = voice?.lang ?? "sr-RS";
  utterance.rate = 0.85;
  utterance.pitch = 1;

  if (voice) {
    utterance.voice = voice;
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

  if (synth.paused) {
    synth.resume();
  }

  // Reset current playback so repeated clicks replay reliably.
  synth.cancel();

  const voices = synth.getVoices();
  const serbianVoice = pickSerbianVoice(voices);
  const speechText = prepareSerbianSpeechText(text, Boolean(serbianVoice));

  synth.speak(buildUtterance(speechText, serbianVoice));

  // Some engines occasionally drop playback right after cancel(). Retry the *current*
  // request only, with a fresh utterance instance.
  retryTimeoutId = window.setTimeout(() => {
    if (requestId !== speechRequestId) {
      return;
    }

    if (synth.speaking || synth.pending) {
      return;
    }

    synth.cancel();
    synth.speak(buildUtterance(speechText, serbianVoice));
  }, 150);
}
