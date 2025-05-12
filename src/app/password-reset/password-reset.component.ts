import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent {
  passwordResetForm: FormGroup;
  recoveryMessage: string = '';
  passwordVisible = false;
  recoveredPassword: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.passwordResetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onResetSubmit() {
    const userEmail = this.passwordResetForm.value.email as string;

    this.http.post<{ password?: string, error?: string }>('http://localhost:8082/auth/recover-password', { email: userEmail })
      .subscribe({
        next: (response) => {
          console.log('🔎 Respuesta del servidor:', response); // ✅ Muestra la respuesta del backend

          if (response.password) {
            this.recoveredPassword = response.password;
            this.recoveryMessage = 'Contraseña recuperada correctamente.';
            this.passwordVisible = true;
          } else {
            this.recoveryMessage = response.error || 'No se encontró una cuenta con este correo.';
            this.passwordVisible = false;
          }
        },
        error: () => {
          this.recoveryMessage = 'Error al procesar la solicitud. Inténtalo más tarde.';
          this.passwordVisible = false;
        }
      });
  }

  copyPassword() {
    if (this.recoveredPassword) {
      navigator.clipboard.writeText(this.recoveredPassword);
      alert('Contraseña copiada al portapapeles.');
    }
  }

  onBack() {
    window.history.back();
  }
}