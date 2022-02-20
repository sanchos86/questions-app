import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { compare, hash } from 'bcrypt';

import { UserRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';
import { Question } from '../../question/entities/question.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { Like } from '../../like/entities/like.entity';

@Entity({ name: 'users', orderBy: { id: 'DESC' } })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.AUTHOR,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.CONFIRMATION_PROCESS,
  })
  status: UserStatus;

  @Exclude()
  @Column({ nullable: true })
  confirmationToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn({ nullable: true, default: null })
  deletedAt: Date;

  @OneToMany(() => Question, (question) => question.user)
  questions: Question[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  comparePassword(password: string): Promise<boolean> {
    return compare(password, this.password);
  }

  get isConfirmed() {
    return (
      this.confirmationToken === null && this.status === UserStatus.CONFIRMED
    );
  }
}
