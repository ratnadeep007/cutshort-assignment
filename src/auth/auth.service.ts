import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as argon2 from 'argon2';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(userDto: CreateUserDto) {
    const userExists = await this.userService.findByUsername(userDto.username);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    // hash password
    const hash = await this.hashData(userDto.password);
    const newUser = await this.userService.create({
      ...userDto,
      password: hash,
    });
    const tokens = await this.getTokens(
      newUser._id.toString(),
      newUser.username,
    );
    await this.updateRefreshToken(newUser._id.toString(), tokens.refreshToken);
    return tokens;
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async signIn(data: AuthDto) {
    // Check if user exists
    const user = await this.userService.findByUsername(data.username);
    if (!user) throw new BadRequestException('User does not exist');
    const passwordMatches = await argon2.verify(user.password, data.password);
    if (!passwordMatches)
      throw new BadRequestException('Credentials are incorrect');
    const tokens = await this.getTokens(user._id.toString(), user.username);
    await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);
    return tokens;
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userService.findById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }
  async logout(userId: string) {
    this.userService.update(userId, { refreshToken: null });
  }
}
