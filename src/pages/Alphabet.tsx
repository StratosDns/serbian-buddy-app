import { serbianAlphabet } from "@/data/alphabet";
import Layout from "@/components/Layout";
import SpeakButton from "@/components/SpeakButton";
import { motion } from "framer-motion";

const Alphabet = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h1 className="font-display text-4xl font-bold text-foreground md:text-5xl">
            The Serbian <span className="text-gradient-gold">Alphabet</span>
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            Serbian uses two scripts: <strong>Cyrillic</strong> (official) and <strong>Latin</strong>. 
            Each letter has exactly one sound — what you see is what you pronounce!
          </p>
        </motion.div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {serbianAlphabet.map((letter, i) => (
            <motion.div
              key={letter.cyrillic}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="group card-hover rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-display text-xl font-bold">
                  {letter.cyrillic.split(" ")[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-lg font-semibold text-foreground">
                      {letter.cyrillic}
                    </span>
                    <span className="text-sm text-muted-foreground">/ {letter.latin}</span>
                  </div>
                  <p className="text-sm text-accent font-medium">{letter.sound}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold">{letter.example}</span> — {letter.exampleTranslation}
                    </p>
                    <SpeakButton text={letter.example} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-2xl font-bold text-foreground mb-3">Key Facts</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>✅ Serbian has <strong>30 letters</strong> — each represents exactly one sound</li>
            <li>✅ It's a <strong>phonetic language</strong> — you read exactly as you write</li>
            <li>✅ Both Cyrillic and Latin scripts are used interchangeably in daily life</li>
            <li>✅ Cyrillic is the official script, but Latin is equally common</li>
            <li>✅ The principle: <em>"Write as you speak, read as it is written"</em> — Vuk Karadžić</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Alphabet;
