import { Question } from './question.model';

export interface Exam {
  id: string;
  title: string;
  description?: string;
  duration: number;
  passingScore: number;
  questions: Question[];
  createdAt: Date;
  updatedAt?: Date;
}
