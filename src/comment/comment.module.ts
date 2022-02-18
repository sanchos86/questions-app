import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../user/entities/user.entity';
import { Question } from '../question/entities/question.entity';
import { Comment } from './entities/comment.entity';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Question])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
