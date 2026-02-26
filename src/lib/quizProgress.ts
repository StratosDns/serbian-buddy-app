import { supabase } from "@/lib/supabase";

export interface QuizProgressRecord {
  id: string;
  user_id: string;
  lesson_id: string;
  score: number;
  total_questions: number;
  completed: boolean;
  failed_question_indices: number[];
  attempts: number;
  last_attempt_at: string;
  created_at: string;
  updated_at: string;
}

export async function saveQuizProgress(
  userId: string,
  lessonId: string,
  score: number,
  totalQuestions: number,
  completed: boolean,
  failedQuestionIndices: number[]
): Promise<void> {
  const { error } = await supabase.from("quiz_progress").upsert(
    {
      user_id: userId,
      lesson_id: lessonId,
      score,
      total_questions: totalQuestions,
      completed,
      failed_question_indices: failedQuestionIndices,
      last_attempt_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,lesson_id", ignoreDuplicates: false }
  );

  if (error) throw error;
}

export async function getQuizProgress(userId: string): Promise<QuizProgressRecord[]> {
  const { data, error } = await supabase
    .from("quiz_progress")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;
  return data ?? [];
}

export async function getQuizProgressForLesson(
  userId: string,
  lessonId: string
): Promise<QuizProgressRecord | null> {
  const { data, error } = await supabase
    .from("quiz_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function resetQuizProgress(userId: string, lessonId: string): Promise<void> {
  const { error } = await supabase
    .from("quiz_progress")
    .delete()
    .eq("user_id", userId)
    .eq("lesson_id", lessonId);

  if (error) throw error;
}
