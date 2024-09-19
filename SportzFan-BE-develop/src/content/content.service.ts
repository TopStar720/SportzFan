import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SuccessResponse } from 'src/common/models/success-response';
import { getFromDto } from 'src/common/utils/repository.util';
import { ContentRegisterDto, ContentUpdateDto } from './dtos/content.dto';
import { ContentEntity } from './entities/content.entity';
import { TeamEntity } from 'src/team/entities/team.entity';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(ContentEntity)
    private contentRepository: Repository<ContentEntity>,

    @InjectRepository(TeamEntity)
    private teamRepository: Repository<TeamEntity>,
  ) {}

  // Create one content
  async createContent(dto: ContentRegisterDto): Promise<ContentEntity> {
    const team = await this.teamRepository.findOneBy({ id: dto.teamId });
    if (!team) {
      throw new BadRequestException('Could not find the team.');
    }
    const content = getFromDto<ContentEntity>(dto, new ContentEntity());
    return this.contentRepository.save(content);
  }

  //Get all Content list
  async getAllContent(): Promise<ContentEntity[]> {
    return this.contentRepository.find({
      relations: ['team'],
    });
  }

  // Get one Content by id
  async getOneContent(id: string): Promise<ContentEntity> {
    const content = await this.contentRepository.findOne({
      where: { id },
      relations: ['team'],
    });

    if (!content) {
      throw new BadRequestException('Could not find the content item.');
    }
    return content;
  }

  // Update Content by id
  async updateContent(
    id: string,
    dto: ContentUpdateDto,
  ): Promise<SuccessResponse> {
    let content = await this.contentRepository.findOneBy({
      id: id,
    });
    if (!content) {
      throw new BadRequestException('Could not find the content item.');
    }
    if (dto.teamId) {
      const team = await this.teamRepository.findOneBy({ id: dto.teamId });
      if (!team) {
        throw new BadRequestException('Could not find the team.');
      }
    }
    content = getFromDto(dto, content);
    await this.contentRepository.save(content);
    return new SuccessResponse(true);
  }

  async deleteContent(id: string): Promise<SuccessResponse> {
    await this.contentRepository.softDelete({ id });
    return new SuccessResponse(true);
  }
}
