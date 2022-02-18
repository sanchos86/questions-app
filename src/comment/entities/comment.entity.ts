import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';

import { Question } from '../../question/entities/question.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'comments', orderBy: { id: 'DESC' } })
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'longtext' })
  text: string;

  @DeleteDateColumn({ nullable: true, default: null })
  deletedAt: Date;

  @ManyToOne(() => Question, (question) => question.comments)
  question: Question;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @OneToOne(() => Comment, { nullable: true })
  @JoinColumn()
  parentComment: Comment;
}
