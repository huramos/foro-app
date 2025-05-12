import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Topic } from '../models/topic.model';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private baseUrl = 'http://localhost:8081';
  private topicsUrl = `${this.baseUrl}/topics`;
  private commentsUrl = `${this.baseUrl}/comments`;

  constructor(private http: HttpClient) {}

  // 🔹 Obtiene los tópicos del foro.
  // Verifica si la respuesta es un arreglo directo o un objeto con la propiedad "topics".
  getTopics(): Observable<Topic[]> {
    return this.http.get<{ topics: Topic[] } | Topic[]>(this.topicsUrl).pipe(
      tap(response => console.log('✅ Respuesta del backend para tópicos:', response)),
      map(response => {
         if (Array.isArray(response)) {
            console.log('✅ Recibido arreglo directo de tópicos.');
            return response;
         } else if (response && response.topics) {
            console.log('✅ Recibido objeto de tópicos; extrayendo propiedad "topics".');
            return response.topics;
         } else {
            console.warn('⚠️ Estructura inesperada en la respuesta de tópicos:', response);
            return [];
         }
      }),
      catchError(error => {
         console.error('❌ Error al obtener los tópicos:', error);
         return throwError(() => new Error('Error al obtener los tópicos del foro'));
      })
    );
  }

  // 🔹 Obtiene los comentarios de un tópico.
  // Verifica si la respuesta es un arreglo directo o un objeto con la propiedad "comments".
  getComments(topicId: number): Observable<Comment[]> {
    return this.http.get<{ comments: Comment[] } | Comment[]>(`${this.commentsUrl}/topic/${topicId}`).pipe(
      tap(response => console.log(`✅ Respuesta del backend para comentarios del tópico ${topicId}:`, response)),
      map(response => {
         if (Array.isArray(response)) {
            console.log('✅ Recibido arreglo directo de comentarios.');
            return response;
         } else if (response && response.comments) {
            console.log('✅ Recibido objeto de comentarios; extrayendo propiedad "comments".');
            return response.comments;
         } else {
            console.warn('⚠️ Estructura inesperada en la respuesta de comentarios:', response);
            return [];
         }
      }),
      catchError(error => {
         console.error(`❌ Error al obtener comentarios del tópico ${topicId}:`, error);
         return throwError(() => new Error(`Error al obtener los comentarios del tópico ${topicId}`));
      })
    );
  }

  // 🔹 Crea un nuevo comentario en un tópico.
  createComment(comment: Comment): Observable<Comment> {
    if (!comment.content.trim() || !comment.topicId) {
      return throwError(() => new Error('❌ Error: El comentario debe tener contenido y pertenecer a un tópico.'));
    }
    
    return this.http.post<Comment>(this.commentsUrl, comment).pipe(
      tap(response => console.log('✅ Comentario agregado:', response)),
      catchError(error => {
         console.error('❌ Error al agregar comentario:', error);
         return throwError(() => new Error('Error al agregar comentario.'));
      })
    );
  }
}