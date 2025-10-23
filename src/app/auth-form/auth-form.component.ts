
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
// import { IQuestionAnswers } from '../interfaces/interfaces';
import Swal from 'sweetalert2';
import { IQuestion, IQuestionAnswers } from '../interfaces/interfaces';


@Component({
  selector: 'app-auth-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth-form.html',
  styleUrls: ['./auth-form.component.css'],
})
export class AuthFormComponent {
  private fb = new FormBuilder();

  showQuestions = signal(false);
  isLoading = signal(false);
  questionList = signal<IQuestion[]>([]);
  form!: FormGroup;

  trackById(index: number, item: IQuestion): number {
  return item.id;
}

  constructor(private router: Router, private auth: AuthService) {}




  ngOnInit(): void {
    this.form = this.fb.group({
       email: this.fb.control('', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/) // incluye arroba y dominio válido
      ]),

        password: this.fb.control('', [
        Validators.required,
        Validators.minLength(6),
      ]),
        token: this.fb.control('', [
        Validators.required,
        Validators.pattern(/^\d{6}$/), // solo 6 números
      ]),
      questions: this.fb.group({}),
    });
  }


  private pickRandom<T>(array: T[], count: number): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, count);
  }

  onSubmit(): void {
  const email = this.form.get('email')?.value;
  const password = this.form.get('password')?.value;
  const token = this.form.get('token')?.value;

    if (!this.form.valid) {
    Swal.fire('Error', 'Por favor completa todos los campos correctamente.', 'warning');
    return;
  }
    this.isLoading.set(true);


    this.auth.validateToken(email, password, token).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          Swal.fire('✅ Éxito', 'Token correcto, bienvenido.', 'success');
          this.router.navigate(['/dashboard']);
        } else {
          Swal.fire('❌ Token incorrecto', 'Responde las preguntas de seguridad', 'error');
          this.showQuestions.set(true);
          this.loadQuestions();
        }
      },
      error: () => {
        this.isLoading.set(false);
        Swal.fire('⚠️ Error', 'No se pudo validar el token.', 'warning');
      },
    });
  }



  loadQuestions(): void {
    this.auth.getQuestions().subscribe({
      next: (all) => {
        const selected = this.pickRandom(all, 3);
        this.questionList.set(selected);

        const controls: Record<string, any> = {};
        selected.forEach((q) => (controls[q.id] = ['']));
        const questionsGroup = this.fb.group(controls);
        this.form.setControl('questions', questionsGroup);
      },
    });
  }

  onQuestionsSubmit(): void {

  const email = this.form.get('email')?.value;
 const answers: IQuestionAnswers = this.form.get('questions')?.value;


  this.isLoading.set(true);
  this.auth.validateQuestions( answers).subscribe({
    next: (res) => {
      this.isLoading.set(false);

      if (res.success) {
        Swal.fire({
          title: '¡Correcto!',
          text: 'Respuestas válidas.',
          icon: 'success',
          confirmButtonText: 'Continuar'
        }).then(() => {
          this.router.navigate(['/dashboard']);
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Alguna respuesta es incorrecta.',
          icon: 'error',
          confirmButtonText: 'Intentar de nuevo'
        });
      }
    },
    error: () => {
      this.isLoading.set(false);
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron validar las respuestas.',
        icon: 'error',
        confirmButtonText: 'Cerrar'
      });
    },
  });
}

    get questionsGroup() {
    return this.form.get('questions') as FormGroup;
  }

}
