import { useParams, Link } from "react-router-dom";
import { lessons, levelLabels, levelColors } from "@/data/lessons";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Volume2 } from "lucide-react";

const LessonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const lesson = lessons.find((l) => l.id === id);
  const lessonIndex = lessons.findIndex((l) => l.id === id);
  const prevLesson = lessonIndex > 0 ? lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < lessons.length - 1 ? lessons[lessonIndex + 1] : null;

  if (!lesson) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground">Lesson not found</h1>
          <Link to="/lessons" className="mt-4 inline-block text-accent hover:underline">← Back to lessons</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/lessons" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" /> All Lessons
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-display font-bold">
              {lesson.number}
            </span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${levelColors[lesson.level]}`}>
              {levelLabels[lesson.level]}
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">{lesson.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{lesson.description}</p>
        </motion.div>

        {/* Vocabulary */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-10">
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">📚 Vocabulary</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {lesson.vocabulary.map((item, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-4 flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent/20 text-accent">
                  <Volume2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-display font-bold text-foreground text-lg leading-tight">{item.serbian}</p>
                  <p className="text-sm text-foreground">{item.english}</p>
                  <p className="text-xs text-muted-foreground italic mt-0.5">{item.pronunciation}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Phrases */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-10">
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">💬 Key Phrases</h2>
          <div className="space-y-3">
            {lesson.phrases.map((phrase, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-4">
                <p className="font-display text-lg font-bold text-foreground">{phrase.serbian}</p>
                <p className="text-sm text-foreground mt-1">{phrase.english}</p>
                <p className="text-xs text-muted-foreground italic mt-1">{phrase.pronunciation}</p>
                {phrase.note && (
                  <p className="text-xs text-accent mt-1 font-medium">💡 {phrase.note}</p>
                )}
              </div>
            ))}
          </div>
        </motion.section>

        {/* Cultural Note */}
        {lesson.culturalNote && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-10 rounded-xl bg-gradient-navy p-6 text-primary-foreground">
            <h3 className="font-display text-lg font-bold mb-2">🇷🇸 Cultural Note</h3>
            <p className="text-sm leading-relaxed opacity-90">{lesson.culturalNote}</p>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="mt-12 flex items-center justify-between gap-4">
          {prevLesson ? (
            <Link to={`/lessons/${prevLesson.id}`} className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">{prevLesson.title}</span>
              <span className="sm:hidden">Previous</span>
            </Link>
          ) : <div />}
          {nextLesson ? (
            <Link to={`/lessons/${nextLesson.id}`} className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">
              <span className="hidden sm:inline">{nextLesson.title}</span>
              <span className="sm:hidden">Next</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : <div />}
        </div>
      </div>
    </Layout>
  );
};

export default LessonDetail;
