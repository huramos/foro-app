import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ActivatedRoute, Router } from '@angular/router';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { firstChild: { data: { title: 'TestTitle' } } } }
        },
        {
          provide: Router,
          useValue: { events: { subscribe: (fn: any) => fn({}) } }
        }
      ]
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería tener el título correcto', () => {
    expect(component.title).toBe('TestTitle'); // ✅ Se mockea correctamente el valor de `ActivatedRoute`
  });
});