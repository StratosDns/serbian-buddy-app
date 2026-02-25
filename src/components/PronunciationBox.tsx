import { useState } from "react";
import { Volume2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { hasCyrillic, toCyrillic, toLatin } from "@/lib/transliterate";
import { speakSerbian } from "@/lib/speak";

const PronunciationBox = () => {
  const [open, setOpen] = useState(false);
  const [word, setWord] = useState("");

  const transliterated = word
    ? hasCyrillic(word)
      ? toLatin(word)
      : toCyrillic(word)
    : "";

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="rounded-2xl border border-border bg-card shadow-lg p-4 w-72"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-display text-sm font-semibold text-foreground">Pronunciation</span>
              <button
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close pronunciation box"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                placeholder="Type a Serbian word…"
                className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
              <button
                onClick={() => word && speakSerbian(word)}
                disabled={!word}
                className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-accent text-accent-foreground hover:bg-accent/80 disabled:opacity-40 transition-colors"
                aria-label="Play pronunciation"
              >
                <Volume2 className="h-4 w-4" />
              </button>
            </div>
            {transliterated && (
              <p className="mt-2 text-xs text-muted-foreground">
                {hasCyrillic(word) ? "Latin: " : "Cyrillic: "}
                <span className="font-medium text-foreground">{transliterated}</span>
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg hover:bg-accent/80 transition-colors"
        aria-label="Toggle pronunciation box"
        title="Pronunciation lookup"
      >
        <Volume2 className="h-5 w-5" />
      </button>
    </div>
  );
};

export default PronunciationBox;
