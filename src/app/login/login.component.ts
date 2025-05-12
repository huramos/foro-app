import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService, LoginResponse } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http'; // ✅ Manejo preciso de errores HTTP

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
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {
    this.clearForm();
  }

  private clearForm(): void {
    this.loginForm.reset(); // ✅ Limpia el formulario completamente
    sessionStorage.clear(); // ✅ Borra cualquier dato previo almacenado
    this.loginForm.patchValue({ username: '', password: '' }); // ✅ Asegura que los valores sean vacíos
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe(
      (response: LoginResponse) => {
        // 🔹 Se almacena el usuario logueado en localStorage
        localStorage.setItem('currentUser', JSON.stringify(response));

        // ✅ Se imprime en consola para depuración
        console.log('Usuario almacenado en localStorage:', response);

        alert(`Bienvenido, ${response.username} (${response.role})`);
        this.router.navigate(['/home']);
      },
      (error: HttpErrorResponse) => { // ✅ Corrección en el manejo de errores
        console.error(`Error ${error.status}:`, error.message);
        this.errorMessage = 'Usuario o contraseña incorrectos.';
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