import { describe, it, expect } from "vitest";
import { cleanSpeakText, resolveSpeechVoice, normalizeSerbianLatin } from "@/lib/speak";

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

describe("normalizeSerbianLatin", () => {
  it("converts š to sh and Š to Sh", () => {
    expect(normalizeSerbianLatin("šta")).toBe("shta");
    expect(normalizeSerbianLatin("Šta")).toBe("Shta");
  });

  it("converts č to ch and Č to Ch", () => {
    expect(normalizeSerbianLatin("čaj")).toBe("chaj");
    expect(normalizeSerbianLatin("Čaj")).toBe("Chaj");
  });

  it("converts ž to zh and Ž to Zh", () => {
    expect(normalizeSerbianLatin("žena")).toBe("zhena");
    expect(normalizeSerbianLatin("Žena")).toBe("Zhena");
  });

  it("converts đ to dj and Đ to Dj", () => {
    expect(normalizeSerbianLatin("đak")).toBe("djak");
    expect(normalizeSerbianLatin("Đak")).toBe("Djak");
  });

  it("converts ć to ty and Ć to Ty", () => {
    expect(normalizeSerbianLatin("ćup")).toBe("tyup");
    expect(normalizeSerbianLatin("Ćup")).toBe("Tyup");
  });

  it("leaves plain ASCII text unchanged", () => {
    expect(normalizeSerbianLatin("dobro jutro")).toBe("dobro jutro");
  });

  it("handles mixed special and plain characters", () => {
    expect(normalizeSerbianLatin("Hvala lepo")).toBe("Hvala lepo");
    expect(normalizeSerbianLatin("Izvinjavam se")).toBe("Izvinjavam se");
    expect(normalizeSerbianLatin("šuma i čajnik")).toBe("shuma i chajnik");
  });
});
