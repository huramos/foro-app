import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, RouterModule } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // ✅ Se pasa la configuración de rutas aquí
    importProvidersFrom(RouterModule, ReactiveFormsModule) // ✅ Se importa RouterModule globalmente
  ]
}).catch(err => console.error(err));