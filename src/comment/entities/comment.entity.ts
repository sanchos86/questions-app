import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  DeleteDateColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Question } from '../../question/entities/question.entity';
import { User } from '../../user/entities/user.entity';
import { CommentLike } from '../../like/entities/comment-like.entity';

@Entity({ name: 'comments' })
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

  @OneToMany(() => CommentLike, (like) => like.comment)
  likes: CommentLike[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
