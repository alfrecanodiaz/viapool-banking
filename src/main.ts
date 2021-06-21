import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  INestApplication,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerOptions } from './config/swagger';
import dotenv from 'dotenv-safe';
import { join } from 'path';
import { RestErrorExceptionFilter } from './filters/rest-error.filter';
import { BadRequestExceptionFilter } from './filters/bad-request.filter';

dotenv.config({
  sample: join(__dirname, '../.env.sample'),
  path: join(__dirname, '../.env'),
});

const exceptionFactory = (errors: ValidationError[]): BadRequestException =>
  new BadRequestException(errors);

const globalValidationPipe = new ValidationPipe({
  exceptionFactory,
  transform: true,
  transformOptions: { enableImplicitConversion: false },
});

class ViapoolBankingApp {
  public async bootstrap(): Promise<Promise<void>> {
    const app = await this.generateApp();

    await this.setupGlobals(app);

    const document = SwaggerModule.createDocument(app, swaggerOptions);
    SwaggerModule.setup(process.env.APP_DOCS_URI as string, app, document);

    await app.listen(process.env.APP_PORT as string);
  }

  private generateApp = (): Promise<INestApplication> =>
    NestFactory.create(AppModule);

  private async setupGlobals(app: INestApplication): Promise<void> {
    app.setGlobalPrefix(process.env.APP_URI as string);
    app.enableCors();
    app.useGlobalFilters(
      new RestErrorExceptionFilter(),
      new BadRequestExceptionFilter(),
    );
    app.useGlobalPipes(globalValidationPipe);
  }
}

const viapoolBankingApp = new ViapoolBankingApp();

viapoolBankingApp.bootstrap();
