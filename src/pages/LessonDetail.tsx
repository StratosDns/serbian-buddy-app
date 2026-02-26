import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { lessons, levelLabels, levelColors } from "@/data/lessons";
import Layout from "@/components/Layout";
import LessonQuiz from "@/components/LessonQuiz";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Volume2, BookOpen, GraduationCap, CheckCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SpeakButton from "@/components/SpeakButton";
import { speakSerbian } from "@/lib/speak";
import { useAuth } from "@/contexts/AuthContext";
import { getQuizProgressForLesson } from "@/lib/quizProgress";
import type { QuizProgressRecord } from "@/lib/quizProgress";

const LessonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const lesson = lessons.find((l) => l.id === id);
  const lessonIndex = lessons.findIndex((l) => l.id === id);
  const prevLesson = lessonIndex > 0 ? lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < lessons.length - 1 ? lessons[lessonIndex + 1] : null;
  const [scriptMode, setScriptMode] = useState<"both" | "cyrillic" | "latin">("both");
  const { user } = useAuth();
  const [quizProgress, setQuizProgress] = useState<QuizProgressRecord | null>(null);

  useEffect(() => {
    if (user && id) {
      getQuizProgressForLesson(user.id, id)
        .then(setQuizProgress)
        .catch(() => setQuizProgress(null));
    } else {
      setQuizProgress(null);
    }
  }, [user, id]);

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

  const renderSerbian = (cyrillic: string, latin: string) => {
    if (scriptMode === "cyrillic") return <>{cyrillic}</>;
    if (scriptMode === "latin") return <>{latin}</>;
    return (
      <>
        {latin} <span className="text-muted-foreground font-normal text-sm ml-1">({cyrillic})</span>
      </>
    );
  };

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

          {/* Script toggle */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs text-muted-foreground mr-1">Script:</span>
            {(["both", "cyrillic", "latin"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setScriptMode(mode)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  scriptMode === mode
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {mode === "both" ? "Both" : mode === "cyrillic" ? "Cyrillic" : "Latin"}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tabs: Learn & Quiz */}
        <Tabs defaultValue="learn" className="mt-8">
          <TabsList className="grid w-full grid-cols-2 max-w-xs">
            <TabsTrigger value="learn" className="gap-2">
              <BookOpen className="h-4 w-4" /> Learn
            </TabsTrigger>
            <TabsTrigger value="quiz" className="gap-2">
              <GraduationCap className="h-4 w-4" /> Quiz
              {quizProgress?.completed && <CheckCircle className="h-3.5 w-3.5 text-success" />}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="learn" className="mt-6 space-y-10">
            {/* Vocabulary */}
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">📚 Vocabulary</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {lesson.vocabulary.map((item, i) => (
                  <div key={i} className="rounded-xl border border-border bg-card p-4 flex items-start gap-3">
                    <button
                      onClick={() => speakSerbian(item.latin)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent/20 text-accent hover:bg-accent/30 transition-colors"
                      title="Listen to pronunciation"
                      aria-label="Listen to pronunciation"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                    <div>
                      <p className="font-display font-bold text-foreground text-lg leading-tight">
                        {renderSerbian(item.cyrillic, item.latin)}
                      </p>
                      <p className="text-sm text-foreground">{item.english}</p>
                      <p className="text-xs text-muted-foreground italic mt-0.5">{item.pronunciation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Phrases */}
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">💬 Key Phrases</h2>
              <div className="space-y-3">
                {lesson.phrases.map((phrase, i) => (
                  <div key={i} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex items-start gap-2">
                      <p className="font-display text-lg font-bold text-foreground flex-1">
                        {renderSerbian(phrase.cyrillic, phrase.latin)}
                      </p>
                      <SpeakButton text={phrase.latin} size="md" className="shrink-0 mt-0.5" />
                    </div>
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
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="rounded-xl bg-gradient-navy p-6 text-primary-foreground">
                <h3 className="font-display text-lg font-bold mb-2">🇷🇸 Cultural Note</h3>
                <p className="text-sm leading-relaxed opacity-90">{lesson.culturalNote}</p>
              </motion.div>
            )}

            {/* Practical Examples */}
            {lesson.practicalExamples && lesson.practicalExamples.length > 0 && (
              <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">🗣️ In Context</h2>
                <div className="space-y-4">
                  {lesson.practicalExamples.map((example, i) => (
                    <div key={i} className="rounded-xl border border-border bg-card p-4">
                      <p className="text-xs font-semibold text-accent uppercase tracking-wide mb-3">{example.situation}</p>
                      <div className="space-y-2">
                        {example.dialogue.map((line, j) => (
                          <div key={j} className="flex gap-3 items-start">
                            <span className="shrink-0 text-xs font-semibold text-muted-foreground w-16 pt-0.5">{line.speaker}:</span>
                            <div>
                              <p className="font-display font-bold text-foreground text-sm leading-snug">
                                {renderSerbian(line.cyrillic, line.latin)}
                              </p>
                              <p className="text-xs text-muted-foreground italic">{line.english}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </TabsContent>

          <TabsContent value="quiz" className="mt-6">
            {quizProgress && (
              <div className="mb-4 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground flex items-center gap-2">
                {quizProgress.completed ? (
                  <><CheckCircle className="h-4 w-4 text-success shrink-0" /> Completed — best score: {quizProgress.score}/{quizProgress.total_questions}</>
                ) : (
                  <>🔄 In Progress — best score: {quizProgress.score}/{quizProgress.total_questions}</>
                )}
              </div>
            )}
            {lesson.quiz.length > 0 ? (
              <LessonQuiz questions={lesson.quiz} lessonTitle={lesson.title} lessonId={lesson.id} />
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <GraduationCap className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No quiz available for this lesson yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

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
