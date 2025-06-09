import { Result } from './results.model';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  result?: Result[];
  role: 'student' | 'admin';
  token?: string;
}
