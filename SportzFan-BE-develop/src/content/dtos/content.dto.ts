import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { TeamDto } from 'src/team/dtos/team.dto';

import { CommonDto } from '../../common/dtos/common.dto';
import { ContentEntity } from '../entities/content.entity';

export class ContentDto extends CommonDto {
  @ApiProperty()
  team: TeamDto;

  @ApiProperty()
  primaryColor: string;

  @ApiProperty()
  secondaryColor: string;

  @ApiProperty()
  actionColor: string;

  @ApiProperty()
  teamImageFore: string;

  @ApiProperty()
  teamImageBack: string;

  @ApiProperty()
  sponsorLogo1: string;

  @ApiProperty()
  sponsorLogo2: string;

  @ApiProperty()
  sponsorLogo3: string;

  @ApiProperty()
  sec1Heading: string;

  @ApiProperty()
  sec1SubHeading: string;

  @ApiProperty()
  sec2Heading1: string;

  @ApiProperty()
  sec2Heading2: string;

  @ApiProperty()
  sec2Intro1: string;

  @ApiProperty()
  sec2Intro2: string;

  @ApiProperty()
  sec2Intro3: string;

  @ApiProperty()
  sec2Intro4: string;

  @ApiProperty()
  sec2Button: string;

  @ApiProperty()
  sec3Heading1: string;

  @ApiProperty()
  sec3Heading2: string;

  @ApiProperty()
  sec3Card1: string;

  @ApiProperty()
  sec3Card2: string;

  @ApiProperty()
  sec3Card3: string;

  @ApiProperty()
  sec3Card4: string;

  @ApiProperty()
  sec3Button: string;

  @ApiProperty()
  sec4Heading1: string;

  @ApiProperty()
  sec4Heading2: string;

  @ApiProperty()
  sec4Card1Heading: string;

  @ApiProperty()
  sec4Card1Description: string;

  @ApiProperty()
  sec4Card2Heading: string;

  @ApiProperty()
  sec4Card2Description: string;

  @ApiProperty()
  sec4Card3Heading: string;

  @ApiProperty()
  sec4Card3Description: string;

  @ApiProperty()
  sec4Card4Heading: string;

  @ApiProperty()
  sec4Card4Description: string;

  @ApiProperty()
  sec4Card5Heading: string;

  @ApiProperty()
  sec4Card5Description: string;

  @ApiProperty()
  sec4Button: string;

  static toContentDto(content: ContentEntity): ContentDto {
    return {
      id: content.id,
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
      team: content.team,
      primaryColor: content.primaryColor,
      secondaryColor: content.secondaryColor,
      actionColor: content.actionColor,
      teamImageFore: content.teamImageFore,
      teamImageBack: content.teamImageBack,
      sponsorLogo1: content.sponsorLogo1,
      sponsorLogo2: content.sponsorLogo2,
      sponsorLogo3: content.sponsorLogo3,
      sec1Heading: content.sec1Heading,
      sec1SubHeading: content.sec1SubHeading,
      sec2Heading1: content.sec2Heading1,
      sec2Heading2: content.sec2Heading2,
      sec2Intro1: content.sec2Intro1,
      sec2Intro2: content.sec2Intro2,
      sec2Intro3: content.sec2Intro3,
      sec2Intro4: content.sec2Intro4,
      sec2Button: content.sec2Button,
      sec3Heading1: content.sec3Heading1,
      sec3Heading2: content.sec3Heading2,
      sec3Card1: content.sec3Card1,
      sec3Card2: content.sec3Card2,
      sec3Card3: content.sec3Card3,
      sec3Card4: content.sec3Card4,
      sec3Button: content.sec3Button,
      sec4Heading1: content.sec4Heading1,
      sec4Heading2: content.sec4Heading2,
      sec4Card1Heading: content.sec4Card1Heading,
      sec4Card1Description: content.sec4Card1Description,
      sec4Card2Heading: content.sec4Card2Heading,
      sec4Card2Description: content.sec4Card2Description,
      sec4Card3Heading: content.sec4Card3Heading,
      sec4Card3Description: content.sec4Card3Description,
      sec4Card4Heading: content.sec4Card4Heading,
      sec4Card4Description: content.sec4Card4Description,
      sec4Card5Heading: content.sec4Card5Heading,
      sec4Card5Description: content.sec4Card5Description,
      sec4Button: content.sec4Button,
    };
  }
}

export class ContentRegisterDto {
  @ApiProperty()
  @IsUUID()
  teamId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  primaryColor: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  secondaryColor: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  actionColor: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  teamImageFore: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  teamImageBack: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sponsorLogo1: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sponsorLogo2: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sponsorLogo3: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec1Heading: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec1SubHeading: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec2Heading1: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec2Heading2: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec2Intro1: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec2Intro2: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec2Intro3: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec2Intro4: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec2Button: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec3Heading1: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec3Heading2: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec3Card1: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec3Card2: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec3Card3: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec3Card4: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec3Button: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec4Heading1: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec4Heading2: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec4Card1Heading: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec4Card1Description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec4Card2Heading: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec4Card2Description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec4Card3Heading: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec4Card3Description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec4Card4Heading: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec4Card4Description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec4Card5Heading: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec4Card5Description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec4Button: string;
}

export class ContentUpdateDto {
  @ApiProperty()
  @IsUUID()
  @IsOptional()
  teamId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  primaryColor: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  secondaryColor: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  actionColor: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  teamImageFore: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  teamImageBack: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sponsorLogo1: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sponsorLogo2: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sponsorLogo3: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec1Heading: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec1SubHeading: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec2Heading1: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec2Heading2: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec2Intro1: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec2Intro2: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec2Intro3: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec2Intro4: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec2Button: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec3Heading1: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec3Heading2: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec3Card1: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec3Card2: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec3Card3: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec3Card4: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec3Button: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec4Heading1: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec4Heading2: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec4Card1Heading: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec4Card1Description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec4Card2Heading: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec4Card2Description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec4Card3Heading: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec4Card3Description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec4Card4Heading: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec4Card4Description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec4Card5Heading: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec4Card5Description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sec4Button: string;
}
