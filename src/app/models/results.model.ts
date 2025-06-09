import { Answers } from './answers.model';

export interface Result {
  studentID: string;
  examID: string;
  examTitle: string;
  score: number;
  total: number;
  passed: boolean;
  answers: Answers[];
  submittedAt: Date;
}
