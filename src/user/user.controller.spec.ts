import { Test, TestingModule } from '@nestjs/testing';
import { UserDto } from '../dto/user.dto';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn().mockImplementation(() =>
              Promise.resolve({
                username: 'some user',
              }),
            ),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a new user', async () => {
    // const newUser: UserDto = {
    //   username: 'some user',
    //   password: 'some password',
    // };
    // const conUser = await controller.registerUser(newUser);
    // expect(conUser.username).toBe('some user');
  });
});
