
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { IQuestionAnswers } from '../interfaces/interfaces';
import { SwalComponent, SwalDirective } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-auth-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth-form.html',
  styleUrls: ['./auth-form.component.css'],
})
export class AuthFormComponent {
  private fb: NonNullableFormBuilder = new FormBuilder().nonNullable;

  showQuestions = signal(false);
  isLoading = signal(false);

  showModal = signal(false);
  modalMessage = signal('');
  modalType = signal<'success' | 'error' | 'warning'>('warning');

  constructor(private router: Router, private auth: AuthService) {}

  form: FormGroup = this.fb.group({
    email: this.fb.control('', [Validators.required, Validators.email]),
    token: this.fb.control('', [Validators.required, Validators.pattern(/^[0-9]+$/)]),
    questions: this.fb.group({
      answer1: this.fb.control('', [Validators.required]),
      answer2: this.fb.control('', [Validators.required]),
      answer3: this.fb.control('', [Validators.required]),
    }),
  });


    openModal(message: string): void {
    this.modalMessage.set(message);
    this.showModal.set(true);
  }

  closeModal(): void {
    const type = this.modalType()
    this.showModal.set(false);
     if (type === 'error' || type === 'warning') {
    }

  }




  onSubmit(): void {



    this.isLoading.set(true);

    const email = this.form.get('email')?.value ?? '';
    const token = this.form.get('token')?.value ?? '';


    this.auth.validateToken(email, token).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
            Swal.fire({
              icon: 'success',
              title: '¡Bienvenido!',
              text: 'Respuestas correctas.',
              confirmButtonColor: '#d47100ff',})
              .then(() => {
              this.router.navigate(['/dashboard'])
              })
        }else {
          Swal.fire({
            icon: 'error',
            title: 'Token Incorrecto',
            text: 'Responde las siguientes preguntas',
            confirmButtonColor: '#d33',
          });
          this.showQuestions.set(true);
        }
      },

    });
  }

  onQuestionsSubmit(): void {
    const email = this.form.get('email')?.value ?? '';
    const answers = this.form.get('questions')?.value as IQuestionAnswers;

    if (!answers.answer1 || !answers.answer2 || !answers.answer3) {
       Swal.fire({
            icon: 'error',
            title: 'Respuestas incorrectas',
            text: 'Alguna respuesta no coincide.',
            confirmButtonColor: '#d33',
          });
      return;
    }

    this.isLoading.set(true);

    this.auth.validateQuestions(email, answers).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          Swal.fire({
              icon: 'success',
              title: '¡Bienvenido!',
              text: 'Respuestas correctas.',
              confirmButtonColor: '#d47100ff',})
              .then(() => {
              this.router.navigate(['/dashboard'])
          })
        } else {
            Swal.fire({
            icon: 'error',
            title: 'Respuestas incorrectas',
            text: 'Alguna respuesta no coincide.',
            confirmButtonColor: '#d33',
          });
        }
      },
      error: () => {
        this.isLoading.set(false);
          Swal.fire({
          title: "TOKEN",
          text: '⚠️ Error al validar el token.',
          icon: "question"
        });
      },
    });
  }

  get questionsGroup() {
    return this.form.get('questions') as FormGroup;
  }
}
