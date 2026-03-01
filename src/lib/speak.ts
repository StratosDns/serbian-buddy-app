import { hasCyrillic, toLatin } from "@/lib/transliterate";

const SERBIAN_FALLBACK_REPLACEMENTS: Array<[RegExp, string]> = [
  [/Dž/g, "J"],
  [/dž/g, "j"],
  [/Lj/g, "Ly"],
  [/lj/g, "ly"],
  [/Nj/g, "Ny"],
  [/nj/g, "ny"],
  [/Đ/g, "Dj"],
  [/đ/g, "dj"],
  [/Ž/g, "Zh"],
  [/ž/g, "zh"],
  [/Š/g, "Sh"],
  [/š/g, "sh"],
  [/Č/g, "Ch"],
  [/č/g, "ch"],
  [/Ć/g, "Ch"],
  [/ć/g, "ch"],
];

export function cleanSpeakText(text: string): string {
  let cleaned = text;

  if (cleaned.includes(" / ")) {
    cleaned = cleaned.split(" / ")[0];
  }

  cleaned = cleaned.replace(/\([^)]*\)/g, "");
  cleaned = cleaned.replace(/_+/g, "");
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  return cleaned;
}

function applyFallbackPronunciation(text: string): string {
  return SERBIAN_FALLBACK_REPLACEMENTS.reduce((result, [pattern, replacement]) => {
    return result.replace(pattern, replacement);
  }, text);
}

export function resolveSpeechVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const serbianVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith("sr"));
  if (serbianVoice) {
    return serbianVoice;
  }

  const defaultVoice = voices.find((voice) => voice.default);
  return defaultVoice ?? voices[0] ?? null;
}

export function prepareSerbianSpeechText(text: string, hasSerbianVoice: boolean): string {
  const cleaned = cleanSpeakText(text);
  const latin = hasCyrillic(cleaned) ? toLatin(cleaned) : cleaned;

  if (hasSerbianVoice) {
    return latin;
  }

  return applyFallbackPronunciation(latin);
}

export function speakSerbian(text: string): void {
  if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
    return;
  }

  const synth = window.speechSynthesis;

  if (synth.paused) {
    synth.resume();
  }

  const voice = resolveSpeechVoice(synth.getVoices());
  const hasSerbianVoice = Boolean(voice?.lang.toLowerCase().startsWith("sr"));
  const speechText = prepareSerbianSpeechText(text, hasSerbianVoice);

  if (!speechText) {
    return;
  }

  const utterance = new SpeechSynthesisUtterance(speechText);
  utterance.rate = 0.85;
  utterance.pitch = 1;

  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = "en-US";
  }

  synth.cancel();
  synth.speak(utterance);
}
