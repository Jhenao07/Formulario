
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IQuestion, IQuestionAnswers } from '../interfaces/interfaces';
// import { IQuestionAnswers } from '../interfaces/interfaces';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}


  getQuestions(): Observable<IQuestion[]> {
    return this.http.get<IQuestion[]>(`${this.apiUrl}/questions`);
  }

  validateToken(email: string, token: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/validate-token`, {
      email,
      token,
    });
  }

  validateQuestions(email: string, answers: Record<number, string>): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/validate-questions`, { email, answers });
  }
}
