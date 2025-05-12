import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let routerMock: Router;

  beforeEach(() => {
    // Configuramos localStorage con datos de usuario para pruebas
    localStorage.setItem(
      'registeredUsers',
      JSON.stringify([{ username: 'TestUser', email: 'test@example.com', gender: 'Masculino' }])
    );

    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HomeComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [{ provide: Router, useValue: routerMock }]
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería cargar datos del usuario desde localStorage', () => {
    expect(component.userData.username).toBe('TestUser');
  });

  it('debería manejar la ausencia de usuario en localStorage sin errores', () => {
    localStorage.removeItem('registeredUsers');
    // Forzamos la recarga de datos
    component.ngOnInit();
    expect(component.userData).toBeUndefined();
  });

  it('debería activar edición al hacer clic en Editar', () => {
    component.toggleEdit();
    fixture.detectChanges();
    expect(component.isEditing).toBeTrue();
    expect(component.profileForm.get('email')?.enabled).toBeTrue();
  });

  it('debería guardar los cambios en localStorage y desactivar edición', () => {
    // Activamos modo edición
    component.toggleEdit();
    fixture.detectChanges();

    spyOn(localStorage, 'setItem');

    // Asumimos valores válidos (por ejemplo, username se mantiene inalterable si está deshabilitado)
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

  it('no debería guardar cambios si el formulario es inválido', () => {
    component.toggleEdit();
    fixture.detectChanges();

    spyOn(localStorage, 'setItem');
    // Configuramos valores inválidos
    component.profileForm.setValue({ username: '', email: '', gender: '' });
    fixture.detectChanges();
    component.saveChanges();

    expect(localStorage.setItem).not.toHaveBeenCalled();
    expect(component.isEditing).toBeTrue();
  });

  it('debería redirigir al login cuando logout() es llamado', () => {
    component.logout();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});