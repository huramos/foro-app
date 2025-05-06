import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordResetComponent } from './password-reset.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('PasswordResetComponent', () => {
  let component: PasswordResetComponent;
  let fixture: ComponentFixture<PasswordResetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PasswordResetComponent, ReactiveFormsModule]
    });

    fixture = TestBed.createComponent(PasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería manejar correos registrados y no registrados correctamente', () => {
    localStorage.setItem('registeredUsers', JSON.stringify([{ email: 'test@example.com', password: '123456' }]));

    component.passwordResetForm.setValue({ email: 'test@example.com' });
    component.onResetSubmit();
    expect(component.recoveryMessage).toBe('Contraseña recuperada correctamente.');

    component.passwordResetForm.setValue({ email: 'invalid@example.com' });
    component.onResetSubmit();
    expect(component.recoveryMessage).toBe('No se encontró una cuenta con este correo.');
  });
});