import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UseGuards,
  Patch,
  Param,
  ValidationPipe,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { User } from '../user/entities/user.entity';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Comment } from './entities/comment.entity';
import { CommentService } from './comment.service';
import { GetCommentsParamsDto } from './dto/get-comments-params.dto';
import { PaginationResultInterface } from '../pagination/interfaces';
import { CustomValidationPipe } from '../common/pipes/custom-validation.pipe';
import { CreateCommentDto } from './dto/create-comment.dto';

@ApiTags('comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true }))
    params: GetCommentsParamsDto,
  ): Promise<PaginationResultInterface<Comment>> {
    return this.commentService.findAll(params);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @CurrentUser()
    currentUser: User,
    @Body(new CustomValidationPipe({ stopAtFirstError: true }))
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    return this.commentService.create(currentUser.id, createCommentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  delete(
    @CurrentUser() currentUser: User,
    @Param('id') commentId: number,
  ): Promise<void> {
    return this.commentService.delete(currentUser.id, commentId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  like(
    @CurrentUser()
    currentUser: User,
    @Param('id')
    commentId: number,
  ): Promise<void> {
    return this.commentService.like(currentUser.id, commentId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  dislike(
    @CurrentUser()
    currentUser: User,
    @Param('id')
    commentId: number,
  ): Promise<void> {
    return this.commentService.dislike(currentUser.id, commentId);
  }
}
