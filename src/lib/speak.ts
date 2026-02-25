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

export function speakSerbian(text: string): void {
  window.speechSynthesis.cancel();

  const cleaned = cleanSpeakText(text);
  const latinText = hasCyrillic(cleaned) ? toLatin(cleaned) : cleaned;

  const utterance = new SpeechSynthesisUtterance(latinText);
  utterance.lang = "sr-RS";
  utterance.rate = 0.85;
  utterance.pitch = 1;

  window.speechSynthesis.speak(utterance);
}
