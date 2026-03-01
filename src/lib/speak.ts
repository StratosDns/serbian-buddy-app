import { hasCyrillic, toLatin } from "@/lib/transliterate";

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

// Map special Serbian Latin characters to phonetic ASCII equivalents so that
// non-Serbian TTS voices can pronounce them correctly.
// Note: ć (/tɕ/, soft palatal) and č (/tʃ/, harder post-alveolar) are distinct
// sounds in Serbian. English TTS cannot perfectly reproduce ć; "ty" (as in "nature")
// is used as a closer approximation than "ch" to help distinguish the two.
export function normalizeSerbianLatin(text: string): string {
  return text
    .replace(/Š/g, "Sh").replace(/š/g, "sh")
    .replace(/Č/g, "Ch").replace(/č/g, "ch")
    .replace(/Ž/g, "Zh").replace(/ž/g, "zh")
    .replace(/Đ/g, "Dj").replace(/đ/g, "dj")
    .replace(/Ć/g, "Ty").replace(/ć/g, "ty");
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

  // Always cancel before speaking to reset the synthesis queue.
  // Some browsers (e.g. Chrome) stall on subsequent speak() calls without this.
  synth.cancel();

  const isSerbianVoice = voice?.lang.toLowerCase().startsWith("sr") ?? false;
  // Only normalise special Serbian Latin characters when no Serbian voice is
  // available; a Serbian voice already knows how to pronounce them.
  const spokenText = isSerbianVoice ? latinText : normalizeSerbianLatin(latinText);

  const utterance = new SpeechSynthesisUtterance(spokenText);
  utterance.rate = 0.85;
  utterance.pitch = 1;

  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    // Use a broadly available language if no voice info is available yet.
    utterance.lang = "en-US";
  }

  // Use setTimeout so the browser has time to fully process cancel() before
  // the new utterance begins. This fixes a Chrome bug where the synthesis
  // stalls on every call after the first.
  setTimeout(() => {
    synth.speak(utterance);
  }, 100);
}
