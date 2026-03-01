import { describe, it, expect } from "vitest";
import { cleanSpeakText, hasSerbianVoice, prepareSerbianSpeechText } from "@/lib/speak";

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

describe("hasSerbianVoice", () => {
  it("returns true when a Serbian voice exists", () => {
    const voices = [{ lang: "en-US" }, { lang: "sr-RS" }] as SpeechSynthesisVoice[];
    expect(hasSerbianVoice(voices)).toBe(true);
  });

  it("returns false when no Serbian voice exists", () => {
    const voices = [{ lang: "en-US" }, { lang: "de-DE" }] as SpeechSynthesisVoice[];
    expect(hasSerbianVoice(voices)).toBe(false);
  });
});

describe("prepareSerbianSpeechText", () => {
  it("keeps Serbian letters when fallback is disabled", () => {
    expect(prepareSerbianSpeechText("Želim da pričam srpski", false)).toBe(
      "Želim da pričam srpski"
    );
  });

  it("converts special Serbian letters to fallback sounds when enabled", () => {
    expect(prepareSerbianSpeechText("žđšćč dž nj lj", true)).toBe(
      "zhdjshchch j ny ly"
    );
  });
});
