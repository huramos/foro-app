import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let routerMock: Router;

  beforeEach(() => {
    // Establecemos datos en localStorage para las pruebas
    localStorage.setItem(
      'registeredUsers',
      JSON.stringify([{ username: 'TestUser', email: 'test@example.com', gender: 'Masculino' }])
    );

    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HomeComponent, ReactiveFormsModule],
      providers: [{ provide: Router, useValue: routerMock }]
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería cargar datos del usuario desde localStorage', () => {
    expect(component.userData.username).toBe('TestUser');
  });

  it('debería activar edición al hacer clic en Editar', () => {
    component.toggleEdit();
    fixture.detectChanges();
    expect(component.isEditing).toBeTrue();
    expect(component.profileForm.get('email')?.enabled).toBeTrue();
  });

  it('debería guardar los cambios en localStorage y desactivar edición', () => {
    // Activamos el modo edición para que los controles se habiliten y se pueda guardar el cambio.
    component.toggleEdit();
    fixture.detectChanges();

    spyOn(localStorage, 'setItem');

    // Establecemos valores válidos. Note que username se mantiene inalterable (está deshabilitado)
    component.profileForm.setValue({
      username: 'TestUser',
      email: 'test@example.com',
      gender: 'Masculino'
    });
    fixture.detectChanges();

    component.saveChanges();

    expect(localStorage.setItem).toHaveBeenCalled();
    expect(component.isEditing).toBeFalse();
  });

  it('debería redirigir al login cuando logout() es llamado', () => {
    component.logout();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('no debería guardar cambios si el formulario es inválido', () => {
    // Activamos el modo edición en primer lugar
    component.toggleEdit();
    fixture.detectChanges();

    spyOn(localStorage, 'setItem');

    // Establecemos valores inválidos
    component.profileForm.setValue({ username: '', email: '', gender: '' });
    fixture.detectChanges();

    component.saveChanges();

    expect(localStorage.setItem).not.toHaveBeenCalled();
    // En edición, si el formulario es inválido, se mantiene en modo edición
    expect(component.isEditing).toBeTrue();
  });
});