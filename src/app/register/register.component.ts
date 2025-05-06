import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

interface User {
  username: string;
  email: string;
  password: string;
  gender: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  registrationMessage: string = '';

  constructor(private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/)
      ]],
      gender: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const newUser: User = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password, // ✅ Se guarda sin cifrar para recuperación
      gender: this.registerForm.value.gender
    };

    this.storeUser(newUser);
    this.registrationMessage = '¡Registro exitoso! Redirigiendo a login...';

    setTimeout(() => this.router.navigate(['/login']), 2000);
  }

  private storeUser(user: User) {
    const storedUsers = localStorage.getItem('registeredUsers');
    const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

    const existingUser = users.find(u => u.username === user.username);
    if (existingUser) {
      alert('El usuario ya está registrado. Prueba con otro nombre.');
      return;
    }

    users.push(user);
    localStorage.setItem('registeredUsers', JSON.stringify(users));
  }

  onLogin() {
    this.router.navigate(['/login']);
  }
}