import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
// import { Model } from 'mongoose';
import { IUser } from '../interfaces/user.interface';
import { UserService } from './user.service';

const mockUser = (
  id = 'a uuid',
  username = 'test user',
  password = 'test password',
): IUser => {
  return {
    id: id,
    username,
    password,
  };
};

describe('UserService', () => {
  let service: UserService;
  // let model: Model<IUserDoc>;

  afterEach(() => {
    jest.clearAllMocks();
  });
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockUser()),
            constructor: jest.fn().mockResolvedValue(mockUser()),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    // model = module.get<Model<IUserDoc>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create user', async () => {
    // const user: UserDto = {
    //   username: 'test user',
    //   password: 'test password',
    // };
    // jest.spyOn(model, 'create').mockImplementationOnce(() =>
    //   Promise.resolve({
    //     _id: 'some_id',
    //     username: 'test user',
    //     password: 'test password',
    //   }),
    // );
    // const newUser = await service.createUser(user);
    // expect(newUser.username).toEqual(user.username);
  });
});
