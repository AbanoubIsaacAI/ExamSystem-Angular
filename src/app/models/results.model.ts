import { Answers } from './answers.model';

export interface Result {
  id: string;
  studentID: string;
  examID: string;
  score: number;
  total: number;
  passed: boolean;
  answers: Answers[];
  submittedAt: Date;
}
