import { hasCyrillic, toLatin } from "@/lib/transliterate";

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

export function resolveSpeechVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const serbianVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith("sr"));
  if (serbianVoice) return serbianVoice;

  return voices.find((voice) => voice.default) ?? voices[0] ?? null;
}

function buildUtterance(text: string, voice: SpeechSynthesisVoice | null): SpeechSynthesisUtterance {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.85;
  utterance.pitch = 1;

  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    // Use a broadly available language if no voice info is available yet.
    utterance.lang = "en-US";
  }

  return utterance;
}

export function speakSerbian(text: string): void {
  if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
    return;
  }

  const synth = window.speechSynthesis;

  if (synth.paused) {
    synth.resume();
  }

  const cleaned = cleanSpeakText(text);
  const latinText = hasCyrillic(cleaned) ? toLatin(cleaned) : cleaned;
  if (!latinText) {
    return;
  }

  if (retryTimeoutId) {
    window.clearTimeout(retryTimeoutId);
    retryTimeoutId = null;
  }

  const requestId = ++speechRequestId;
  const voice = resolveSpeechVoice(synth.getVoices());

  const speakNow = () => {
    // Interrupt ongoing playback so each click always plays immediately.
    if (synth.speaking || synth.pending) {
      synth.cancel();
    }

    synth.speak(buildUtterance(latinText, voice));
  };

  speakNow();

  // Some engines occasionally drop the first attempt; retry once for the latest request only.
  retryTimeoutId = window.setTimeout(() => {
    if (requestId !== speechRequestId) {
      return;
    }

    if (synth.speaking || synth.pending) {
      return;
    }

    synth.speak(buildUtterance(latinText, voice));
  }, 180);
}
