// Cyrillic → Latin mapping (digraphs first)
const cyrillicToLatinMap: [string, string][] = [
  ["Љ", "Lj"], ["љ", "lj"],
  ["Њ", "Nj"], ["њ", "nj"],
  ["Џ", "Dž"], ["џ", "dž"],
  ["А", "a"], ["а", "a"],
  ["Б", "b"], ["б", "b"],
  ["В", "v"], ["в", "v"],
  ["Г", "g"], ["г", "g"],
  ["Д", "d"], ["д", "d"],
  ["Ђ", "đ"], ["ђ", "đ"],
  ["Е", "e"], ["е", "e"],
  ["Ж", "ž"], ["ж", "ž"],
  ["З", "z"], ["з", "z"],
  ["И", "i"], ["и", "i"],
  ["Ј", "j"], ["ј", "j"],
  ["К", "k"], ["к", "k"],
  ["Л", "l"], ["л", "l"],
  ["М", "m"], ["м", "m"],
  ["Н", "n"], ["н", "n"],
  ["О", "o"], ["о", "o"],
  ["П", "p"], ["п", "p"],
  ["Р", "r"], ["р", "r"],
  ["С", "s"], ["с", "s"],
  ["Т", "t"], ["т", "t"],
  ["Ћ", "ć"], ["ћ", "ć"],
  ["У", "u"], ["у", "u"],
  ["Ф", "f"], ["ф", "f"],
  ["Х", "h"], ["х", "h"],
  ["Ц", "c"], ["ц", "c"],
  ["Ч", "č"], ["ч", "č"],
  ["Ш", "š"], ["ш", "š"],
];

function buildCyrillicReplacer(map: [string, string][]) {
  const pattern = map.map(([k]) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const regex = new RegExp(pattern, "g");
  const lookup = new Map(map);
  return (text: string) => text.replace(regex, (m) => lookup.get(m) ?? m);
}

const applyCyrillicToLatin = buildCyrillicReplacer(cyrillicToLatinMap);

// Multi-character and single-character phonetic mapping (order matters — multi-char first)
const phoneticMap: [string, string][] = [
  ["lj", "lyuh"], ["Lj", "Lyuh"], ["LJ", "LYUH"],
  ["nj", "nyuh"], ["Nj", "Nyuh"], ["NJ", "NYUH"],
  ["dž", "j"],    ["Dž", "J"],    ["DŽ", "J"],
  ["č", "ch"],    ["Č", "Ch"],
  ["ć", "ch"],    ["Ć", "Ch"],
  ["š", "sh"],    ["Š", "Sh"],
  ["ž", "zh"],    ["Ž", "Zh"],
  ["đ", "dj"],    ["Đ", "Dj"],
  ["j", "y"],     ["J", "Y"],
  ["c", "ts"],    ["C", "Ts"],
  ["a", "ah"],    ["A", "Ah"],
  ["e", "eh"],    ["E", "Eh"],
  ["i", "ee"],    ["I", "Ee"],
  ["o", "oh"],    ["O", "Oh"],
  ["u", "oo"],    ["U", "Oo"],
];

function buildPhoneticReplacer(map: [string, string][]) {
  const pattern = map.map(([k]) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const regex = new RegExp(pattern, "g");
  const lookup = new Map(map);
  return (text: string) => text.replace(regex, (m) => lookup.get(m) ?? m);
}

const applyPhonetics = buildPhoneticReplacer(phoneticMap);

/**
 * Converts Serbian text (Latin or Cyrillic) into an English-pronounceable
 * phonetic approximation suitable for feeding to an English TTS engine.
 */
export function toPhoneticEnglish(serbianText: string): string {
  const latin = applyCyrillicToLatin(serbianText);
  return applyPhonetics(latin);
}
