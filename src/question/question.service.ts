import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from '../category/entities/category.entity';
import { User } from '../user/entities/user.entity';
import { Question } from './entities/question.entity';
import { QuestionLike } from '../like/entities/question-like.entity';
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
    @InjectRepository(QuestionLike)
    private readonly questionLikeRepository: Repository<QuestionLike>,
    private readonly paginationService: PaginationService,
  ) {}

  findAll(
    params: GetQuestionsParamsDto,
  ): Promise<PaginationResultInterface<Question>> {
    const { page } = params;
    const paginationParams: PaginationParamsDto = { page };
    const queryBuilder = this.questionRepository
      .createQueryBuilder('questions')
      .withDeleted()
      .leftJoinAndSelect('questions.user', 'user')
      .leftJoinAndSelect('questions.likes', 'like')
      .leftJoinAndSelect('like.user', 'likeUser')
      .where('user.deletedAt is null');

    if (params.categoryId) {
      queryBuilder.andWhere('questions.categoryId = :categoryId', {
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
    const question = await this.questionRepository.findOne(questionId, {
      relations: ['category', 'user', 'likes', 'comments'],
    });

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

  async like(currentUserId: number, questionId: string): Promise<void> {
    const question = await this.questionRepository.findOne(questionId, {
      relations: ['user', 'likes'],
    });

    if (!question) {
      throw new NotFoundException();
    }

    if (question.user.id === currentUserId) {
      throw new ForbiddenException(
        'You are not allowed to like your own questions',
      );
    }

    const currentUserQuestionLike = question.likes.find(
      (questionLike) => questionLike.user.id === currentUserId,
    );

    if (currentUserQuestionLike) {
      throw new ForbiddenException('You have already liked current question');
    }

    const user = await this.userRepository.findOne(currentUserId);

    const questionLike = this.questionLikeRepository.create({
      question,
      user,
    });
    await this.questionLikeRepository.save(questionLike);
  }

  async dislike(currentUserId: number, questionId: string): Promise<void> {
    const question = await this.questionRepository.findOne(questionId, {
      relations: ['likes'],
    });

    if (!question) {
      throw new NotFoundException();
    }

    const currentUserQuestionLike = question.likes.find(
      (questionLike) => questionLike.user.id === currentUserId,
    );

    if (currentUserQuestionLike) {
      await this.questionLikeRepository.remove(currentUserQuestionLike);
    }
  }
}
