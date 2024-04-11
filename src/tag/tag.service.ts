import { Injectable } from '@nestjs/common';

@Injectable()
export class TagService {
  tags: Array<string> = ['react', 'nestjs', 'angular', 'vue', 'svelte'];
  findAll(): string[] {
    return this.tags;
  }
  findOne(id: number): string {
    const foundTag = this.tags.find((tag, index) => index === id - 1);
    if (!foundTag) {
      return 'Tag not found';
    }
    return foundTag;
  }
  create(createTag: string): string {
    this.tags.push(createTag);
    return createTag;
  }
}
