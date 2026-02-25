// Serbian Latin → Cyrillic mapping; digraphs must appear before their single-character components
const latinToCyrillicMap: [string, string][] = [
  ["Lj", "Љ"], ["lj", "љ"],
  ["Nj", "Њ"], ["nj", "њ"],
  ["Dž", "Џ"], ["dž", "џ"],
  ["A", "А"], ["a", "а"],
  ["B", "Б"], ["b", "б"],
  ["V", "В"], ["v", "в"],
  ["G", "Г"], ["g", "г"],
  ["D", "Д"], ["d", "д"],
  ["Đ", "Ђ"], ["đ", "ђ"],
  ["E", "Е"], ["e", "е"],
  ["Ž", "Ж"], ["ž", "ж"],
  ["Z", "З"], ["z", "з"],
  ["I", "И"], ["i", "и"],
  ["J", "Ј"], ["j", "ј"],
  ["K", "К"], ["k", "к"],
  ["L", "Л"], ["l", "л"],
  ["M", "М"], ["m", "м"],
  ["N", "Н"], ["n", "н"],
  ["O", "О"], ["o", "о"],
  ["P", "П"], ["p", "п"],
  ["R", "Р"], ["r", "р"],
  ["S", "С"], ["s", "с"],
  ["T", "Т"], ["t", "т"],
  ["Ć", "Ћ"], ["ć", "ћ"],
  ["U", "У"], ["u", "у"],
  ["F", "Ф"], ["f", "ф"],
  ["H", "Х"], ["h", "х"],
  ["C", "Ц"], ["c", "ц"],
  ["Č", "Ч"], ["č", "ч"],
  ["Š", "Ш"], ["š", "ш"],
];

// Serbian Cyrillic → Latin mapping; digraphs (multi-char Cyrillic) first
const cyrillicToLatinMap: [string, string][] = [
  ["Љ", "Lj"], ["љ", "lj"],
  ["Њ", "Nj"], ["њ", "nj"],
  ["Џ", "Dž"], ["џ", "dž"],
  ["А", "A"], ["а", "a"],
  ["Б", "B"], ["б", "b"],
  ["В", "V"], ["в", "v"],
  ["Г", "G"], ["г", "g"],
  ["Д", "D"], ["д", "d"],
  ["Ђ", "Đ"], ["ђ", "đ"],
  ["Е", "E"], ["е", "e"],
  ["Ж", "Ž"], ["ж", "ž"],
  ["З", "Z"], ["з", "z"],
  ["И", "I"], ["и", "i"],
  ["Ј", "J"], ["ј", "j"],
  ["К", "K"], ["к", "k"],
  ["Л", "L"], ["л", "l"],
  ["М", "M"], ["м", "m"],
  ["Н", "N"], ["н", "n"],
  ["О", "O"], ["о", "o"],
  ["П", "P"], ["п", "p"],
  ["Р", "R"], ["р", "r"],
  ["С", "S"], ["с", "s"],
  ["Т", "T"], ["т", "t"],
  ["Ћ", "Ć"], ["ћ", "ć"],
  ["У", "U"], ["у", "u"],
  ["Ф", "F"], ["ф", "f"],
  ["Х", "H"], ["х", "h"],
  ["Ц", "C"], ["ц", "c"],
  ["Ч", "Č"], ["ч", "č"],
  ["Ш", "Š"], ["ш", "š"],
];

function buildReplacer(map: [string, string][]) {
  const pattern = map.map(([k]) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const regex = new RegExp(pattern, "g");
  const lookup = new Map(map);
  return (text: string) => text.replace(regex, (m) => lookup.get(m) ?? m);
}

const applyLatinToCyrillic = buildReplacer(latinToCyrillicMap);
const applyCyrillicToLatin = buildReplacer(cyrillicToLatinMap);

export const hasCyrillic = (text: string): boolean => /\p{Script=Cyrillic}/u.test(text);

export function toCyrillic(text: string): string {
  return applyLatinToCyrillic(text);
}

export function toLatin(text: string): string {
  return applyCyrillicToLatin(text);
}
