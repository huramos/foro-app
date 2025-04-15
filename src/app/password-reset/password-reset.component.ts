import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface User {
  username: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent {
  email: string = '';
  recoveredPassword: string = '';
  passwordVisible: boolean = false;

  constructor(private router: Router) {}

  onResetSubmit() {
    const storedUsers = localStorage.getItem('registeredUsers');
    const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

    const user = users.find((u: User) => u.email === this.email);

    if (user) {
      this.recoveredPassword = user.password; // Recuperar la contraseña registrada
      this.passwordVisible = true;
    } else {
      alert('No se encontró una cuenta con este correo.');
    }
  }

  copyPassword() {
    navigator.clipboard.writeText(this.recoveredPassword);
    alert('Contraseña copiada al portapapeles.');
  }

  onBack() {
    this.router.navigate(['/login']); // Redirige a la pantalla de inicio de sesión
  }
}