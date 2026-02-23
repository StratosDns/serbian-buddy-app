import { personalPronouns, verbToBe, grammarNotes } from "@/data/grammar";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";

const Grammar = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold text-foreground md:text-5xl">
            Grammar <span className="text-gradient-gold">Basics</span>
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            Master the foundational grammar: pronouns, the verb "to be", and essential rules.
          </p>
        </motion.div>

        {/* Grammar Notes */}
        <div className="grid gap-4 md:grid-cols-2 mb-12">
          {grammarNotes.map((note, i) => (
            <motion.div
              key={note.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-5"
            >
              <h3 className="font-display text-lg font-bold text-foreground mb-2">💡 {note.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{note.content}</p>
            </motion.div>
          ))}
        </div>

        {/* Personal Pronouns */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-12">
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">Personal Pronouns</h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="px-4 py-3 text-left text-sm font-semibold">English</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Serbian (Cyrillic)</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Pronunciation</th>
                </tr>
              </thead>
              <tbody>
                {personalPronouns.map((p, i) => (
                  <tr key={p.english} className={i % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{p.english}</td>
                    <td className="px-4 py-3 text-sm font-display font-semibold text-foreground">{p.serbian}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground italic">{p.pronunciation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Verb To Be */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            The Verb "To Be" — <span className="text-gradient-gold">бити</span>
          </h2>
          <p className="text-muted-foreground mb-4">The most important verb in Serbian. Note: the affirmative forms are enclitic (unstressed) and never start a sentence.</p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="px-4 py-3 text-left text-sm font-semibold">Pronoun</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Affirmative</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Negative</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Pronunciation</th>
                </tr>
              </thead>
              <tbody>
                {verbToBe.map((v, i) => (
                  <tr key={v.pronoun} className={i % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{v.pronoun}</td>
                    <td className="px-4 py-3 text-sm font-display font-semibold text-success">{v.affirmative}</td>
                    <td className="px-4 py-3 text-sm font-display font-semibold text-destructive">{v.negative}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground italic">{v.pronunciation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 rounded-xl border border-border bg-card p-5">
            <h3 className="font-display text-lg font-bold text-foreground mb-3">Example Sentences</h3>
            <div className="space-y-3 text-sm">
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <span className="font-display font-semibold text-foreground">Ја сам студент.</span>
                <span className="text-muted-foreground">— I am a student.</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <span className="font-display font-semibold text-foreground">Она није из Србије.</span>
                <span className="text-muted-foreground">— She is not from Serbia.</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <span className="font-display font-semibold text-foreground">Ми смо срећни.</span>
                <span className="text-muted-foreground">— We are happy.</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <span className="font-display font-semibold text-foreground">Да ли сте ви из Америке?</span>
                <span className="text-muted-foreground">— Are you from America? (formal)</span>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </Layout>
  );
};

export default Grammar;
