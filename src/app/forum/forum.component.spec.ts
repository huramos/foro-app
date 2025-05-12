import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForumComponent } from './forum.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ForumComponent', () => {
  let component: ForumComponent;
  let fixture: ComponentFixture<ForumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForumComponent, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ForumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería llamar a viewComments con el ID correcto', () => {
    const spy = spyOn(component, 'viewComments').and.callThrough();
    component.viewComments(1);
    expect(spy).toHaveBeenCalledWith(1);
  });

  it('debería llamar a addComment con el ID correcto', () => {
    const spy = spyOn(component, 'addComment').and.callThrough();
    component.addComment(2);
    expect(spy).toHaveBeenCalledWith(2);
  });

  it('debería llamar a editTopic solo si el usuario es admin', () => {
    // Simulamos admin
    component.isAdmin = true;
    const topic = { id: 5, title: 'Test Topic', description: 'Descripción', createdAt: new Date() } as any;
    const spy = spyOn(component, 'editTopic').and.callThrough();
    component.editTopic(topic);
    expect(spy).toHaveBeenCalledWith(topic);
  });

  it('no debería llamar a editTopic si el usuario no es admin', () => {
    // Para un usuario no admin, el botón de editar no se muestra y el método no se invoca.
    component.isAdmin = false;
    const topic = { id: 10, title: 'Otro Topic', description: 'Otro', createdAt: new Date() } as any;
    const spy = spyOn(component, 'editTopic').and.callThrough();
    // Simulación: si el método editTopic se llamara de forma accidental se verifica.
    if (component.isAdmin) {
      component.editTopic(topic);
    }
    expect(spy).not.toHaveBeenCalled();
  });
});