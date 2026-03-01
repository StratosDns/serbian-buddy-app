import { describe, it, expect } from "vitest";
import { cleanSpeakText, resolveSpeechVoice } from "@/lib/speak";

describe("cleanSpeakText", () => {
  it("keeps plain Serbian text unchanged", () => {
    expect(cleanSpeakText("Hvala")).toBe("Hvala");
  });

  it("keeps only the first part of dual-script text separated by ' / '", () => {
    expect(cleanSpeakText("Извините / Izvinite")).toBe("Извините");
    expect(cleanSpeakText("Хвала / Hvala")).toBe("Хвала");
  });

  it("removes parenthetical English translations", () => {
    expect(cleanSpeakText("је моја књига. (This is my book.)")).toBe(
      "је моја књига."
    );
  });

  it("removes blank placeholders (underscores)", () => {
    expect(cleanSpeakText("_____ је моја књига.")).toBe("је моја књига.");
  });

  it("removes both blanks and parentheticals together", () => {
    expect(
      cleanSpeakText("_____ је моја књига. (This is my book.)")
    ).toBe("је моја књига.");
  });

  it("trims extra whitespace after cleaning", () => {
    expect(cleanSpeakText("  Dobro  jutro  ")).toBe("Dobro jutro");
  });

  it("handles dual-script text that also has parenthetical content", () => {
    expect(cleanSpeakText("Извини / Izvini (Excuse me)")).toBe("Извини");
  });
});

describe("resolveSpeechVoice", () => {
  it("prefers a Serbian voice when available", () => {
    const voices = [
      { lang: "en-US", default: true },
      { lang: "sr-RS", default: false },
    ] as SpeechSynthesisVoice[];

    expect(resolveSpeechVoice(voices)?.lang).toBe("sr-RS");
  });

  it("falls back to default voice when Serbian voice is missing", () => {
    const voices = [
      { lang: "en-US", default: true },
      { lang: "de-DE", default: false },
    ] as SpeechSynthesisVoice[];

    expect(resolveSpeechVoice(voices)?.lang).toBe("en-US");
  });
});
