import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Languages, GraduationCap, ArrowRight } from "lucide-react";
import { lessons, levelLabels, type LessonLevel } from "@/data/lessons";

const levelDescriptions: Record<LessonLevel, string> = {
  beginner: "Start your journey with greetings, numbers, and everyday essentials.",
  elementary: "Build your vocabulary with weather, emotions, shopping, and more.",
  "pre-intermediate": "Dive into tenses, geography, and complex sentence structures.",
  intermediate: "Master cases, verb aspects, cultural topics, and natural conversation.",
};

const features = [
  {
    icon: Languages,
    title: "Alphabet Guide",
    description: "Master the 30-letter Serbian alphabet with pronunciation guides for each letter.",
    link: "/alphabet",
  },
  {
    icon: GraduationCap,
    title: "Grammar Basics",
    description: "Learn pronouns, the verb 'to be', word order, and essential grammar rules.",
    link: "/grammar",
  },
  {
    icon: BookOpen,
    title: `${lessons.length} Lessons`,
    description: "From greetings to advanced grammar — a comprehensive learning path.",
    link: "/lessons",
  },
];

const Index = () => {
  const levelCounts = (Object.keys(levelLabels) as LessonLevel[]).map((level) => ({
    level,
    count: lessons.filter((l) => l.level === level).length,
  }));

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-navy py-20 md:py-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 font-display text-[12rem] font-bold leading-none text-primary-foreground/20">Ћ</div>
          <div className="absolute bottom-10 right-10 font-display text-[10rem] font-bold leading-none text-primary-foreground/20">Ш</div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[16rem] font-bold leading-none text-primary-foreground/10">Ж</div>
        </div>
        <div className="container relative mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-gold-light">
              Learn Serbian for English Speakers
            </p>
            <h1 className="font-display text-4xl font-bold text-primary-foreground md:text-6xl lg:text-7xl">
              Speak <span className="text-gradient-gold">Serbian</span>
              <br />with Confidence
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-primary-foreground/70">
              {lessons.length} structured lessons, a complete alphabet guide, and essential grammar — 
              everything you need to start speaking Serbian.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/lessons"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-gold px-6 py-3 font-semibold text-primary shadow-lg transition-transform hover:scale-105"
              >
                Start Learning <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/alphabet"
                className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/20 px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
              >
                View Alphabet
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <Link
                to={feature.link}
                className="group card-hover flex h-full flex-col rounded-xl border border-border bg-card p-6"
              >
                <feature.icon className="h-8 w-8 text-accent mb-4" />
                <h3 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Level breakdown */}
      <section className="container mx-auto px-4 pb-16">
        <h2 className="font-display text-3xl font-bold text-foreground text-center mb-8">
          Your Learning <span className="text-gradient-gold">Path</span>
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {levelCounts.map(({ level, count }, i) => (
            <motion.div
              key={level}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="rounded-xl border border-border bg-card p-5 text-center"
            >
              <div className="font-display text-3xl font-bold text-accent">{count}</div>
              <div className="font-display text-lg font-semibold text-foreground mt-1">{levelLabels[level]}</div>
              <p className="text-sm text-muted-foreground mt-2">{levelDescriptions[level]}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/lessons"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-transform hover:scale-105"
          >
            Browse All Lessons <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
