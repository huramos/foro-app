import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(() => {
    localStorage.setItem(
      'registeredUsers',
      JSON.stringify([{ username: 'TestUser', email: 'test@example.com', gender: 'Masculino' }])
    );

    TestBed.configureTestingModule({
      imports: [HomeComponent, ReactiveFormsModule],
      providers: [{ provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }]
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería guardar cambios correctamente', () => {
    component.profileForm.patchValue({ username: 'TestUser' });
    component.saveChanges();

    // ✅ Verificar directamente el valor actualizado en `component.userData`
    expect(component.userData.username).toBe('TestUser');
  });
});