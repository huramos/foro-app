import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import * as crypto from 'crypto-js';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registeredUsers: any[] = [];

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.registeredUsers = this.getStoredUsers();
  }

  private getStoredUsers(): any[] {
    if (typeof window !== 'undefined' && localStorage) {
      const storedUsers = localStorage.getItem('registeredUsers');
      return storedUsers ? JSON.parse(storedUsers) : [];
    }
    return [];
  }

  onSubmit(): void {
    const user = this.registeredUsers.find((u: any) => u.username === this.loginForm.value.username);
    if (user && crypto.SHA256(this.loginForm.value.password).toString() === crypto.SHA256(user.password).toString()) {
      alert('Inicio de sesión exitoso!');
      this.router.navigate(['/home']);
    } else {
      alert('Usuario o contraseña incorrectos.');
    }
  }

  onRegister(): void {
    this.router.navigate(['/register']);
  }

  onForgotPassword(): void {
    this.router.navigate(['/password-reset']);
  }
}