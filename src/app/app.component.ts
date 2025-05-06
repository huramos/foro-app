import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule], // ✅ Importado para que `router-outlet` funcione correctamente
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'foro-app';

  constructor(private route: ActivatedRoute, private router: Router) {
    this.router.events.subscribe(() => {
      const routeData = this.route.snapshot.firstChild?.data;
      this.title = routeData ? routeData['title'] || 'foro-app' : 'foro-app';
    });
  }
}