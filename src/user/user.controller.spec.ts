import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { PostModule } from '../post/post.module';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../mock/mongoMock';
import { UserSchema } from '../schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        PostModule,
      ],
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
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

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
