import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IQuestion, IQuestionAnswers } from '../interfaces/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-questions-form',
  templateUrl: './questions-form.component.html',
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  styleUrls: ['./questions-form.component.css']
})
export class QuestionsFormComponent {

  private fb = new FormBuilder();
  showQuestions = signal(false);
  isLoading = signal(false);
  questionsList: IQuestion[] = [];
  form!: FormGroup;
  email: string = '';
  availableQuestions: any[] = [];



  questions = signal<IQuestion[]>([]);

  trackById(index: number, item: IQuestion): number {
  return item.id;
  }

  constructor(private router: Router, private http: HttpClient, private auth: AuthService, private route: ActivatedRoute,
) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions() {
    this.auth.getQuestions().subscribe({
      next: (res) => {
        this.questionsList = res;
        this.availableQuestions = [...this.questionsList];
        this.buildForm();
        this.handleQuestionChanges();
      },
      error: (err) => console.error('Error cargando preguntas:', err),
    });
  }

  buildForm() {
    this.form = this.fb.group({
      question1: ['', Validators.required],
      answer1: ['', Validators.required],
      question2: ['', Validators.required],
      answer2: ['', Validators.required],
      question3: ['', Validators.required],
      answer3: ['', Validators.required],
    });
  }

  watchQuestionChanges() {
    this.form.valueChanges.subscribe(() => {
    });
  }

  getFilteredQuestions(excludeIds: (string | number)[]) {
    return this.questionsList.filter((q) => !excludeIds.includes(q.id));
  }

  handleQuestionChanges() {
    this.form.valueChanges.subscribe(() => {
      const selectedIds = [
        this.form.value.question1,
        this.form.value.question2,
        this.form.value.question3,
      ].filter(Boolean);

      this.availableQuestions = this.questionsList.filter(
        (q) => !selectedIds.includes(q.id)
      );
    });
  }
   onSubmit() {
    if (this.form.invalid) {
      Swal.fire('⚠️', 'Responde las tres preguntas', 'warning');
      return;
    }

    const selectedQuestions = [
      { id: this.form.value.question1 },
      { id: this.form.value.question2 },
      { id: this.form.value.question3 },
    ].filter(Boolean) as IQuestion[];

    const answers = [
      this.form.value.answer1,
      this.form.value.answer2,
      this.form.value.answer3
    ];

     const ids = selectedQuestions.map((q) => q.id);
    if (new Set(ids).size !== ids.length) {
      Swal.fire('⚠️', 'No puedes elegir la misma pregunta más de una vez', 'error');
      return;
    }
    this.isLoading.set(true);

    this.auth.validateQuestions(selectedQuestions, answers).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          Swal.fire({
            title: '✅ ¡Correcto!',
            text: 'Respuestas válidas.',
            icon: 'success',
            confirmButtonText: 'Continuar'
          }).then(() => this.router.navigate(['/dashboard']));
        } else {
          Swal.fire({
            title: '❌ Error',
            text: 'Alguna respuesta es incorrecta.',
            icon: 'error',
            confirmButtonText: 'Intentar de nuevo'
          });
        }
      },
      error: () => {
        this.isLoading.set(false);
        Swal.fire({
          title: '⚠️ Error',
          text: 'No se pudieron validar las respuestas.',
          icon: 'error',
          confirmButtonText: 'Cerrar'
        });
      }
    });
  }

    goBack() {
    this.router.navigate(['/auth']);
   }
     get questionsGroup() {
      return this.form.get('questions') as FormGroup;
    }
}




