import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let routerMock: any;

  beforeEach(() => {
    const testUser = { username: 'testuser', password: '123456' };
    localStorage.setItem('registeredUsers', JSON.stringify([testUser]));

    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [{ provide: Router, useValue: routerMock }]
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el formulario con los controles requeridos', () => {
    expect(component.loginForm.contains('username')).toBeTrue();
    expect(component.loginForm.contains('password')).toBeTrue();
  });

  it('debería tener un formulario inválido cuando está vacío', () => {
    expect(component.loginForm.valid).toBeFalse();
  });

  it('debería tener un formulario válido con entradas correctas', () => {
    component.loginForm.setValue({ username: 'testuser', password: '123456' });
    expect(component.loginForm.valid).toBeTrue();
  });

  it('debería navegar a /home y mostrar alerta al iniciar sesión con credenciales válidas', () => {
    spyOn(window, 'alert');
    component.loginForm.setValue({ username: 'testuser', password: '123456' });
    component.onSubmit();
    expect(window.alert).toHaveBeenCalledWith('Inicio de sesión exitoso!');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('debería mostrar alerta de error para credenciales incorrectas', () => {
    spyOn(window, 'alert');
    component.loginForm.setValue({ username: 'testuser', password: 'wrongpass' });
    component.onSubmit();
    expect(window.alert).toHaveBeenCalledWith('Usuario o contraseña incorrectos.');
  });

  it('debería navegar a /register al llamar onRegister()', () => {
    component.onRegister();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/register']);
  });

  it('debería navegar a /password-reset al llamar onForgotPassword()', () => {
    component.onForgotPassword();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/password-reset']);
  });
});