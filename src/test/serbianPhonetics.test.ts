import { describe, it, expect } from "vitest";
import { toPhoneticEnglish } from "@/lib/serbianPhonetics";

describe("toPhoneticEnglish", () => {
  it("converts Serbian Latin vowels", () => {
    expect(toPhoneticEnglish("a")).toBe("ah");
    expect(toPhoneticEnglish("e")).toBe("eh");
    expect(toPhoneticEnglish("i")).toBe("ee");
    expect(toPhoneticEnglish("o")).toBe("oh");
    expect(toPhoneticEnglish("u")).toBe("oo");
  });

  it("converts Serbian special consonants", () => {
    expect(toPhoneticEnglish("č")).toBe("ch");
    expect(toPhoneticEnglish("ć")).toBe("ch");
    expect(toPhoneticEnglish("š")).toBe("sh");
    expect(toPhoneticEnglish("ž")).toBe("zh");
    expect(toPhoneticEnglish("đ")).toBe("dj");
    expect(toPhoneticEnglish("j")).toBe("y");
    expect(toPhoneticEnglish("c")).toBe("ts");
  });

  it("converts digraphs before single characters", () => {
    expect(toPhoneticEnglish("lj")).toBe("lyuh");
    expect(toPhoneticEnglish("nj")).toBe("nyuh");
    expect(toPhoneticEnglish("dž")).toBe("j");
  });

  it("handles uppercase", () => {
    expect(toPhoneticEnglish("Č")).toBe("Ch");
    expect(toPhoneticEnglish("Š")).toBe("Sh");
    expect(toPhoneticEnglish("Lj")).toBe("Lyuh");
    expect(toPhoneticEnglish("Nj")).toBe("Nyuh");
    expect(toPhoneticEnglish("Dž")).toBe("J");
  });

  it("converts whole words (Latin examples from problem statement)", () => {
    expect(toPhoneticEnglish("zdravo")).toBe("zdrahvoh");
    expect(toPhoneticEnglish("ćevapi")).toBe("chehvahpee");
    expect(toPhoneticEnglish("ljubav")).toBe("lyuhoobahv");
    expect(toPhoneticEnglish("njiva")).toBe("nyuheevah");
    expect(toPhoneticEnglish("džep")).toBe("jehp");
    expect(toPhoneticEnglish("ja")).toBe("yah");
  });

  it("converts Cyrillic text", () => {
    expect(toPhoneticEnglish("цвет")).toBe("tsveht");
  });

  it("preserves spaces and punctuation", () => {
    expect(toPhoneticEnglish("ja sam")).toBe("yah sahm");
    expect(toPhoneticEnglish("zdravo!")).toBe("zdrahvoh!");
  });

  it("passes through unrecognized characters unchanged", () => {
    expect(toPhoneticEnglish("123")).toBe("123");
    expect(toPhoneticEnglish("b")).toBe("b");
    expect(toPhoneticEnglish("d")).toBe("d");
  });
});
