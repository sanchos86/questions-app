import {
  Get,
  Post,
  Controller,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';

import { User } from '../user/entities/user.entity';
import { Question } from './entities/question.entity';
import { QuestionService } from './question.service';
import { PaginationResultInterface } from '../pagination/interfaces';
import { CustomValidationPipe } from '../common/pipes/custom-validation.pipe';
import { CreateQuestionDto } from './dto/create-question.dto';
import { GetQuestionsParamsDto } from './dto/get-questions-params.dto';
import { JwtAuthGuard } from '../auth/passport/jwt/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get()
  findAll(
    @Query() params: GetQuestionsParamsDto,
  ): Promise<PaginationResultInterface<Question>> {
    return this.questionService.findAll(params);
  }

  @Get(':id')
  findOne(
    @Param('id')
    questionId: string,
  ): Promise<Question> {
    return this.questionService.findOne(questionId);
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
}
