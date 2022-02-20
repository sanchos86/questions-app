import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../user/entities/user.entity';
import { Category } from '../category/entities/category.entity';
import { Question } from './entities/question.entity';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { QuestionLike } from '../like/entities/question-like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question, User, Category, QuestionLike])],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
