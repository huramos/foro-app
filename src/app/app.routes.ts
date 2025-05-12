import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { ForumComponent } from './forum/forum.component'; // ✅ Se agrega el nuevo componente

export const routes: Routes = [
  { path: 'password-reset', component: PasswordResetComponent, data: { title: 'Recuperar contraseña' } },
  { path: 'login', component: LoginComponent, data: { title: 'Iniciar sesión' } },
  { path: 'home', component: HomeComponent, data: { title: 'Mi perfil' } },
  { path: 'register', component: RegisterComponent, data: { title: 'Registro' } },
  { path: 'forum', component: ForumComponent, data: { title: 'Foro' } }, // ✅ Se agrega la ruta al foro
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];