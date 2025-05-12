import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ForumService } from '../services/forum.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Comment } from '../models/comment.model'; // Importación correcta del modelo

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  topicId!: number;
  comments: Comment[] = []; // Se inicia como array vacío

  constructor(
    private route: ActivatedRoute, 
    private forumService: ForumService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    // Se obtiene el ID del tópico desde la ruta
    this.topicId = Number(this.route.snapshot.paramMap.get('id'));
    
    if (!this.isValidId(this.topicId)) {
      console.error('❌ Error: ID del tópico no es válido');
      return;
    }
    
    this.loadComments();
  }

  loadComments(): void {
    this.forumService.getComments(this.topicId).pipe(
      catchError(error => {
        console.error('❌ Error al obtener los comentarios:', error);
        return of([]); // Retornamos un array vacío en caso de error
      })
    ).subscribe(response => {
      console.log('💬 Comentarios recibidos:', response);
      
      // Convertimos la respuesta a 'any' para poder acceder a sus propiedades
      const res: any = response;

      if (Array.isArray(res)) {
        // Si la respuesta es directamente un array
        this.comments = res.map((comment: any) => this.transformComment(comment));
      } else if (res && typeof res === 'object') {
        // Si la respuesta es un objeto, revisamos propiedades comunes que contengan el array
        if (Array.isArray(res.comments)) {
          this.comments = res.comments.map((comment: any) => this.transformComment(comment));
        } else if (Array.isArray(res.content)) {
          this.comments = res.content.map((comment: any) => this.transformComment(comment));
        } else if (Array.isArray(res.data)) {
          this.comments = res.data.map((comment: any) => this.transformComment(comment));
        } else {
          console.error("❌ Error: La respuesta del backend no contiene un array válido", res);
          this.comments = []; // Se asigna un array vacío para evitar el error en ngFor
        }
      } else {
        console.error("❌ Error: La respuesta del backend no es válida", res);
        this.comments = []; // Se asigna un array vacío para evitar el error en ngFor
      }
    });
  }

  // Se transforma cada objeto recibido a un objeto de tipo Comment
  private transformComment(comment: any): Comment {
    return {
      id: comment.id ?? 0,
      topicId: comment.topicId ?? null,
      username: comment.username ?? 'Usuario desconocido',
      content: comment.content ?? '',
      createdAt: new Date(comment.createdAt ?? new Date())
    };
  }

  navigateToForum(): void {
    this.router.navigate(['/forum']);
  }

  // Función auxiliar para validar que el ID es un número mayor a 0
  private isValidId(id: number): boolean {
    return !isNaN(id) && id > 0;
  }
}