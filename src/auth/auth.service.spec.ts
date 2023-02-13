import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('singup should be successful', async () => {
    const user = await service.signUp({
      username: 'some user',
      password: 'some password',
    });
    const result = {
      accessToken: 'signed in',
      refreshToken: 'signed in',
    };
    expect(user).toEqual(result);
  });
});
