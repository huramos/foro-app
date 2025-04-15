import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule], // Se importa RouterModule para habilitar `router-outlet`
  template: '<router-outlet></router-outlet>'
})
export class AppComponent { 
  title = 'Foro App'; // Se agrega `title` para evitar errores
}
