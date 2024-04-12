import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TagEntity } from '@app/tag/tag.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}
  async findAll(): Promise<{ tags: string[] }> {
    const tags = await this.tagRepository.find();
    return {
      tags: tags.map((tag) => tag.name),
    };
  }
}
