
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IQuestion, IQuestionAnswers } from '../interfaces/interfaces';
// import { IQuestionAnswers } from '../interfaces/interfaces';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}


  getQuestions(): Observable<IQuestion[]> {
    return this.http.get<IQuestion[]>(`${this.baseUrl}/questions`);
  }

  validateToken(email: string, passwords: string, token: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.baseUrl}/validate-token`, {
      email,
      passwords,
      token,
    });
  }


  validateQuestions(answers: IQuestionAnswers) {
    return this.http.post<{ success: boolean }>(`${this.baseUrl}/validate-questions`, {
      answers,
    });
  }
}
