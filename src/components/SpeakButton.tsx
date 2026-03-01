import { useState, useCallback } from "react";
import { Volume2, Volume1 } from "lucide-react";
import { motion } from "framer-motion";

interface SpeakButtonProps {
  text: string;
}

const SpeakButton = ({ text }: SpeakButtonProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  const handleSpeak = useCallback(() => {
    if (!supported) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "sr-RS";
    utterance.rate = 0.85;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [text, supported, isSpeaking]);

  if (!supported) return null;

  return (
    <motion.button
      whileTap={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      onClick={handleSpeak}
      aria-label="Listen to pronunciation"
      title="Listen to pronunciation"
      className={`shrink-0 rounded p-0.5 transition-colors ${
        isSpeaking
          ? "text-accent"
          : "text-muted-foreground hover:text-accent"
      }`}
    >
      {isSpeaking ? (
        <Volume2 className="h-4 w-4" />
      ) : (
        <Volume1 className="h-4 w-4" />
      )}
    </motion.button>
  );
};

export default SpeakButton;
