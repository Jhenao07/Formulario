
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';
import { IQuestion } from '../interfaces/interfaces';
import { TokenForm } from "../token-form/token-form.component";


@Component({
  selector: 'app-auth-form',
  imports: [CommonModule, ReactiveFormsModule, TokenForm],
  templateUrl: './auth-form.html',
  styleUrls: ['./auth-form.component.css'],
})
export class AuthFormComponent {
  private fb = new FormBuilder();
  isLoading = signal(false);


  step = signal<'email' | 'token' | 'questions'>('email');
  userEmail = signal<string>('');

  trackById(index: number, item: IQuestion): number {
  return item.id;
  }


  form: FormGroup = this.fb.group({
  email: ['', [Validators.required, Validators.email,  Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
  });

  constructor(private router: Router, private auth: AuthService) {}




  ngOnInit(): void {
    this.form = this.fb.group({
       email: this.fb.control('', [
        Validators.required,
        Validators.email,
      ]),
    })
  }

  goToQuestions() {
    const email = this.form.value.email?.trim();
      if (!email) {
      Swal.fire('⚠️ Campo vacío', 'Por favor ingresa tu correo electrónico.', 'warning');
      return;
    }
      this.router.navigate(['questions'], {
      queryParams: { email },
      relativeTo: this.router.routerState.root
    })

  }

  goToToken() {
    const email = this.form.value.email?.trim();
    if (!email) {
      Swal.fire('⚠️ Campo vacío', 'Por favor ingresa tu correo electrónico.', 'warning');
      return;
    }

    this.router.navigate(['token'], {
      queryParams: { email },
      relativeTo: this.router.routerState.root,
    });
  }



}
