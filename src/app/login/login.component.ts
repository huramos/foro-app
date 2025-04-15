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
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  registeredUsers: User[] = [];

  constructor(private router: Router) {
    const storedUsers = localStorage.getItem('registeredUsers');
    this.registeredUsers = storedUsers ? JSON.parse(storedUsers) : [];
  }

  onSubmit() {
    const user = this.registeredUsers.find((u: User) => u.username === this.username && u.password === this.password);

    if (user) {
      console.log('Inicio de sesión exitoso:', user);
      alert('¡Inicio de sesión exitoso!');
      this.router.navigate(['/home']);
    } else {
      alert('Usuario o contraseña inválidos');
    }
  }

  onRegister() {
    this.router.navigate(['/register']);
  }

  onForgotPassword() {
    this.router.navigate(['/password-reset']);
  }
}