import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { AccountsModule } from '../accounts/accounts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './entities/transactions.entity';
import { AccountsService } from '../accounts/accounts.service';
import { AccountEntity } from '../accounts/entities/accounts.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity, AccountEntity]),
    AccountsModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, AccountsService],
})
export class TransactionsModule {}
