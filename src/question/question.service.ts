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
import { UserRole } from '../user/enums/user-role.enum';

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
    currentUser: User,
    params: GetQuestionsParamsDto,
  ): Promise<PaginationResultInterface<Question>> {
    const { page } = params;
    const paginationParams: PaginationParamsDto = { page };
    const queryBuilder = this.questionRepository
      .createQueryBuilder('questions')
      .leftJoinAndSelect('questions.category', 'category')
      .leftJoinAndSelect('questions.likes', 'questionLike')
      .loadRelationCountAndMap(
        'questions.commentsCount',
        'questions.comments',
        '_',
        (qb) => qb.withDeleted(),
      )
      .withDeleted()
      .leftJoinAndSelect('questionLike.user', 'questionLikeUser')
      .leftJoinAndSelect('questions.user', 'user');

    if (currentUser?.role !== UserRole.ADMIN) {
      queryBuilder.where('user.deletedAt IS NULL');
    }

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

  async findOne(currentUser: User, questionId: string): Promise<Question> {
    const queryBuilder = this.questionRepository
      .createQueryBuilder('questions')
      .leftJoinAndSelect('questions.category', 'category')
      .leftJoinAndSelect('questions.likes', 'questionLike')
      .loadRelationCountAndMap(
        'questions.commentsCount',
        'questions.comments',
        '_',
        (qb) => qb.withDeleted(),
      )
      .withDeleted()
      .leftJoinAndSelect('questionLike.user', 'questionLikeUser')
      .leftJoinAndSelect('questions.user', 'user')
      .where('questions.id = :questionId', { questionId });

    if (currentUser?.role !== UserRole.ADMIN) {
      queryBuilder.andWhere('user.deletedAt IS NULL');
    }

    const question = await queryBuilder.getOne();

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
