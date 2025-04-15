import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface User {
  username: string;
  email: string;
  password: string;
  gender: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  gender: string = '';
  registeredUsers: User[] = [];

  constructor(private router: Router) {
    const storedUsers = localStorage.getItem('registeredUsers');
    this.registeredUsers = storedUsers ? JSON.parse(storedUsers) : [];
  }

  onRegisterSubmit() {
    if (!this.username) {
      alert('El usuario es obligatorio.');
      return;
    }

    if (!this.validateEmail(this.email)) {
      alert('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    if (!this.validatePassword(this.password)) {
      alert('La contraseña no cumple con los requisitos de seguridad.');
      return;
    }

    const newUser: User = {
      username: this.username,
      email: this.email,
      password: this.password,
      gender: this.gender
    };

    this.registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(this.registeredUsers));

    alert('¡Registro exitoso!');
    this.router.navigate(['/login']);
  }

  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  validatePassword(password: string): boolean {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);

    return hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  }
}