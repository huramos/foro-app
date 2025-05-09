import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  userData: any = {};
  profileForm: FormGroup;
  isEditing: boolean = false;

  constructor(private fb: FormBuilder, private router: Router) {
    // Inicialmente, se crean los controles. username se queda deshabilitado siempre; 
    // email y gender se deshabilitan hasta que se active el modo edición.
    this.profileForm = this.fb.group({
      username: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, Validators.required],
      gender: [{ value: '', disabled: true }, Validators.required]
    });
  }

  ngOnInit(): void {
    const storedUsers = localStorage.getItem('registeredUsers');
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    if (users.length > 0) {
      this.userData = users[users.length - 1];
      this.profileForm.patchValue({
        username: this.userData.username,
        email: this.userData.email,
        gender: this.userData.gender
      });
    }
    // Aseguramos que los controles de email y gender se mantengan deshabilitados
    this.profileForm.get('email')?.disable();
    this.profileForm.get('gender')?.disable();
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
    if (this.profileForm.valid && this.userData) {
      const updatedProfile = this.profileForm.value;
      // Nota: dado que algunos controles pueden estar deshabilitados,
      // su valor no se incluye en form.value, por ello, para username usamos el valor existente.
      this.userData = { ...this.userData, ...updatedProfile };

      const storedUsers = localStorage.getItem('registeredUsers');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      users[users.length - 1] = this.userData;

      localStorage.setItem('registeredUsers', JSON.stringify(users));
      this.isEditing = false;
      alert('¡Cambios guardados!');
    } else {
      console.warn('Formulario inválido, no se guardaron cambios.');
    }
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}