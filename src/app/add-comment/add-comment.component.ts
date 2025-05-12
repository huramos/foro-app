import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ForumService } from '../services/forum.service';
import { Comment } from '../models/comment.model';

@Component({
  selector: 'app-add-comment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css']
})
export class AddCommentComponent implements OnInit {
  topicId!: number;
  commentContent: string = '';
  username: string = 'Usuario'; // ✅ Si deseas tomarlo de la sesión, cámbialo dinámicamente

  constructor(private route: ActivatedRoute, private forumService: ForumService, private router: Router) {}

  ngOnInit(): void {
    this.topicId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.isValidId(this.topicId)) {
      console.error('❌ ID de tópico inválido:', this.topicId);
      this.router.navigate(['/forum']); // ✅ Redirigir si el ID no es válido
    }
  }

  addComment(): void {
    if (!this.commentContent.trim()) {
      console.warn('⚠️ El comentario no puede estar vacío.');
      return;
    }

    const comment: Comment = {
      id: 0, // ✅ ID temporal, el backend debe asignar el ID correcto
      topicId: this.topicId,
      username: this.username, // ✅ Se toma del estado del componente o sesión
      content: this.commentContent.trim(), // ✅ Se limpia el contenido antes de enviarlo
      createdAt: new Date()
    };

    this.forumService.createComment(comment).subscribe(
      () => {
        console.log('✅ Comentario agregado correctamente');
        this.router.navigate([`/comments/${this.topicId}`]); // ✅ Redirige a la vista de comentarios del tópico
      },
      error => {
        console.error('❌ Error al agregar comentario:', error);
      }
    );
  }

  navigateToForum(): void {
    this.router.navigate(['/forum']);
  }

  private isValidId(id: number): boolean {
    return !isNaN(id) && id > 0;
  }
}