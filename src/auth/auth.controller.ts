import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { RefreshTokenGuard } from '../common/guards/refreshToken.guard';
import { AuthDto } from '../dto/auth.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthService } from './auth.service';
import { Request } from 'express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Inject()
  private authService: AuthService;

  @Post('signup')
  @ApiResponse({
    status: 201,
    description: 'Created new user',
  })
  @ApiBadRequestResponse({ description: 'Username already exists' })
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @HttpCode(200)
  @Post('signin')
  @ApiOkResponse({ description: 'Logged in successfully' })
  @ApiBadRequestResponse({ description: 'Credentials are incorrect' })
  signin(@Body() data: AuthDto) {
    return this.authService.signIn(data);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get('logout')
  @ApiResponse({
    status: 200,
    description: 'Takes access token to logout user',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized if access token is not passed',
  })
  logout(@Req() req: Request) {
    this.authService.logout(req['user']['sub']);
  }

  @ApiBearerAuth()
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  @ApiResponse({
    status: 200,
    description:
      'Takes refresh token as bearer token and returns new access token and refresh token',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized if refresh token is not passed',
  })
  refreshTokens(@Req() req: Request) {
    const userId = req['user']['sub'];
    const refreshToken = req['user']['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
