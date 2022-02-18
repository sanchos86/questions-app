import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { Category } from '../../category/entities/category.entity';
import { Comment } from '../../comment/entities/comment.entity';

@Entity({ name: 'questions', orderBy: { id: 'DESC' } })
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'longtext', comment: 'Question text without html tags' })
  plainText: string;

  @Column({ type: 'longtext', comment: 'Question text with html tags' })
  formattedText: string;

  @Column({
    type: 'json',
    comment: 'https://quilljs.com/docs/delta/',
  })
  content: string;

  @ManyToOne(() => User, (user) => user.questions)
  user: User;

  @ManyToOne(() => Category, (category) => category.questions)
  category: Category;

  @OneToMany(() => Comment, (comment) => comment.question)
  comments: Comment[];
}
