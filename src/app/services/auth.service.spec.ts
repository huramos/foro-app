import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  // Agrega aquí pruebas adicionales según los métodos implementados en el servicio.
  // Por ejemplo, si tienes un método login(), podrías mockear una respuesta y verificar el comportamiento.
});