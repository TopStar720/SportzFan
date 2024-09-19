import {
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  Body,
  Param,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { LoginDto } from 'src/user/dto/login.dto';
import { UserRegisterDto, UserDto } from 'src/user/dto/user.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ErrorCode } from 'src/common/models/error-code';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @Post('/login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(
      body.teamId || '',
      body.email,
      body.password,
      !!body.isAdminLogin,
    );
    if (!user) {
      throw new BadRequestException(ErrorCode.UserNotFound);
    }
    return this.authService.login(user);
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get profile' })
  @ApiOkResponse({ type: UserDto })
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }

  @ApiOperation({ summary: 'Sign up' })
  @Post('/signup')
  async signup(@Body() createUserDto: UserRegisterDto) {
    return this.authService.signup(createUserDto);
  }

  @ApiOperation({ summary: 'Sign up with referral link' })
  @ApiParam({ name: 'code', type: 'string' })
  @Post('/signup/:code')
  async referralSignup(
    @Body() createUserDto: UserRegisterDto,
    @Param('code') code: string,
  ) {
    return this.authService.signup(createUserDto, code);
  }
}
