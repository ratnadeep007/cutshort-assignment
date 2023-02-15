import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Request, Response, NextFunction } from 'express';

const swaggerUISecure = (req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/docs' || req.path === '/docs-json') {
    const query = req.query;
    console.log(query['pin']);
    if (query['pin'] !== process.env.SWAGGER_PIN) {
      return res.status(HttpStatus.FORBIDDEN).send({ message: 'Forbidden' });
    }
  }
  next();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.use(swaggerUISecure);

  const config = new DocumentBuilder()
    .setTitle('Cutshort Assignment')
    .setDescription(
      'APIs to display basic auth using JWT and CRUD operation using mongodb',
    )
    .setVersion('1.0')
    .addTag('todo')
    .addTag('auth')
    .addTag('post')
    .addTag('user')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(3000);
}
bootstrap();
