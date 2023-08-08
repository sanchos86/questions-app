import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  private findByName(name: string): Promise<Category | undefined> {
    return this.categoryRepository.findOne({
      where: { name },
    });
  }

  findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async findOne(categoryId: number): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({
      id: categoryId,
    });

    if (!category) {
      throw new NotFoundException();
    }

    return category;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const existingCategory = await this.findByName(createCategoryDto.name);

    if (existingCategory) {
      throw new BadRequestException('Name is already taken');
    }

    const category = this.categoryRepository.create(createCategoryDto);

    return this.categoryRepository.save(category);
  }

  async update(
    categoryId: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({
      id: categoryId,
    });

    if (!category) {
      throw new NotFoundException();
    }

    const existingCategory = await this.findByName(updateCategoryDto.name);

    if (existingCategory && existingCategory.id !== category.id) {
      throw new BadRequestException('Name is already taken');
    }

    this.categoryRepository.merge(category, { name: updateCategoryDto.name });
    return this.categoryRepository.save(category);
  }
}
