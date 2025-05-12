import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ForumService } from '../services/forum.service';
import { Topic } from '../models/topic.model';
import { CommonModule } from '@angular/common';  // Para que funcione el pipe "date"
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {
  topics: Topic[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  isAdmin: boolean = false;  // Determina si el usuario es administrador

  constructor(private forumService: ForumService, private router: Router) {}

  ngOnInit(): void {
    // Actualiza isAdmin con la información real del usuario
    this.isAdmin = this.checkIfAdmin();
    console.log('¿El usuario es admin?', this.isAdmin);
    this.loadTopics();
  }

  /**
   * Verifica si el usuario es administrador leyendo el objeto "currentUser" del localStorage.
   * Se espera que "currentUser" contenga una propiedad "role" (e.g., "ADMIN" o "USER").
   */
  private checkIfAdmin(): boolean {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        console.log('Usuario obtenido:', user);
        console.log('Rol obtenido:', user.role);
        // Compara en mayúsculas para evitar problemas con case-sensitive
        return user.role && user.role.toUpperCase() === 'ADMIN';
      } catch (error) {
        console.error('Error al parsear el usuario desde localStorage:', error);
      }
    } else {
      console.warn('No se encontró currentUser en localStorage.');
    }
    return false;
  }

  // Carga los tópicos desde el backend
  loadTopics(): void {
    this.forumService.getTopics().subscribe(
      (topics: Topic[]) => {
        console.log('✅ Tópicos recibidos en ForumComponent:', topics);
        this.topics = topics;
        this.loading = false;
      },
      error => {
        console.error('❌ Error al cargar tópicos:', error);
        this.errorMessage = 'Error al cargar los tópicos.';
        this.loading = false;
      }
    );
  }

  // Navega al Home (asegúrate de que '/home' sea la ruta de la vista principal)
  navigateToHome(): void {
    console.log('✅ Navegando al Home');
    this.router.navigate(['/home']);
  }

  // Navega a la vista para ver comentarios del tópico
  viewComments(topicId: number): void {
    console.log(`✅ Navegando a comentarios para el tópico con ID: ${topicId}`);
    this.router.navigate([`/comments/${topicId}`]);
  }

  // Navega a la vista para agregar un comentario al tópico
  addComment(topicId: number): void {
    console.log(`✅ Navegando a agregar comentario para el tópico con ID: ${topicId}`);
    this.router.navigate([`/add-comment/${topicId}`]);
  }

  // Navega a la vista para editar el tópico (solo disponible para admin)
  editTopic(topic: Topic): void {
    console.log('✅ Editando tópico:', topic);
    this.router.navigate([`/edit-topic/${topic.id}`]);
  }
}