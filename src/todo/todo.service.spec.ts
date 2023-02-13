import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../mock/mongoMock';
import { TodoSchema } from '../schemas/todo.schema';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;
  let idToUpdate: string;
  const userId = '63ea5a6353eed9aba93c6619';

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: 'Todo', schema: TodoSchema }]),
      ],
      providers: [TodoService],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new todo', async () => {
    const newTodo = await service.create(
      {
        title: 'some todo',
      },
      userId,
    );
    await service.create(
      {
        title: 'some todo 2',
      },
      userId,
    );
    idToUpdate = newTodo._id.toString();
    expect(newTodo.user.toString()).toBe(userId);
    expect(newTodo.title).toBe('some todo');
    expect(newTodo.isComplete).toBe(false);
    expect(newTodo._id).toBeDefined();
  });

  it('update todo', async () => {
    const updated = await service.update(
      idToUpdate,
      {
        isComplete: true,
      },
      userId,
    );
    expect(updated.isComplete).toBe(true);
  });

  it('should contain 2 todos for given user', async () => {
    const todos = await service.get(null, userId);
    expect(Object.keys(todos).length).toBe(2);
  });

  it('should return only one todo', async () => {
    const todos = await service.get(idToUpdate, userId);
    expect(Object.keys(todos).length).toBe(1);
  });

  it('delete one todo', async () => {
    const del = await service.delete(idToUpdate, userId);
    expect(del.deletedCount).toBe(1);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
