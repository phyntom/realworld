import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TagService } from '@app/tag/tag.service';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  findAll(): string[] {
    return this.tagService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagService.findOne(parseInt(id));
  }
  @Post()
  create(@Body() createTag: string) {
    return this.tagService.create(createTag);
  }
}
