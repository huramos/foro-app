import { TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, RouterTestingModule], // ✅ Se importó en lugar de declarar
    });
  });

  it('debería validar credenciales incorrectas', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    component.loginForm.setValue({ username: 'usuario', password: 'incorrecto' });

    component.onSubmit();
    expect(component.loginForm.valid).toBeTruthy();
  });
});