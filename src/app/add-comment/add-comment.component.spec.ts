import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentsComponent } from '../comments/comments.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ForumService } from '../services/forum.service';
import { of, throwError } from 'rxjs';

// Stub para ParamMap que cumple con la interfaz requerida.
const paramMapStub = {
  get: (key: string) => '1',
  has: (key: string) => true,
  getAll: (key: string) => ['1'],
  keys: []
};

// Stub para ActivatedRoute utilizando el paramMap anterior.
const activatedRouteStub = {
  snapshot: {
    paramMap: paramMapStub
  }
};

describe('CommentsComponent', () => {
  let component: CommentsComponent;
  let fixture: ComponentFixture<CommentsComponent>;
  let forumServiceSpy: jasmine.SpyObj<ForumService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Creamos el spy para ForumService, simulando el método getComments.
    forumServiceSpy = jasmine.createSpyObj('ForumService', ['getComments']);
    // Creamos el spy para Router.
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [CommentsComponent],
      providers: [
        { provide: ForumService, useValue: forumServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CommentsComponent);
    component = fixture.componentInstance;
  });

  it('should create and assign topicId correctly', () => {
    fixture.detectChanges(); // Llama a ngOnInit
    expect(component).toBeTruthy();
    expect(component.topicId).toBe(1);
  });

  it('should not call loadComments if topicId is invalid', () => {
    // Forzamos un ID inválido: cambiamos el paramMap para que retorne '0'
    const invalidParamMap = {
      get: (key: string) => '0',
      has: (key: string) => true,
      getAll: (key: string) => ['0'],
      keys: []
    };
    const invalidActivatedRoute = { snapshot: { paramMap: invalidParamMap } };
    TestBed.overrideProvider(ActivatedRoute, { useValue: invalidActivatedRoute });
    fixture = TestBed.createComponent(CommentsComponent);
    component = fixture.componentInstance;
    spyOn(console, 'error');
    fixture.detectChanges();
    expect(console.error).toHaveBeenCalledWith('❌ Error: ID del tópico no es válido');
    expect(component.comments).toEqual([]);
  });

  describe('loadComments', () => {
    // Definimos sampleComment con createdAt como Date para cumplir la interfaz.
    const sampleComment = {
      id: 1,
      topicId: 1,
      username: 'user1',
      content: 'Hello world',
      createdAt: new Date('2020-01-01T00:00:00Z')
    };

    it('should process correctly when response is a direct array', () => {
      // Usamos "as any" para forzar la compatibilidad ya que la firma espera Comment[].
      forumServiceSpy.getComments.and.returnValue(of([sampleComment] as any));
      component.loadComments();
      expect(component.comments.length).toBe(1);
      expect(component.comments[0].id).toBe(sampleComment.id);
      expect(component.comments[0].username).toBe(sampleComment.username);
      expect(component.comments[0].createdAt instanceof Date).toBeTrue();
    });

    it('should process correctly when response has "comments" property', () => {
      forumServiceSpy.getComments.and.returnValue(of({ comments: [sampleComment] } as any));
      component.loadComments();
      expect(component.comments.length).toBe(1);
      expect(component.comments[0].content).toBe(sampleComment.content);
    });

    it('should process correctly when response has "content" property', () => {
      forumServiceSpy.getComments.and.returnValue(of({ content: [sampleComment] } as any));
      component.loadComments();
      expect(component.comments.length).toBe(1);
      expect(component.comments[0].id).toBe(sampleComment.id);
    });

    it('should process correctly when response has "data" property', () => {
      forumServiceSpy.getComments.and.returnValue(of({ data: [sampleComment] } as any));
      component.loadComments();
      expect(component.comments.length).toBe(1);
      expect(component.comments[0].username).toBe(sampleComment.username);
    });

    it('should assign an empty array if response does not contain a valid array', () => {
      spyOn(console, 'error');
      const response = { unknown: [] };
      forumServiceSpy.getComments.and.returnValue(of(response) as any);
      component.loadComments();
      expect(console.error).toHaveBeenCalledWith("❌ Error: La respuesta del backend no contiene un array válido", response);
      expect(component.comments).toEqual([]);
    });

    it('should assign an empty array if response is not valid', () => {
      spyOn(console, 'error');
      const response = "respuesta inválida";
      forumServiceSpy.getComments.and.returnValue(of(response) as any);
      component.loadComments();
      expect(console.error).toHaveBeenCalledWith("❌ Error: La respuesta del backend no es válida", response);
      expect(component.comments).toEqual([]);
    });

    it('should handle errors and assign an empty array', () => {
      spyOn(console, 'error');
      forumServiceSpy.getComments.and.returnValue(throwError(() => new Error('Test Error')) as any);
      component.loadComments();
      expect(console.error).toHaveBeenCalled();
      expect(component.comments).toEqual([]);
    });
  });

  describe('transformComment', () => {
    it('should transform a comment with default values when properties are missing', () => {
      const transformed = (component as any).transformComment({});
      expect(transformed.id).toBe(0);
      expect(transformed.topicId).toBeNull();
      expect(transformed.username).toBe('Usuario desconocido');
      expect(transformed.content).toBe('');
      expect(transformed.createdAt instanceof Date).toBeTrue();
    });

    it('should preserve provided comment values', () => {
      const input = {
        id: 5,
        topicId: 10,
        username: 'TestUser',
        content: 'Mensaje de prueba',
        createdAt: '2021-05-05T12:00:00Z'
      };
      const transformed = (component as any).transformComment(input);
      expect(transformed.id).toBe(5);
      expect(transformed.topicId).toBe(10);
      expect(transformed.username).toBe('TestUser');
      expect(transformed.content).toBe('Mensaje de prueba');
      expect(transformed.createdAt.toISOString()).toBe(new Date('2021-05-05T12:00:00Z').toISOString());
    });
  });

  it('should navigate to /forum when navigateToForum is called', () => {
    component.navigateToForum();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/forum']);
  });
});