import { Router, } from '@angular/router';
import {  Component, EventEmitter, Output, signal, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IQuestion } from '../interfaces/interfaces';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-token-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './token-form.component.html' ,
  styleUrl: './token-form.component.css',
})
export class TokenForm {

  @Input() email!: string;
  private fb = new FormBuilder();

  form = this.fb.group({
    token: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

  constructor(private router: Router, private auth: AuthService) {}

    ngOnInit(): void {
    this.form = this.fb.group({
        token: this.fb.control('', [
        Validators.required,
        Validators.pattern(/^\d{6}$/),
      ]),
    });

  }

  onSubmit(): void {
    const token = this.form.value.token;
    if (!token) {
      Swal.fire('Error, ingresa el token correcto');
      return;
    }

    this.auth.validateToken(this.email, token).subscribe({
      next: (res) => {
        if (res.success) {
          Swal.fire('✅ Correcto', 'Token válido.', 'success').then(() => {
            this.router.navigate(['/dashboard']);
          });
        } else {
          Swal.fire('❌ Token incorrecto', 'Intenta de nuevo.', 'error').then(() => {
            this.router.navigate(['/auth']);
          });
        }
      },
      error: () => Swal.fire('Error', 'No se pudo validar el token.', 'error'),
    });
  }


  goBack() {
    this.router.navigate(['/auth']);
  }
}
