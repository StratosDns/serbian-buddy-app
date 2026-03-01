import { useEffect, useMemo, useRef, useState } from "react";
import { Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";

type TextTarget = HTMLInputElement | HTMLTextAreaElement;

type QuickOption = {
  base: string;
  value: string;
};

const BASE_TO_OPTIONS: Record<string, string[]> = {
  c: ["č", "ć"],
  d: ["đ"],
  s: ["š"],
  z: ["ž"],
};

const KEYBOARD_CHARS = ["č", "ć", "đ", "š", "ž", "Č", "Ć", "Đ", "Š", "Ž"];

const NON_TEXT_INPUT_TYPES = new Set([
  "button",
  "checkbox",
  "color",
  "file",
  "hidden",
  "image",
  "radio",
  "range",
  "reset",
  "submit",
]);

function isTextTarget(element: EventTarget | null): element is TextTarget {
  if (!element) return false;

  if (element instanceof HTMLTextAreaElement) {
    return !element.readOnly && !element.disabled;
  }

  if (element instanceof HTMLInputElement) {
    const type = (element.type || "text").toLowerCase();
    return !NON_TEXT_INPUT_TYPES.has(type) && !element.readOnly && !element.disabled;
  }

  return false;
}

function setNativeTextValue(target: TextTarget, value: string) {
  const prototype = Object.getPrototypeOf(target);
  const descriptor = Object.getOwnPropertyDescriptor(prototype, "value");
  descriptor?.set?.call(target, value);
  target.dispatchEvent(new Event("input", { bubbles: true }));
}

function insertAtCursor(target: TextTarget, text: string) {
  const start = target.selectionStart ?? target.value.length;
  const end = target.selectionEnd ?? target.value.length;
  const nextValue = `${target.value.slice(0, start)}${text}${target.value.slice(end)}`;
  setNativeTextValue(target, nextValue);

  const caret = start + text.length;
  target.setSelectionRange(caret, caret);
  target.focus();
}

function replaceCharacterBeforeCursor(target: TextTarget, expectedBase: string, replacement: string) {
  const start = target.selectionStart ?? target.value.length;
  const end = target.selectionEnd ?? target.value.length;

  if (start < 1 || start !== end) {
    insertAtCursor(target, replacement);
    return;
  }

  const previousCharacter = target.value[start - 1] ?? "";
  if (previousCharacter.toLowerCase() !== expectedBase.toLowerCase()) {
    insertAtCursor(target, replacement);
    return;
  }

  const nextValue = `${target.value.slice(0, start - 1)}${replacement}${target.value.slice(start)}`;
  setNativeTextValue(target, nextValue);

  const caret = start;
  target.setSelectionRange(caret, caret);
  target.focus();
}

export function SerbianKeyboardAssist() {
  const [activeTarget, setActiveTarget] = useState<TextTarget | null>(null);
  const [open, setOpen] = useState(false);
  const [quickOptions, setQuickOptions] = useState<QuickOption[]>([]);
  const [quickPosition, setQuickPosition] = useState({ left: 0, top: 0 });
  const hideTimeoutRef = useRef<number | null>(null);
  const activeTargetRef = useRef<TextTarget | null>(null);
  const quickOptionsRef = useRef<QuickOption[]>([]);

  const hasTarget = Boolean(activeTarget);

  const quickVisible = useMemo(() => quickOptions.length > 0 && hasTarget, [quickOptions.length, hasTarget]);

  useEffect(() => {
    activeTargetRef.current = activeTarget;
  }, [activeTarget]);

  useEffect(() => {
    quickOptionsRef.current = quickOptions;
  }, [quickOptions]);

  useEffect(() => {
    const onFocusIn = (event: FocusEvent) => {
      if (isTextTarget(event.target)) {
        setActiveTarget(event.target);
      }
    };

    const onFocusOut = (event: FocusEvent) => {
      if (isTextTarget(event.target)) {
        window.setTimeout(() => {
          const focused = document.activeElement;
          if (!isTextTarget(focused)) {
            setActiveTarget(null);
            setQuickOptions([]);
          }
        }, 0);
      }
    };

    const onInput = (event: Event) => {
      if (!(event instanceof InputEvent) || !isTextTarget(event.target)) {
        return;
      }

      const typed = event.data;
      if (!typed || typed.length !== 1) {
        setQuickOptions([]);
        return;
      }

      const isUpper = typed === typed.toUpperCase() && typed !== typed.toLowerCase();
      const options = BASE_TO_OPTIONS[typed.toLowerCase()];

      if (!options) {
        setQuickOptions([]);
        return;
      }

      const mappedOptions = options.map((option) => ({
        base: typed,
        value: isUpper ? option.toUpperCase() : option,
      }));

      const rect = event.target.getBoundingClientRect();
      setQuickPosition({
        left: rect.left + rect.width / 2,
        top: rect.bottom + 10,
      });
      setQuickOptions(mappedOptions);

      if (hideTimeoutRef.current) {
        window.clearTimeout(hideTimeoutRef.current);
      }
      hideTimeoutRef.current = window.setTimeout(() => setQuickOptions([]), 2500);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const focusedTarget = activeTargetRef.current;
      const availableOptions = quickOptionsRef.current;

      if (!focusedTarget || availableOptions.length === 0) {
        return;
      }

      event.preventDefault();
      replaceCharacterBeforeCursor(focusedTarget, availableOptions[0].base, availableOptions[0].value);
      setQuickOptions([]);
    };

    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    document.addEventListener("input", onInput, true);
    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
      document.removeEventListener("input", onInput, true);
      document.removeEventListener("keydown", onKeyDown, true);
      if (hideTimeoutRef.current) {
        window.clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  const handleInsert = (char: string) => {
    if (!activeTarget) return;
    insertAtCursor(activeTarget, char);
  };

  const handleQuickOption = (option: QuickOption) => {
    if (!activeTarget) return;
    replaceCharacterBeforeCursor(activeTarget, option.base, option.value);
    setQuickOptions([]);
  };

  return (
    <>
      {quickVisible && (
        <div
          className="pointer-events-none fixed z-50"
          style={{
            left: quickPosition.left,
            top: quickPosition.top,
            transform: "translate(-50%, 0)",
          }}
        >
          <div className="pointer-events-auto flex items-center gap-1 rounded-full border bg-background/95 px-2 py-1 shadow-lg backdrop-blur">
            {quickOptions.map((option) => (
              <button
                key={`${option.base}-${option.value}`}
                type="button"
                className="rounded-full border bg-muted px-2 py-1 text-xs font-semibold text-foreground transition hover:bg-accent"
                onMouseDown={(event) => {
                  event.preventDefault();
                  handleQuickOption(option);
                }}
              >
                {option.value}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="fixed bottom-20 right-4 z-50 flex items-end gap-2">
        {open && (
          <div className="rounded-2xl border bg-background/95 p-3 shadow-xl backdrop-blur">
            <div className="grid grid-cols-5 gap-2">
              {KEYBOARD_CHARS.map((char) => (
                <button
                  key={char}
                  type="button"
                  className="h-9 w-9 rounded-md border bg-muted text-sm font-semibold text-foreground transition hover:bg-accent"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    handleInsert(char);
                  }}
                  title={`Insert ${char}`}
                >
                  {char}
                </button>
              ))}
            </div>
          </div>
        )}

        <Button
          type="button"
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle Serbian keyboard"
        >
          <Keyboard className="h-5 w-5" />
        </Button>
      </div>
    </>
  );
}
