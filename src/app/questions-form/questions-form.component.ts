import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IQuestion, IQuestionAnswers } from '../interfaces/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-questions-form',
  templateUrl: './questions-form.component.html',
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./questions-form.component.css']
})
export class QuestionsFormComponent {

  private fb = new FormBuilder();

  showQuestions = signal(false);
  isLoading = signal(false);
  questionList = signal<IQuestion[]>([]);
  form!: FormGroup;
  email: string = '';

  questions = signal<IQuestion[]>([]);
  loading = true;


  trackById(index: number, item: IQuestion): number {
  return item.id;
  }

  constructor(private router: Router, private auth: AuthService, private route: ActivatedRoute,
) {}

  ngOnInit(): void {
     this.route.queryParams.subscribe((params) => {
      this.email = params['email'] || '';
    });
     this.auth.getRandomQuestions().subscribe({
      next: (res) => {
        this.questions.set(res);
        const controls: any = {};
        res.forEach((q) => (controls[q.id] = ['', Validators.required]));
        this.form = this.fb.group(controls);
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar las preguntas', 'error');
      },
    });
  }



    onSubmit(): void {
    const email = this.form.get('email')?.value;
    const answers = this.form.value;
    this.isLoading.set(true);

      if (this.form.invalid) {
      Swal.fire('Error', 'Debes responder todas las preguntas.', 'error');
      return;
    }
      this.auth.validateQuestions(answers).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          Swal.fire('✅ Correcto', 'Respuestas válidas.', 'success').then(() => {
            this.router.navigate(['/dashboard']);
          });
        } else {
          Swal.fire('❌ Error', 'Alguna respuesta es incorrecta.', 'error').then(() => {
            this.router.navigate(['/auth']);
          });
        }
      },
      error: () => {
        this.isLoading.set(false);
        Swal.fire('Error', 'No se pudieron validar las respuestas.', 'error');
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



    goBack() {
    this.router.navigate(['/auth']);
   }
     get questionsGroup() {
      return this.form.get('questions') as FormGroup;
    }
}




