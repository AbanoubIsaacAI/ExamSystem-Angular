import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}
  baseurl: string = 'http://localhost:8000/users';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseurl);
  }
  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.baseurl}/${userId}`);
  }
  AddNewUser(user: User): Observable<User> {
    return this.http.post<User>(this.baseurl, user, this.httpOptions);
  }
}
