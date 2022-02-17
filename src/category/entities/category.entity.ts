import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Question } from '../../question/entities/question.entity';

@Entity({ name: 'categories', orderBy: { id: 'DESC' } })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Question, (question) => question.category)
  questions: Question[];
}
