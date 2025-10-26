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
  questionsList: IQuestion[] = [];
  form!: FormGroup;
  email: string = '';
  availableQuestions: any[] = [];



  questions = signal<IQuestion[]>([]);

  trackById(index: number, item: IQuestion): number {
  return item.id;
  }

  constructor(private router: Router, private auth: AuthService, private route: ActivatedRoute,
) {}

  ngOnInit(): void {
     this.loadQuestions();
      this.form = this.fb.group({
      question1: [''],
      answer1: [''],
      question2: [''],
      answer2: [''],
      question3: [''],
      answer3: [''],
      });
    }

  loadQuestions(): void {
    this.auth.getQuestions().subscribe({
      next: (data) => {
        this.questionsList = data;
        this.buildForm();
      },
      error: (err) => console.error('Error al cargar preguntas', err),
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

   onSubmit() {
    if (this.form.invalid) {
      Swal.fire('⚠️', 'Responde las tres preguntas', 'warning');
      return;
    }

    const selectedQuestions = [
      this.questionsList.find(q => q.id === Number(this.form.value.question1)),
      this.questionsList.find(q => q.id === Number(this.form.value.question2)),
      this.questionsList.find(q => q.id === Number(this.form.value.question3))
    ].filter(Boolean) as IQuestion[];

    const answers = [
      this.form.value.answer1.trim(),
      this.form.value.answer2.trim(),
      this.form.value.answer3.trim()
    ];

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




