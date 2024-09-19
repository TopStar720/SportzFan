import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PlayEntity } from './entities/play.entity';

@Injectable()
export class PlayService {
  constructor(
    @InjectRepository(PlayEntity) private playRepository: Repository<PlayEntity>
  ) {}

  async find(): Promise<PlayEntity[]> {
    return this.playRepository.find({
      order: {
        status: 'ASC',
        createdAt: 'DESC',
      }
    });
  }
}
