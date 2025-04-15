import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';

export const routes: Routes = [
  { path: 'password-reset', component: PasswordResetComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent }, // Ruta para el registro
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
