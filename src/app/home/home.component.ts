import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/user.service'; // ✅ Asegura que la ruta es correcta
import { HttpErrorResponse } from '@angular/common/http'; // ✅ Manejo preciso de errores HTTP

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userData: any = {};
  profileForm: FormGroup;
  isEditing: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService) {
    this.profileForm = this.fb.group({
      username: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      gender: [{ value: '', disabled: true }, Validators.required]
    });
  }

  ngOnInit(): void {
    // 🔹 Obtiene el usuario actual desde `localStorage`
    const storedUser = localStorage.getItem('currentUser');

    if (!storedUser) {
      console.error('No se encontró usuario en localStorage. Redirigiendo al login...');
      this.router.navigate(['/login']); // ✅ Redirige al login si no hay usuario
      return;
    }

    const currentUser = JSON.parse(storedUser);
    const username = currentUser.username;

    if (!username) {
      console.error('Username indefinido. Redirigiendo al login...');
      this.router.navigate(['/login']);
      return;
    }

    // 🔹 Obtiene el perfil del usuario desde el backend con el `username`
    this.userService.getUserProfile(username).subscribe(
      (response: any) => {
        this.userData = response;

        if (this.userData) {
          this.profileForm.patchValue({
            username: this.userData.username,
            email: this.userData.email,
            gender: this.userData.gender
          });
        }
      },
      (error: HttpErrorResponse) => { // ✅ Manejo preciso del error HTTP
        console.error(`Error ${error.status}:`, error.message);
        if (error.status === 404) {
          console.warn('El usuario no existe en la base de datos.');
          this.router.navigate(['/login']); // ✅ Redirige si el usuario no existe en la BD
        }
      }
    );
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.profileForm.get('email')?.enable();
      this.profileForm.get('gender')?.enable();
    } else {
      this.profileForm.get('email')?.disable();
      this.profileForm.get('gender')?.disable();
    }
  }

  saveChanges(): void {
    if (this.profileForm.valid) {
      const updatedProfile = this.profileForm.getRawValue();
      const username = this.userData.username; // ✅ Se obtiene el username del usuario logueado

      this.userService.updateUserProfile(username, updatedProfile).subscribe( // ✅ Se pasa `username` como parámetro
        (response: any) => { // ✅ Se recibe la respuesta con los datos actualizados
          this.userData = response;

          // ✅ Guarda los datos actualizados en `localStorage`
          localStorage.setItem('currentUser', JSON.stringify(this.userData));

          alert('¡Cambios guardados!');
          this.isEditing = false;
        },
        (error: HttpErrorResponse) => { // ✅ Corrección en el manejo de errores
          console.error(`Error ${error.status}:`, error.message);
        }
      );
    } else {
      console.warn('Formulario inválido, no se guardaron cambios.');
    }
  }

  logout(): void {
    localStorage.removeItem('currentUser'); // ✅ Se elimina usuario al cerrar sesión
    this.router.navigate(['/login']);
  }

  // 🔹 Nuevo método para navegar al foro
  navigateToForum(): void {
    this.router.navigate(['/forum']);
  }
}