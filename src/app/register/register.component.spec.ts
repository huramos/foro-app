import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import * as crypto from 'crypto-js';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule],
      providers: [{ provide: Router, useValue: routerSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería inicializar el formulario correctamente', () => {
    expect(component.registerForm).toBeDefined();
  });

  it('debería mostrar mensaje de error si el formulario es inválido', () => {
    component.registerForm.setValue({ username: '', email: '', password: '', gender: '' });
    component.onSubmit();
    expect(component.registrationMessage).toEqual('');
  });

  it('debería almacenar usuario en localStorage tras registro exitoso', () => {
    component.registerForm.setValue({
      username: 'NuevoUsuario',
      email: 'nuevo@example.com',
      password: 'SecurePass123!',
      gender: 'Masculino'
    });

    component.onSubmit();

    const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    expect(storedUsers.length).toBeGreaterThan(0);
  });

  it('debería redirigir a login al hacer clic en "Iniciar sesión"', () => {
    component.onLogin();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});