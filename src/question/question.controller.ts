import {
  Get,
  Post,
  Controller,
  Param,
  Body,
  Query,
  UseGuards,
  ValidationPipe,
  Delete,
} from '@nestjs/common';

import { User } from '../user/entities/user.entity';
import { Question } from './entities/question.entity';
import { QuestionService } from './question.service';
import { PaginationResultInterface } from '../pagination/interfaces';
import { CustomValidationPipe } from '../common/pipes/custom-validation.pipe';
import { CreateQuestionDto } from './dto/create-question.dto';
import { GetQuestionsParamsDto } from './dto/get-questions-params.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true }))
    params: GetQuestionsParamsDto,
  ): Promise<PaginationResultInterface<Question>> {
    return this.questionService.findAll(params);
  }

  @Get(':id')
  findOne(
    @CurrentUser()
    currentUser: User,
    @Param('id')
    questionId: string,
  ): Promise<Question> {
    return this.questionService.findOne(currentUser, questionId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @CurrentUser() currentUser: User,
    @Body(new CustomValidationPipe({ stopAtFirstError: true }))
    createQuestionDto: CreateQuestionDto,
  ): Promise<Question> {
    return this.questionService.create(currentUser.id, createQuestionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  like(
    @CurrentUser()
    currentUser: User,
    @Param('id')
    questionId: string,
  ): Promise<void> {
    return this.questionService.like(currentUser.id, questionId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  dislike(
    @CurrentUser()
    currentUser: User,
    @Param('id')
    questionId: string,
  ): Promise<void> {
    return this.questionService.dislike(currentUser.id, questionId);
  }
}
