import { ChildEntity, ManyToOne } from 'typeorm';

import { Like } from './like.entity';
import { Question } from '../../question/entities/question.entity';

@ChildEntity()
export class QuestionLike extends Like {
  @ManyToOne(() => Question, (question) => question.likes)
  question: Question;
}
