import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';

import { Category } from '../category/entities/category.entity';
import { User } from '../user/entities/user.entity';
import { Question } from './entities/question.entity';
import { GetQuestionsParamsDto } from './dto/get-questions-params.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { PaginationParamsDto } from '../pagination/dto/pagination-params.dto';
import { PaginationResultInterface } from '../pagination/interfaces';
import { PaginationService } from '../pagination/pagination.service';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly paginationService: PaginationService,
  ) {}

  findAll(
    params: GetQuestionsParamsDto,
  ): Promise<PaginationResultInterface<Question>> {
    const { page } = params;
    const paginationParams: PaginationParamsDto = { page };
    const queryBuilder =
      getRepository(Question).createQueryBuilder('questions');

    if (params.categoryId) {
      queryBuilder.where('questions.categoryId = :categoryId', {
        categoryId: params.categoryId,
      });
    }

    if (params.userId) {
      queryBuilder.andWhere('questions.userId = :userId', {
        userId: params.userId,
      });
    }

    return this.paginationService.paginate(queryBuilder, paginationParams);
  }

  async findOne(questionId: string): Promise<Question> {
    const question = await this.questionRepository.findOne(questionId);

    if (!question) {
      throw new NotFoundException();
    }

    return question;
  }

  async create(
    currentUserId: number,
    createQuestionDto: CreateQuestionDto,
  ): Promise<Question> {
    const user = await this.userRepository.findOne(currentUserId);
    const category = await this.categoryRepository.findOne(
      createQuestionDto.categoryId,
    );

    if (!category) {
      throw new BadRequestException('Invalid category');
    }

    const question = this.questionRepository.create({
      ...createQuestionDto,
      user,
      category,
    });

    return this.questionRepository.save(question);
  }
}
