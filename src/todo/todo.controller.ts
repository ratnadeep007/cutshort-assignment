import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { TodoService } from './todo.service';
import { Request } from 'express';
import { UpdateTodoDto } from '../dto/update-todo.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Todo } from '../schemas/todo.schema';

@ApiTags('todo')
@ApiBearerAuth()
@Controller('todo')
export class TodoController {
  @Inject()
  private readonly todoService: TodoService;

  @HttpCode(201)
  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiCreatedResponse({ description: 'Created Succesfully', type: Todo })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized Request' })
  createTodo(@Body() todoDto: CreateTodoDto, @Req() req: Request) {
    return this.todoService.create(todoDto, req.user['sub']);
  }

  @Get('/:id')
  @UseGuards(AccessTokenGuard)
  @ApiOkResponse({
    description:
      'Returns todo of given id if and only it belongs to logged in user',
    type: Todo,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized Request' })
  getSingleTodo(@Param() params: { id: string }, @Req() req: Request) {
    const userId = req.user['sub'];
    return this.todoService.get(params.id, userId);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  @ApiOkResponse({
    description:
      'Returns todo of given id if and only it belongs to logged in user',
    type: [Todo],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized Request' })
  getUserTodos(@Req() req: Request) {
    const userId = req.user['sub'];
    return this.todoService.get(null, userId);
  }

  @Delete('/:id')
  @UseGuards(AccessTokenGuard)
  @ApiOkResponse({
    description:
      'Deletes todo of given id if and only if it belongs to logged in user',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized Request' })
  delete(@Req() req: Request, @Param() params: { id: string }) {
    const userId = req.user['sub'];
    return this.todoService.delete(params.id, userId);
  }

  @Patch('/:id')
  @UseGuards(AccessTokenGuard)
  @ApiOkResponse({
    description:
      'Update todo of given id if and only if it belongs to logged in user',
    type: UpdateTodoDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized Request' })
  updateTodo(
    @Req() req: Request,
    @Param() params: { id: string },
    @Body() updateTodo: UpdateTodoDto,
  ) {
    const userId = req.user['sub'];
    return this.todoService.update(params.id, updateTodo, userId);
  }
}
