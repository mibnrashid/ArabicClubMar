import type { GameState, AnswerDoc, UIState } from "@/types";

export function deriveUIState(
  isRegistered: boolean,
  gameState: GameState | null,
  answersDoc: AnswerDoc | null
): UIState {
  if (!isRegistered) {
    return "not_registered";
  }

  const isQuestionActive =
    gameState?.isActive && !!gameState?.currentQuestionId;

  if (!isQuestionActive) {
    return "waiting";
  }

  const hasAnswered =
    answersDoc !== null &&
    answersDoc.questionId === gameState?.currentQuestionId;

  if (!hasAnswered) {
    return "active_not_answered";
  }

  return "answered";
}

export function getQuestionById(
  questions: { id: string; text: string; options: Record<string, string>; correctAnswer: string }[],
  questionId: string
) {
  return questions.find((q) => q.id === questionId) ?? null;
}
