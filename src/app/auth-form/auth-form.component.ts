
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { IQuestionAnswers } from '../interfaces/interfaces';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth-form.html',
  styleUrls: ['./auth-form.component.css'],
})
export class AuthFormComponent {
  private fb: NonNullableFormBuilder = new FormBuilder().nonNullable;

  showQuestions = signal(false);
  isLoading = signal(false);

  constructor(private router: Router, private auth: AuthService) {}

  form: FormGroup = this.fb.group({
    email: this.fb.control('', [Validators.required, Validators.email]),
    token: this.fb.control('', [Validators.required, Validators.pattern(/^\d{6}$/)]),
    questions: this.fb.group({
      answer1: this.fb.control('', [Validators.required]),
      answer2: this.fb.control('', [Validators.required]),
      answer3: this.fb.control('', [Validators.required]),
    }),
  });

  onSubmit(): void {
    this.isLoading.set(true);
    const email = this.form.get('email')?.value ?? '';
    const token = this.form.get('token')?.value ?? '';

    this.auth.validateToken(email, token).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          alert('✅ Token correcto. Acceso permitido.');
          this.router.navigate(['/dashboard']);
        } else {
          alert('❌ Token incorrecto. Responde las preguntas.');
          this.showQuestions.set(true);
        }
      },
      error: () => {
        this.isLoading.set(false);
        alert('⚠️ Error al validar el token.');
      },
    });
  }

  onQuestionsSubmit(): void {
    const email = this.form.get('email')?.value ?? '';
    const answers = this.form.get('questions')?.value as IQuestionAnswers;

    if (!answers.answer1 || !answers.answer2 || !answers.answer3) {
      alert('❌ Debes responder todas las preguntas.');
      return;
    }

    this.isLoading.set(true);
    this.auth.validateQuestions(email, answers).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          alert('✅ Respuestas correctas. Bienvenido.');
          this.router.navigate(['/dashboard']);
        } else {
          alert('❌ Alguna respuesta es incorrecta.');
        }
      },
      error: () => {
        this.isLoading.set(false);
        alert('⚠️ Error al validar las respuestas.');
      },
    });
  }

  get questionsGroup() {
    return this.form.get('questions') as FormGroup;
  }
}
