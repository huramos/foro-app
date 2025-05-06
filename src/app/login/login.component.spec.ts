import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let routerMock: any;

  beforeEach(() => {
    // Configuramos localStorage con un usuario registrado para las pruebas.
    const testUser = { username: 'testuser', password: '123456' };
    localStorage.setItem('registeredUsers', JSON.stringify([testUser]));

    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [{ provide: Router, useValue: routerMock }]
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Llama a ngOnInit y recupera los usuarios.
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

  it('debería navegar a /home y mostrar alerta de éxito al iniciar sesión con credenciales válidas', () => {
    spyOn(window, 'alert');
    component.loginForm.setValue({ username: 'testuser', password: '123456' });
    component.onSubmit();
    expect(window.alert).toHaveBeenCalledWith('Inicio de sesión exitoso!');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('debería mostrar alerta de error cuando las credenciales son incorrectas', () => {
    spyOn(window, 'alert');
    component.loginForm.setValue({ username: 'testuser', password: 'wrongpass' });
    component.onSubmit();
    expect(window.alert).toHaveBeenCalledWith('Usuario o contraseña incorrectos.');
  });

  it('debería navegar a /register cuando se llama a onRegister()', () => {
    component.onRegister();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/register']);
  });

  it('debería navegar a /password-reset cuando se llama a onForgotPassword()', () => {
    component.onForgotPassword();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/password-reset']);
  });
});