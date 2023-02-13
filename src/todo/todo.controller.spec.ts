import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { mockRequest } from 'mock-req-res';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../mock/mongoMock';
import { TodoSchema } from '../schemas/todo.schema';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

describe('TodoController', () => {
  let controller: TodoController;
  let idToUpdate: string;
  const userId = '63ea5a6353eed9aba93c6619';
  const mockedReq = mockRequest({ user: { sub: userId } });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: 'Todo', schema: TodoSchema }]),
      ],
      controllers: [TodoController],
      providers: [TodoService],
    }).compile();

    controller = module.get<TodoController>(TodoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be able to create a todo', async () => {
    const newTodo = await controller.createTodo(
      {
        title: 'some todo',
        user: '',
        isComplete: false,
      },
      mockedReq,
    );
    await controller.createTodo(
      {
        title: 'some todo 2',
        user: '',
        isComplete: false,
      },
      mockedReq,
    );
    idToUpdate = newTodo._id.toString();
    expect(newTodo).toBeDefined();
    expect(newTodo.title).toBe('some todo');
    expect(newTodo.isComplete).toBe(false);
    expect(newTodo._id).toBeDefined();
  });

  it('update todo', async () => {
    const updated = await controller.updateTodo(
      mockedReq,
      { id: idToUpdate },
      { isComplete: true },
    );
    expect(updated.isComplete).toBe(true);
  });

  it('should contain 2 todos for given user', async () => {
    const todos = await controller.getUserTodos(mockedReq);
    expect(Object.keys(todos).length).toBe(2);
  });

  it('should return only one todo', async () => {
    const todos = await controller.getSingleTodo({ id: idToUpdate }, mockedReq);
    expect(Object.keys(todos).length).toBe(1);
  });

  it('delete one todo', async () => {
    const del = await controller.delete(mockedReq, { id: idToUpdate });
    expect(del.deletedCount).toBe(1);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
