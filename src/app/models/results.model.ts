import { Answers } from './answers.model';
import { Exam } from './exam.model';
import { User } from './user.model';

export interface Result {
  student: User;
  exam: Exam;
  score: number;
  total: number;
  passed: boolean;
  answers: Answers[];
  submittedAt: Date;
}
