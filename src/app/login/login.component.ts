import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService, LoginResponse } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Ya no se carga la lista de usuarios local.
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    // Se prepara la información de login (ya no hace hashing en el front).
    const credentials = this.loginForm.value;
    
    this.authService.login(credentials).subscribe(
      (response: LoginResponse) => {
        // Al recibir el token, lo almacenamos en localStorage o en otro lugar seguro
        localStorage.setItem('token', response.token);
        alert('Inicio de sesión exitoso!');
        this.router.navigate(['/home']);
      },
      error => {
        console.error('Error en el login:', error);
        this.errorMessage = 'Usuario o contraseña incorrectos.';
        alert('Usuario o contraseña incorrectos.');
      }
    );
  }

  onRegister(): void {
    this.router.navigate(['/register']);
  }

  onForgotPassword(): void {
    this.router.navigate(['/password-reset']);
  }
}