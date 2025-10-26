
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { IQuestion, IQuestionAnswers, ITokenResponse } from '../interfaces/interfaces';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

     getRandomQuestions(): Observable<IQuestion[]> {
      return this.http.get<IQuestion[]>(`${this.baseUrl}/questions`).pipe(
      map((questions) => this.shuffleArray(questions).slice(0, 3))
    );
  }

  getQuestions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/questions`);
  }

 validateQuestions(selectedQuestions: IQuestion[], answers: string[]) {
  return this.http.post<{ success: boolean }>(
    'http://localhost:3000/api/auth/validate-questions',
    { selectedQuestions, answers }
  );
}

  validateToken(email: string, token: string): Observable<ITokenResponse> {
    return this.http.post<ITokenResponse>(`${this.baseUrl}/validate-token`, {
      email,
      token,
    });
  }


   private shuffleArray(array: IQuestion[]): IQuestion[] {
    return array
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  }

}
