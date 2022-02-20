import { ChildEntity, ManyToOne } from 'typeorm';

import { Like } from './like.entity';
import { Comment } from '../../comment/entities/comment.entity';

@ChildEntity()
export class CommentLike extends Like {
  @ManyToOne(() => Comment, (comment) => comment.likes)
  comment: Comment;
}
