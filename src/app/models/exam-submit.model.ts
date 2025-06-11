import { Answers } from './answers.model';

export interface SubmittedAnswerPayload {
  questionId: string;
  selectedOptionIndex: number;
}

export interface ExamSubmitResponse {
  message: string;
  score: number;
  total: number;
  percentage: string;
  passed: boolean;
  answers?: Answers[];
}
