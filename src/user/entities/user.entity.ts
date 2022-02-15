import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { hash, compare } from 'bcrypt';

import { UserRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';

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

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  comparePassword(password: string): Promise<boolean> {
    return compare(password, this.password);
  }
}