export interface Question {
  _id: string;
  examId: string;
  questionText: string;
  options?: string[];
  correctAnswerIndex?: string;
  points: number;
}
