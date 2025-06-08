export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  scores?: [{ examID: string; examtitle: string; score: number }];
  role: 'student' | 'admin';
  token?: string;
}
