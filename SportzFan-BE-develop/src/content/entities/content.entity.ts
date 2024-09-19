import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { ContentDto } from '../dtos/content.dto';
import { TeamEntity } from 'src/team/entities/team.entity';

@Entity('content')
export class ContentEntity extends SoftDelete {
  @Column({ name: 'team_id' })
  teamId: string;

  @ManyToOne(() => TeamEntity)
  @JoinColumn({ name: 'team_id' })
  team: TeamEntity;

  @Column({ name: 'primary_color' })
  primaryColor: string;

  @Column({ name: 'secondary_color' })
  secondaryColor: string;

  @Column({ name: 'action_color' })
  actionColor: string;

  @Column({ name: 'team_image_fore' })
  teamImageFore: string;

  @Column({ name: 'team_image_back' })
  teamImageBack: string;
  //Section 1
  @Column({ name: 'sponsor_log1' })
  sponsorLogo1: string;

  @Column({ name: 'sponsor_log2' })
  sponsorLogo2: string;

  @Column({ name: 'sponsor_log3' })
  sponsorLogo3: string;

  @Column({ name: 'sec1_heading' })
  sec1Heading: string;

  @Column({ name: 'sec1_sub_heading' })
  sec1SubHeading: string;
  //Section 2
  @Column({ name: 'sec2_heading1' })
  sec2Heading1: string;

  @Column({ name: 'sec2_heading2' })
  sec2Heading2: string;

  @Column({ name: 'sec2_intro1' })
  sec2Intro1: string;

  @Column({ name: 'sec2_intro2' })
  sec2Intro2: string;

  @Column({ name: 'sec2_intro3' })
  sec2Intro3: string;

  @Column({ name: 'sec2_intro4' })
  sec2Intro4: string;

  @Column({ name: 'sec2_button' })
  sec2Button: string;
  //Section 3
  @Column({ name: 'sec3_heading1' })
  sec3Heading1: string;

  @Column({ name: 'sec3_heading2' })
  sec3Heading2: string;

  @Column({ name: 'sec3_card1' })
  sec3Card1: string;

  @Column({ name: 'sec3_card2' })
  sec3Card2: string;

  @Column({ name: 'sec3_card3' })
  sec3Card3: string;

  @Column({ name: 'sec3_card4' })
  sec3Card4: string;

  @Column({ name: 'sec3_button' })
  sec3Button: string;
  //Section 4
  @Column({ name: 'sec4_heading1' })
  sec4Heading1: string;

  @Column({ name: 'sec4_heading2' })
  sec4Heading2: string;

  @Column({ name: 'sec4_card1_heading' })
  sec4Card1Heading: string;

  @Column({ name: 'sec4_card1_description' })
  sec4Card1Description: string;

  @Column({ name: 'sec4_card2_heading' })
  sec4Card2Heading: string;

  @Column({ name: 'sec4_card2_description' })
  sec4Card2Description: string;

  @Column({ name: 'sec4_card3_heading' })
  sec4Card3Heading: string;

  @Column({ name: 'sec4_card3_description' })
  sec4Card3Description: string;

  @Column({ name: 'sec4_card4_heading' })
  sec4Card4Heading: string;

  @Column({ name: 'sec4_card4_description' })
  sec4Card4Description: string;

  @Column({ name: 'sec4_card5_heading' })
  sec4Card5Heading: string;

  @Column({ name: 'sec4_card5_description' })
  sec4Card5Description: string;

  @Column({ name: 'sec4_button' })
  sec4Button: string;

  toDto(): ContentDto {
    return {
      ...super.toDto(),
      team: this.team,
      primaryColor: this.primaryColor,
      secondaryColor: this.secondaryColor,
      actionColor: this.actionColor,
      teamImageFore: this.teamImageFore,
      teamImageBack: this.teamImageBack,
      sponsorLogo1: this.sponsorLogo1,
      sponsorLogo2: this.sponsorLogo2,
      sponsorLogo3: this.sponsorLogo3,
      sec1Heading: this.sec1Heading,
      sec1SubHeading: this.sec1SubHeading,
      sec2Heading1: this.sec2Heading1,
      sec2Heading2: this.sec2Heading2,
      sec2Intro1: this.sec2Intro1,
      sec2Intro2: this.sec2Intro2,
      sec2Intro3: this.sec2Intro3,
      sec2Intro4: this.sec2Intro4,
      sec2Button: this.sec2Button,
      sec3Heading1: this.sec3Heading1,
      sec3Heading2: this.sec3Heading2,
      sec3Card1: this.sec3Card1,
      sec3Card2: this.sec3Card2,
      sec3Card3: this.sec3Card3,
      sec3Card4: this.sec3Card4,
      sec3Button: this.sec3Button,
      sec4Heading1: this.sec4Heading1,
      sec4Heading2: this.sec4Heading2,
      sec4Card1Heading: this.sec4Card1Heading,
      sec4Card1Description: this.sec4Card1Description,
      sec4Card2Heading: this.sec4Card2Heading,
      sec4Card2Description: this.sec4Card2Description,
      sec4Card3Heading: this.sec4Card3Heading,
      sec4Card3Description: this.sec4Card3Description,
      sec4Card4Heading: this.sec4Card4Heading,
      sec4Card4Description: this.sec4Card4Description,
      sec4Card5Heading: this.sec4Card5Heading,
      sec4Card5Description: this.sec4Card5Description,
      sec4Button: this.sec4Button,
    };
  }
}
