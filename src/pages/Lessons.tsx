import { lessons, levelLabels, levelColors, type LessonLevel } from "@/data/lessons";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, ChevronRight } from "lucide-react";
import { useState } from "react";

const levels: LessonLevel[] = ["beginner", "elementary", "pre-intermediate", "intermediate", "upper-intermediate"];

const Lessons = () => {
  const [activeLevel, setActiveLevel] = useState<LessonLevel | "all">("all");

  const filtered = activeLevel === "all" ? lessons : lessons.filter((l) => l.level === activeLevel);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <h1 className="font-display text-4xl font-bold text-foreground md:text-5xl">
            Serbian <span className="text-gradient-gold">Lessons</span>
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            {lessons.length} lessons from beginner to upper-intermediate
          </p>
        </motion.div>

        {/* Filter */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setActiveLevel("all")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeLevel === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({lessons.length})
          </button>
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => setActiveLevel(level)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeLevel === level ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {levelLabels[level]} ({lessons.filter((l) => l.level === level).length})
            </button>
          ))}
        </div>

        {/* Lessons Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((lesson, i) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                to={`/lessons/${lesson.id}`}
                className="group card-hover flex h-full flex-col rounded-xl border border-border bg-card p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-display font-bold">
                    {lesson.number}
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${levelColors[lesson.level]}`}>
                    {levelLabels[lesson.level]}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-1 group-hover:text-accent transition-colors">
                  {lesson.title}
                </h3>
                <p className="text-sm text-muted-foreground flex-1">{lesson.description}</p>
                <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                  <BookOpen className="h-3 w-3" />
                  <span>{lesson.vocabulary.length} words · {lesson.phrases.length} phrases</span>
                  <ChevronRight className="ml-auto h-4 w-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Lessons;
