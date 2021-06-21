import {
  Controller,
  Get,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiOperation,
} from '@nestjs/swagger';
import { TransactionEntity } from './entities/transactions.entity';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Get('')
  @UsePipes(ValidationPipe)
  @ApiOperation({
    summary: 'Fetches transactions history',
  })
  public async fetchTransactions(): Promise<TransactionEntity[]> {
    return await this.transactionsService.fetchTransactions();
  }
}
