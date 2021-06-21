import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { TransactionEntity } from './entities/transactions.entity';
import { TransactionsService } from './transactions.service';
import {
  resourceNotFoundExceptionSchema,
} from '../commons/swagger';

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

  @Get('/:transactionId')
  @UsePipes(ValidationPipe)
  @ApiOperation({
    summary: 'Find transaction by ID',
  })
  @ApiNotFoundResponse({ schema: resourceNotFoundExceptionSchema })
  public async findTransaction(
    @Param('transactionId', ParseUUIDPipe) transactionId: string,
  ): Promise<TransactionEntity> {
    return await this.transactionsService.findTransaction(transactionId);
  }
}
