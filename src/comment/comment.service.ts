import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../user/entities/user.entity';
import { Comment } from './entities/comment.entity';
import { Question } from '../question/entities/question.entity';
import { PaginationService } from '../pagination/pagination.service';
import { PaginationResultInterface } from '../pagination/interfaces';
import { PaginationParamsDto } from '../pagination/dto/pagination-params.dto';
import { GetCommentsParamsDto } from './dto/get-comments-params.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentLike } from '../like/entities/comment-like.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(CommentLike)
    private readonly commentLikeRepository: Repository<CommentLike>,
    private readonly paginationService: PaginationService,
  ) {}

  findAll(
    params: GetCommentsParamsDto,
  ): Promise<PaginationResultInterface<Comment>> {
    const { page, questionId, userId, parentCommentId } = params;
    const paginationParams: PaginationParamsDto = { page };
    const queryBuilder = this.commentRepository
      .createQueryBuilder('comments')
      .withDeleted();

    if (questionId) {
      queryBuilder.where('comments.questionId = :questionId', { questionId });
    }

    if (userId) {
      queryBuilder.andWhere('comments.userId = :userId', { userId });
    }

    if (parentCommentId) {
      queryBuilder.andWhere('comments.parentCommentId = :parentCommentId', {
        parentCommentId,
      });
    }

    return this.paginationService.paginate(queryBuilder, paginationParams);
  }

  async create(
    currentUserId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const user = await this.userRepository.findOneBy({
      id: currentUserId,
    });
    const question = await this.questionRepository.findOne({
      relations: ['user'],
      where: { id: createCommentDto.questionId },
    });
    let parentComment: Comment;

    if (!question) {
      throw new BadRequestException('Invalid question');
    }

    if (question.user.id === currentUserId) {
      throw new ForbiddenException(
        'You are not allowed to comment your own questions',
      );
    }

    if (createCommentDto.parentCommentId) {
      parentComment = await this.commentRepository.findOneBy({
        id: createCommentDto.parentCommentId,
      });

      if (!parentComment) {
        throw new BadRequestException('Invalid parent comment');
      }
    }

    const comment = this.commentRepository.create({
      ...createCommentDto,
      user,
      question,
    });

    if (parentComment instanceof Comment) {
      this.commentRepository.merge(comment, { parentComment });
    }

    return this.commentRepository.save(comment);
  }

  async delete(currentUserId: number, commentId: number): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['user'],
    });

    if (!comment) {
      throw new NotFoundException();
    }

    if (currentUserId !== comment.user.id) {
      throw new ForbiddenException(
        `You are not allowed to delete comment #${commentId}`,
      );
    }

    await this.commentRepository.softRemove(comment);
  }

  async like(currentUserId: number, commentId: number): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['user', 'likes'],
    });

    if (!comment) {
      throw new NotFoundException();
    }

    if (comment.user.id === currentUserId) {
      throw new ForbiddenException(
        'You are not allowed to like your own comments',
      );
    }

    const currentUserQuestionLike = comment.likes.find(
      (questionLike) => questionLike.user.id === currentUserId,
    );

    if (currentUserQuestionLike) {
      throw new ForbiddenException('You have already liked current comment');
    }

    const user = await this.userRepository.findOneBy({
      id: currentUserId,
    });

    const commentLike = this.commentLikeRepository.create({
      comment,
      user,
    });
    await this.commentLikeRepository.save(commentLike);
  }

  async dislike(currentUserId: number, commentId: number): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['likes'],
    });

    if (!comment) {
      throw new NotFoundException();
    }

    const currentUserCommentLike = comment.likes.find(
      (commentLike) => commentLike.user.id === currentUserId,
    );

    if (currentUserCommentLike) {
      await this.commentLikeRepository.remove(currentUserCommentLike);
    }
  }
}
