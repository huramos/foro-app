import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userProfile: any; // Datos del usuario
  profileForm: FormGroup;
  isEditing: boolean = false; // Estado para habilitar/deshabilitar edición

  constructor(private fb: FormBuilder, private router: Router) {
    this.profileForm = this.fb.group({
      username: [''],
      email: [''],
      gender: ['']
    });
  }

  ngOnInit(): void {
    const storedUsers = localStorage.getItem('registeredUsers');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      this.userProfile = users[users.length - 1]; // Último usuario registrado
    }

    if (this.userProfile) {
      this.profileForm.patchValue({
        username: this.userProfile.username,
        email: this.userProfile.email,
        gender: this.userProfile.gender
      });
    }
  }

  enableEditing(): void {
    this.isEditing = true; // Habilitar edición
  }

  saveChanges(): void {
    if (this.profileForm.valid) {
      const updatedProfile = this.profileForm.value;
      this.userProfile = { ...this.userProfile, ...updatedProfile }; // Actualizar datos del usuario

      // Actualizar almacenamiento local (opcional, si guardas los cambios persistentes)
      const storedUsers = localStorage.getItem('registeredUsers');
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        users[users.length - 1] = this.userProfile; // Actualizar el último usuario
        localStorage.setItem('registeredUsers', JSON.stringify(users));
      }

      this.isEditing = false; // Deshabilitar edición
      alert('¡Cambios guardados!');
    }
  }

  onLogout(): void {
    console.log('Saliendo del perfil...');
    this.router.navigate(['/login']); // Redirigir al Login
  }
}