import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

interface User {
  email: string;
  password: string;
}

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

  constructor(private fb: FormBuilder) {
    this.passwordResetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onResetSubmit() {
    const storedUsers = localStorage.getItem('registeredUsers');
    const users: User[] = storedUsers ? JSON.parse(storedUsers) : []; // ✅ Evita `null`

    const userEmail = this.passwordResetForm.value.email as string; // ✅ Strict typing
    const user = users.find((u: User) => u.email === userEmail);

    if (user) {
      this.recoveredPassword = user.password;
      this.recoveryMessage = 'Contraseña recuperada correctamente.';
      this.passwordVisible = true;
    } else {
      this.recoveryMessage = 'No se encontró una cuenta con este correo.';
    }
  }

  copyPassword() {
    navigator.clipboard.writeText(this.recoveredPassword);
    alert('Contraseña copiada al portapapeles.');
  }

  onBack() {
    window.history.back();
  }
}