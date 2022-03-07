import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { User } from '../user/entities/user.entity';
import { Question } from './entities/question.entity';
import { QuestionService } from './question.service';
import { PaginationResultInterface } from '../pagination/interfaces';
import { CustomValidationPipe } from '../common/pipes/custom-validation.pipe';
import { CreateQuestionDto } from './dto/create-question.dto';
import { GetQuestionsParamsDto } from './dto/get-questions-params.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../user/enums/user-role.enum';

@ApiTags('questions')
@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get()
  findAll(
    @CurrentUser()
    currentUser: User,
    @Query(new ValidationPipe({ transform: true }))
    params: GetQuestionsParamsDto,
  ): Promise<PaginationResultInterface<Question>> {
    return this.questionService.findAll(currentUser, params);
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(UserRole.AUTHOR)
  create(
    @CurrentUser() currentUser: User,
    @Body(new CustomValidationPipe({ stopAtFirstError: true }))
    createQuestionDto: CreateQuestionDto,
  ): Promise<Question> {
    return this.questionService.create(currentUser.id, createQuestionDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post(':id/like')
  @Roles(UserRole.AUTHOR)
  like(
    @CurrentUser()
    currentUser: User,
    @Param('id')
    questionId: string,
  ): Promise<void> {
    return this.questionService.like(currentUser.id, questionId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id/like')
  @Roles(UserRole.AUTHOR)
  dislike(
    @CurrentUser()
    currentUser: User,
    @Param('id')
    questionId: string,
  ): Promise<void> {
    return this.questionService.dislike(currentUser.id, questionId);
  }
}
