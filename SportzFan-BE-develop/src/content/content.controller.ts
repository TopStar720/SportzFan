import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/models/base';

import { SuccessResponse } from '../common/models/success-response';
import { ContentService } from './content.service';
import {
  ContentDto,
  ContentRegisterDto,
  ContentUpdateDto,
} from './dtos/content.dto';

@ApiTags('Admin / Content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin])
  @ApiOperation({ summary: 'create a new content' })
  @ApiOkResponse({ type: ContentDto })
  @Post()
  async createContent(
    @Request() req,
    @Body() dto: ContentRegisterDto,
  ): Promise<ContentDto> {
    const content = await this.contentService.createContent(dto);
    return ContentDto.toContentDto(content);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan])
  @ApiOperation({ summary: 'get all content list' })
  @ApiOkResponse({ type: ContentDto, isArray: true })
  @Get()
  async getAllContent(): Promise<ContentDto[]> {
    const contents = await this.contentService.getAllContent();
    return contents.map((content) => ContentDto.toContentDto(content));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan])
  @ApiOperation({ summary: 'get a content list' })
  @ApiOkResponse({ type: ContentDto, isArray: true })
  @ApiImplicitParam({ name: 'id', required: true })
  @Get(':id')
  async getOneContent(@Param('id') id): Promise<ContentDto> {
    const content = await this.contentService.getOneContent(id);
    return ContentDto.toContentDto(content);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin])
  @ApiOperation({ summary: 'update a content' })
  @Put('content/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  async updateContent(
    @Param('id') id,
    @Body() body: ContentUpdateDto,
  ): Promise<SuccessResponse> {
    return this.contentService.updateContent(id, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin])
  @ApiOperation({ summary: 'delete a content' })
  @Delete('content/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  deleteContent(@Param('id') id): Promise<SuccessResponse> {
    return this.contentService.deleteContent(id);
  }
}
