import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  registrationMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/)
      ]],
      gender: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.clearForm();
  }

  private clearForm(): void {
    this.registerForm.reset(); // ✅ Limpia el formulario
    sessionStorage.clear(); // ✅ Borra cualquier dato previo almacenado en la sesión
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.authService.register(this.registerForm.value).subscribe(
      response => {
        this.registrationMessage = '¡Registro exitoso! Redirigiendo a login...';
        this.clearForm();
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error => {
        console.error('Error en el registro:', error);

        if (error.status === 409) {
          this.errorMessage = 'El usuario ya existe. Prueba con otro nombre.';
        } else if (error.status === 500) {
          this.errorMessage = 'Error interno del servidor. Inténtalo más tarde.';
        } else {
          this.errorMessage = 'No se pudo completar el registro.';
        }
      }
    );
  }

  onLogin() {
    this.router.navigate(['/login']);
  }
}