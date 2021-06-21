import {
  BadRequestException,
  ClassSerializerInterceptor,
  INestApplication,
  ModuleMetadata,
  Provider,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsModule } from '../transactions/transactions.module';
import { AccountsModule } from '../accounts/accounts.module';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RestErrorExceptionFilter } from '../filters/rest-error.filter';
import { BadRequestExceptionFilter } from '../filters/bad-request.filter';
import { AccountEntity } from '../accounts/entities/accounts.entity';
import { TransactionEntity } from '../transactions/entities/transactions.entity';

export type ModuleInitOptions = {
  modules?: ModuleMetadata['imports'];
  providers?: Provider[];
};

export class ViapoolTestModule {
  public moduleRef;

  constructor(private options?: ModuleInitOptions) {}

  async moduleRefInit() {
    this.moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration],
        }),
        TypeOrmModule.forRootAsync({
          useFactory: async () => {
            return {
              type: 'sqlite',
              database: ':memory:',
              dropSchema: true,
              entities: [AccountEntity, TransactionEntity],
              synchronize: true,
              logging: false,
            };
          },
        }),
        TransactionsModule,
        AccountsModule,
        ...(this.options?.modules || []),
      ],
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: APP_INTERCEPTOR,
          useClass: ClassSerializerInterceptor,
        },
        ...(this.options?.providers || []),
      ],
    });
  }

  public async initialize(): Promise<INestApplication> {
    const moduleRef = await this.moduleRef.compile();
    const app = await moduleRef.createNestApplication();
    await setupGlobals(app);
    await app.init();
    return app;
  }
}

const exceptionFactory = (errors: ValidationError[]): BadRequestException =>
  new BadRequestException(errors);

const globalValidationPipe = new ValidationPipe({
  exceptionFactory,
  transform: true,
  transformOptions: { enableImplicitConversion: false },
});

async function setupGlobals(app: INestApplication): Promise<void> {
  app.setGlobalPrefix(process.env.APP_URI as string);
  app.enableCors();
  app.useGlobalFilters(
    new RestErrorExceptionFilter(),
    new BadRequestExceptionFilter(),
  );
  app.useGlobalPipes(globalValidationPipe);
}
