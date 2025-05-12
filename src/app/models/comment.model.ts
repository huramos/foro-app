export interface Comment {
  id: number;          // ✅ Número único del comentario (NUMBER(19,0))
  topicId: number | null;  // ✅ Puede ser NULL (NUMBER(19,0))
  username: string;    // ✅ Usuario que publicó el comentario (VARCHAR2(255))
  content: string;     // ✅ Texto del comentario (VARCHAR2(1000))
  createdAt: Date;     // ✅ Fecha de creación (TIMESTAMP(6))
}