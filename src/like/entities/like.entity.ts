import {
  Entity,
  TableInheritance,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../user/entities/user.entity';

@Entity({ name: 'likes', orderBy: { id: 'DESC' } })
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.likes, { eager: true })
  user: User;
}
