import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';
import { TodoDocument } from '../schemas/todo.schema';

@Injectable()
export class TodoService {
  constructor(@InjectModel('Todo') private todoModel: Model<TodoDocument>) {}

  async get(id?: string, userId?: string) {
    if (id && userId) {
      return this.todoModel.find({ _id: id, user: userId });
    } else if (!id && userId) {
      return this.todoModel.find({ user: userId });
    } else {
      return this.todoModel.findById(id);
    }
  }

  @HttpCode(201)
  async create(createTodoDto: CreateTodoDto, userId: string) {
    const appended = {
      ...createTodoDto,
      user: userId,
    };
    const newTodo = new this.todoModel(appended);
    return newTodo.save();
  }

  async update(id: string, updateTodoDto: UpdateTodoDto, userId: string) {
    const todo = await this.todoModel.findOne({ _id: id, user: userId });
    if (!todo) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    if (todo && updateTodoDto.title) {
      todo.title = updateTodoDto.title;
    }
    if (todo && updateTodoDto.isComplete.toString()) {
      todo.isComplete = updateTodoDto.isComplete;
    }
    return todo.save();
  }

  async delete(id: string, userId: string) {
    return this.todoModel.deleteOne({ _id: id, user: userId }).exec();
  }
}
