import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Category } from './entities/category.entity';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CustomValidationPipe } from '../common/pipes/custom-validation.pipe';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../user/enums/user-role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') categoryId: number): Promise<Category> {
    return this.categoryService.findOne(categoryId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(UserRole.ADMIN)
  create(
    @Body(new CustomValidationPipe({ stopAtFirstError: true }))
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.create(createCategoryDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') categoryId: number,
    @Body(new CustomValidationPipe({ stopAtFirstError: true }))
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.update(categoryId, updateCategoryDto);
  }
}
