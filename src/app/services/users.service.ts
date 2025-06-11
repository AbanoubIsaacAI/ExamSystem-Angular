// users.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private baseUrl = 'http://localhost:5000/users';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${userId}`);
  }

  AddNewUser(user: User): Observable<User> {
    return this.http.post<User>(this.baseUrl, user, this.httpOptions);
  }

  updateUser(userId: string, updatedUser: User): Observable<User> {
    return this.http.put<User>(
      `${this.baseUrl}/${userId}`,
      updatedUser,
      this.httpOptions
    );
  }

  updateUserPartial(
    userId: string,
    partialData: Partial<User>
  ): Observable<User> {
    return this.http.patch<User>(
      `${this.baseUrl}/${userId}`,
      partialData,
      this.httpOptions
    );
  }
}
