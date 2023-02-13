import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('signed in'),
          },
        },
        {
          provide: UserService,
          useValue: {
            findByUsername: jest.fn().mockResolvedValue(null),
            update: jest.fn().mockResolvedValue({
              _id: 'uuid',
              username: 'some user',
              password: 'some password',
            }),
            create: jest.fn().mockResolvedValue({
              _id: 'uuid',
              username: 'some user',
              password: 'some password',
            }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('super-secert'),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
