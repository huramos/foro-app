import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario correctamente', () => {
    expect(component.registerForm.contains('username')).toBeTrue();
    expect(component.registerForm.contains('email')).toBeTrue();
    expect(component.registerForm.contains('password')).toBeTrue();
    expect(component.registerForm.contains('gender')).toBeTrue();
  });

  it('debería marcar el formulario como inválido si está vacío', () => {
    expect(component.registerForm.valid).toBeFalse();
  });

  it('debería marcar inválido el email si tiene un formato incorrecto', () => {
    component.registerForm.controls['email'].setValue('invalid-email');
    expect(component.registerForm.controls['email'].valid).toBeFalse();
  });

  it('debería marcar inválido el password si no cumple con el patrón de seguridad', () => {
    component.registerForm.controls['password'].setValue('abc123');
    expect(component.registerForm.controls['password'].valid).toBeFalse();
  });

  it('debería validar correctamente cuando se ingresan valores válidos', () => {
    component.registerForm.setValue({
      username: 'NuevoUsuario',
      email: 'nuevo@example.com',
      password: 'SecurePass123!',
      gender: 'Masculino'
    });
    expect(component.registerForm.valid).toBeTrue();
  });


  it('debería mostrar mensaje de error si el usuario ya existe', () => {
    authServiceSpy.register.and.returnValue(throwError(() => ({ status: 409 })));

    component.onSubmit();

    expect(component.errorMessage).toEqual('El usuario ya existe. Prueba con otro nombre.');
  });

  it('debería mostrar mensaje de error si el servidor falla', () => {
    authServiceSpy.register.and.returnValue(throwError(() => ({ status: 500 })));

    component.onSubmit();

    expect(component.errorMessage).toEqual('Error interno del servidor. Inténtalo más tarde.');
  });

  it('debería mostrar mensaje de error genérico si ocurre otro tipo de error', () => {
    authServiceSpy.register.and.returnValue(throwError(() => ({ status: 400 })));

    component.onSubmit();

    expect(component.errorMessage).toEqual('No se pudo completar el registro.');
  });

  it('debería navegar al login cuando se llama a onLogin()', () => {
    component.onLogin();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});