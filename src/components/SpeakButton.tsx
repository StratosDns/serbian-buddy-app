import { Volume2 } from "lucide-react";
import { speakSerbian } from "@/lib/speak";

interface SpeakButtonProps {
  text: string;
  size?: "sm" | "md";
  className?: string;
}

const SpeakButton = ({ text, size = "sm", className = "" }: SpeakButtonProps) => (
  <button
    onClick={(e) => { e.stopPropagation(); speakSerbian(text); }}
    className={`inline-flex items-center justify-center rounded-md text-accent hover:text-accent/80 hover:bg-accent/10 transition-colors ${
      size === "sm" ? "h-6 w-6" : "h-8 w-8"
    } ${className}`}
    title="Listen to pronunciation"
    aria-label="Listen to pronunciation"
  >
    <Volume2 className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
  </button>
);

export default SpeakButton;
