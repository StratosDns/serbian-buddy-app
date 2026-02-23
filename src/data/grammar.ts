export interface PronounEntry {
  english: string;
  serbian: string;
  pronunciation: string;
}

export const personalPronouns: PronounEntry[] = [
  { english: "I", serbian: "ја", pronunciation: "ya" },
  { english: "you (singular)", serbian: "ти", pronunciation: "tee" },
  { english: "he", serbian: "он", pronunciation: "on" },
  { english: "she", serbian: "она", pronunciation: "oh-nah" },
  { english: "it", serbian: "оно", pronunciation: "oh-no" },
  { english: "we", serbian: "ми", pronunciation: "mee" },
  { english: "you (plural)", serbian: "ви", pronunciation: "vee" },
  { english: "they (masc.)", serbian: "они", pronunciation: "oh-nee" },
  { english: "they (fem.)", serbian: "оне", pronunciation: "oh-neh" },
  { english: "they (neut.)", serbian: "она", pronunciation: "oh-nah" },
];

export interface VerbBeEntry {
  pronoun: string;
  affirmative: string;
  negative: string;
  pronunciation: string;
}

export const verbToBe: VerbBeEntry[] = [
  { pronoun: "ја (I)", affirmative: "сам", negative: "нисам", pronunciation: "sahm / nee-sahm" },
  { pronoun: "ти (you)", affirmative: "си", negative: "ниси", pronunciation: "see / nee-see" },
  { pronoun: "он/она/оно (he/she/it)", affirmative: "је", negative: "није", pronunciation: "yeh / nee-yeh" },
  { pronoun: "ми (we)", affirmative: "смо", negative: "нисмо", pronunciation: "smo / nees-mo" },
  { pronoun: "ви (you pl.)", affirmative: "сте", negative: "нисте", pronunciation: "steh / nees-teh" },
  { pronoun: "они/оне/она (they)", affirmative: "су", negative: "нису", pronunciation: "soo / nee-soo" },
];

export interface GrammarNote {
  title: string;
  content: string;
}

export const grammarNotes: GrammarNote[] = [
  {
    title: "No Articles in Serbian!",
    content: "Unlike English, Serbian has NO articles (no 'a', 'an', or 'the'). The word 'кућа' (kuća) can mean 'house', 'a house', or 'the house' depending on context. This makes Serbian simpler in this regard!"
  },
  {
    title: "Gender in Serbian",
    content: "Serbian nouns have three genders: masculine, feminine, and neuter. Generally: masculine nouns end in a consonant (град - city), feminine nouns end in -а (жена - woman), and neuter nouns end in -о or -е (село - village)."
  },
  {
    title: "Word Order",
    content: "Serbian word order is relatively flexible compared to English, but the most common order is Subject-Verb-Object (SVO), same as English. However, emphasis can change the order."
  },
  {
    title: "Formal vs Informal 'You'",
    content: "Serbian distinguishes between informal 'ти' (ti - used with friends, family, children) and formal 'Ви' (Vi - used with strangers, elders, in professional settings). When in doubt, use 'Ви'!"
  },
];
