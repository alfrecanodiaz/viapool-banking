import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerOptions = new DocumentBuilder()
  .setTitle('Viapool Banking')
  .setDescription('Microservice for banking')
  .setVersion('1.0')
  .addTag('accounts')
  .addTag('transactions')
  .build();
