import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Exam } from '../models/exam.model';

@Injectable({
  providedIn: 'root',
})
export class ExamsService {
  constructor(private http: HttpClient) {}
  baseurl: string = 'http://localhost:5000/exams';

  getAllexams(): Observable<Exam[]> {
    return this.http.get<Exam[]>(this.baseurl);
  }

  getExamById(examId: string): Observable<Exam> {
    return this.http.get<Exam>(`${this.baseurl}/${examId}`);
  }
  addExam(exam: Exam): Observable<Exam> {
    return this.http.post<Exam>(`${this.baseurl}/add-exam`, exam, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }
  deleteExam(examId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseurl}/${examId}`);
  }
  updateExam(updatedExam: Exam): Observable<Exam> {
    return this.http.put<Exam>(
      `${this.baseurl}/${updatedExam._id}/full`,
      updatedExam
    );
  }
}
