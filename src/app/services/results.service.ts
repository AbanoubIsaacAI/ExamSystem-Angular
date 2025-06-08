import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result } from '../models/results.model';

@Injectable({
  providedIn: 'root',
})
export class ResultsService {
  constructor(private http: HttpClient) {}
  baseurl: string = 'http://localhost:8000/results';
  getAllexams(): Observable<Result[]> {
    return this.http.get<Result[]>(this.baseurl);
  }

  getExamById(examId: string): Observable<Result> {
    return this.http.get<Result>(`${this.baseurl}/${examId}`);
  }
}
