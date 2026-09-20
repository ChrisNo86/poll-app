import { Question, Survey } from '../models/survey.model';

/** Builds the key under which the votes of an answer are stored. */
export function buildVoteKey(questionId: string, answerId: string): string {
  return `${questionId}_${answerId}`;
}

/** Sums up all votes of a question. */
export function countQuestionVotes(survey: Survey, question: Question): number {
  return question.answers.reduce(
    (sum, answer) => sum + (survey.votes[buildVoteKey(question.id, answer.id)] ?? 0),
    0,
  );
}

/** Returns the vote share of an answer in percent, rounded to whole numbers. */
export function getAnswerPercent(survey: Survey, question: Question, answerId: string): number {
  const total = countQuestionVotes(survey, question);
  const votes = survey.votes[buildVoteKey(question.id, answerId)] ?? 0;
  return total === 0 ? 0 : Math.round((votes / total) * 100);
}

/** Converts an index to a letter label (0 = A). */
export function toLetter(index: number): string {
  return String.fromCharCode('A'.charCodeAt(0) + index);
}
