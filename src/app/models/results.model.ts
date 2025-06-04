import { Answers } from './answers.model';

export interface Result {
  id: string;
  studentID: string;
  examID: string;
  score: number;
  total: number;
  answers: Answers[];
}
