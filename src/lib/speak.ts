import { hasCyrillic, toLatin } from "@/lib/transliterate";

export function speakSerbian(text: string): void {
  window.speechSynthesis.cancel();

  const latinText = hasCyrillic(text) ? toLatin(text) : text;

  const utterance = new SpeechSynthesisUtterance(latinText);
  utterance.lang = "sr-RS";
  utterance.rate = 0.85;
  utterance.pitch = 1;

  window.speechSynthesis.speak(utterance);
}
