import { messaging } from 'firebase-admin';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MessageDto {
  @ApiPropertyOptional() readonly data?: { [key: string]: string };
  @ApiPropertyOptional() readonly notification?: messaging.Notification;
  @ApiPropertyOptional() readonly android?: messaging.AndroidConfig;
  @ApiPropertyOptional() readonly webpush?: messaging.WebpushConfig;
  @ApiPropertyOptional() readonly apns?: messaging.ApnsConfig;
}

export class PushNotificationRegister {
  @ApiProperty({ description: 'the project id' })
  @IsString()
  projectId: string;

  @ApiProperty({ description: 'the token' })
  @IsString()
  token: string;

  @ApiProperty({ description: 'the message' })
  notification: MessageDto;
}

export class SubscribeDto {
  @ApiProperty({ description: 'the project id' })
  @IsString()
  projectId: string;

  @ApiProperty({ description: 'the token' })
  @IsString()
  token: string;
}

export class PushTopicNotificationRegister {
  @ApiProperty({ description: 'the project id' })
  @IsString()
  projectId: string;

  @ApiProperty({ description: 'the message' })
  notification: MessageDto;
}
