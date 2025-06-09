import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result } from '../models/results.model';

@Injectable({
  providedIn: 'root',
})
export class ResultsService {
  constructor(private http: HttpClient) {}
  baseurl: string = 'http://localhost:8000/results';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  getAllresults(): Observable<Result[]> {
    return this.http.get<Result[]>(this.baseurl);
  }

  getResultById(examId: string, studentId: string): Observable<Result> {
    return this.http.get<Result>(`${this.baseurl}/${examId}/${studentId}`);
  }
  AddNewResult(result: Result): Observable<Result> {
    return this.http.post<Result>(this.baseurl, result, this.httpOptions);
  }
}
