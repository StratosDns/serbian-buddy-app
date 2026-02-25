import { useState } from "react";
import { QuizQuestion } from "@/data/lessons";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { hasCyrillic, toCyrillic, toLatin } from "@/lib/transliterate";
import SpeakButton from "@/components/SpeakButton";

interface LessonQuizProps {
  questions: QuizQuestion[];
  lessonTitle: string;
}

const LessonQuiz = ({ questions, lessonTitle }: LessonQuizProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [textAnswer, setTextAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [questionScripts, setQuestionScripts] = useState<Record<number, "both" | "cyrillic" | "latin">>({});

  const question = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  const getScript = (index: number): "both" | "cyrillic" | "latin" => questionScripts[index] ?? "both";
  const setScript = (index: number, mode: "both" | "cyrillic" | "latin") =>
    setQuestionScripts((prev) => ({ ...prev, [index]: mode }));

  const applyScript = (text: string, mode: "both" | "cyrillic" | "latin"): string => {
    const cyr = toCyrillic(text);
    const lat = toLatin(cyr);

    // If converting to Cyrillic and back to Latin yields the original text,
    // there are no Cyrillic characters to transform – return as-is (e.g. English words).
    if (lat === text) return text;

    // If text contains both Cyrillic and Latin characters it is already in a combined
    // "Cyrillic / Latin" format.  Extract each script separately to avoid duplicates.
    if (hasCyrillic(text) && /[a-zA-Z]/.test(text)) {
      const parts = text.split(" / ");
      const cyrStr = parts.filter(p => hasCyrillic(p)).join(" / ");
      const latStr = parts.filter(p => !hasCyrillic(p)).join(" / ");
      if (mode === "cyrillic") return cyrStr || cyr;
      if (mode === "latin") return latStr || lat;
      return `${cyrStr || cyr} / ${latStr || lat}`;
    }

    // Pure Cyrillic text
    if (mode === "cyrillic") return cyr;
    if (mode === "latin") return lat;
    return cyr !== lat ? `${cyr} / ${lat}` : cyr;
  };

  const normalizeAnswer = (ans: string) => ans.trim().toLowerCase().replace(/[.!?,;:]/g, "").replace(/\s+/g, " ");

  const normalizeForCheck = (ans: string) => normalizeAnswer(hasCyrillic(ans) ? toLatin(ans) : ans);

  const checkAnswer = () => {
    let correct = false;
    if (question.type === "multiple-choice") {
      correct = parseInt(selectedOption) === question.correctIndex;
    } else if (question.type === "fill-blank") {
      correct = normalizeForCheck(question.answer) === normalizeForCheck(textAnswer) ||
        (question.acceptAlternatives || []).some(alt => normalizeForCheck(alt) === normalizeForCheck(textAnswer));
    } else if (question.type === "translate") {
      correct =
        normalizeForCheck(question.answer) === normalizeForCheck(textAnswer) ||
        (question.acceptAlternatives || []).some(
          (alt) => normalizeForCheck(alt) === normalizeForCheck(textAnswer)
        );
    }
    setIsCorrect(correct);
    if (correct) setScore((s) => s + 1);
    setShowResult(true);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption("");
      setTextAnswer("");
      setShowResult(false);
      setShowHint(false);
    } else {
      setCompleted(true);
    }
  };

  const restart = () => {
    setCurrentIndex(0);
    setSelectedOption("");
    setTextAnswer("");
    setShowResult(false);
    setIsCorrect(false);
    setScore(0);
    setCompleted(false);
    setShowHint(false);
  };

  const canSubmit = question?.type === "multiple-choice" ? selectedOption !== "" : textAnswer.trim() !== "";
  const scorePercent = Math.round((score / questions.length) * 100);

  if (completed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-border bg-card p-8 text-center"
      >
        <Trophy className="mx-auto h-16 w-16 text-accent mb-4" />
        <h3 className="font-display text-2xl font-bold text-foreground mb-2">Quiz Complete!</h3>
        <p className="text-muted-foreground mb-4">
          You scored <span className="font-bold text-foreground">{score}/{questions.length}</span> ({scorePercent}%)
        </p>
        <div className="mx-auto max-w-xs mb-6">
          <Progress value={scorePercent} className="h-3" />
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          {scorePercent >= 80
            ? "🎉 Excellent! You've mastered this lesson!"
            : scorePercent >= 60
            ? "👍 Good job! Review the vocabulary and try again for a higher score."
            : "📚 Keep practicing! Review the lesson material and try again."}
        </p>
        <Button onClick={restart} variant="outline" className="gap-2">
          <RotateCcw className="h-4 w-4" /> Try Again
        </Button>
      </motion.div>
    );
  }

  const getCorrectAnswerDisplay = () => {
    const script = getScript(currentIndex);
    if (question.type === "multiple-choice") {
      return applyScript(question.options[question.correctIndex], script);
    }
    const answer = applyScript(question.answer, script);
    const alts = ("acceptAlternatives" in question ? question.acceptAlternatives : []) || [];
    if (alts.length > 0) {
      return `${answer} (also accepted: ${alts.map(alt => applyScript(alt, script)).join(", ")})`;
    }
    return answer;
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Progress */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>Score: {score}/{currentIndex + (showResult ? 1 : 0)}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="p-6"
        >
          {/* Question type badge + per-question script toggle */}
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              {question.type === "multiple-choice"
                ? "Multiple Choice"
                : question.type === "fill-blank"
                ? "Fill in the Blank"
                : question.type === "translate"
                ? "Translate"
                : "Form a Sentence"}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground mr-1">Script:</span>
              {(["both", "cyrillic", "latin"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setScript(currentIndex, mode)}
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                    getScript(currentIndex) === mode
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {mode === "both" ? "Both" : mode === "cyrillic" ? "Cyrillic" : "Latin"}
                </button>
              ))}
            </div>
          </div>

          {/* Question text */}
          <h4 className="font-display text-lg font-bold text-foreground mb-4">
            {question.type === "multiple-choice" && (
              <span className="flex items-center gap-2">
                {applyScript(question.question, getScript(currentIndex))}
                {hasCyrillic(question.question) && (
                  <SpeakButton text={question.question} />
                )}
              </span>
            )}
            {question.type === "fill-blank" && (
              <>Complete the sentence:<br /><span className="text-muted-foreground font-normal text-base flex items-center gap-2">
                {applyScript(question.sentence, getScript(currentIndex))}
                <SpeakButton text={question.sentence} />
              </span></>
            )}
            {question.type === "translate" && (
              <>
                Translate {question.fromLang === "serbian" ? "from Serbian" : "to Serbian"}:
                <br />
                <span className="text-accent font-normal text-xl mt-2 flex items-center gap-2">
                  {question.fromLang === "serbian" ? applyScript(question.from, getScript(currentIndex)) : question.from}
                  {(question.fromLang === "serbian" || hasCyrillic(question.from)) && (
                    <SpeakButton text={question.from} />
                  )}
                </span>
                <span className="text-xs text-muted-foreground mt-1 block">
                  You can answer in either Cyrillic or Latin script
                </span>
              </>
            )}
          </h4>

          {/* Hint */}
          {question.hint && !showHint && !showResult && (
            <button
              onClick={() => setShowHint(true)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-accent mb-3 transition-colors"
            >
              <Lightbulb className="h-3 w-3" /> Show hint
            </button>
          )}
          {showHint && question.hint && (
            <p className="text-xs text-accent bg-accent/5 rounded-lg p-2 mb-3">💡 {question.hint}</p>
          )}

          {/* Answer area */}
          {question.type === "multiple-choice" && (
            <RadioGroup
              value={selectedOption}
              onValueChange={setSelectedOption}
              disabled={showResult}
              className="space-y-2"
            >
              {question.options.map((opt, i) => (
                <label
                  key={i}
                  className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all ${
                    showResult && i === question.correctIndex
                      ? "border-success bg-success/10"
                      : showResult && parseInt(selectedOption) === i && !isCorrect
                      ? "border-destructive bg-destructive/10"
                      : selectedOption === String(i)
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <RadioGroupItem value={String(i)} />
                  <span className="text-sm text-foreground flex-1">{applyScript(opt, getScript(currentIndex))}</span>
                  {hasCyrillic(opt) && <SpeakButton text={opt} />}
                </label>
              ))}
            </RadioGroup>
          )}

          {(question.type === "fill-blank" || question.type === "translate") && (
            <Input
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              disabled={showResult}
              placeholder={
                question.type === "fill-blank" ? "Type the missing word (Cyrillic or Latin)..." : "Type your translation (Cyrillic or Latin)..."
              }
              className="text-base"
              onKeyDown={(e) => {
                if (e.key === "Enter" && canSubmit && !showResult) checkAnswer();
              }}
            />
          )}

          {/* Result feedback */}
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 rounded-xl p-4 flex items-start gap-3 ${
                isCorrect ? "bg-success/10" : "bg-destructive/10"
              }`}
            >
              {isCorrect ? (
                <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-semibold text-sm text-foreground">
                  {isCorrect ? "Correct! 🎉" : "Not quite."}
                </p>
                {!isCorrect && (
                  <p className="text-sm text-muted-foreground mt-1">
                    The correct answer is:{" "}
                    <span className="font-semibold text-foreground inline-flex items-center gap-1">
                      {getCorrectAnswerDisplay()}
                      <SpeakButton
                        text={
                          question.type === "multiple-choice"
                            ? question.options[question.correctIndex]
                            : question.answer
                        }
                      />
                    </span>
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="mt-6 flex justify-end">
            {!showResult ? (
              <Button onClick={checkAnswer} disabled={!canSubmit} className="gap-2">
                Check Answer
              </Button>
            ) : (
              <Button onClick={nextQuestion} className="gap-2">
                {currentIndex < questions.length - 1 ? (
                  <>Next <ArrowRight className="h-4 w-4" /></>
                ) : (
                  <>See Results <Trophy className="h-4 w-4" /></>
                )}
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LessonQuiz;
