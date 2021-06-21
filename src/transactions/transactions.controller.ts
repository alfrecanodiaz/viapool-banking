import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { TransactionEntity } from './entities/transactions.entity';
import { TransactionCommitDTO } from './dto/transactions.dto';
import { TransactionsService } from './transactions.service';
import {
  resourceNotFoundExceptionSchema,
  transactionTypeInvalidException,
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

  @Post('')
  @UsePipes(ValidationPipe)
  @ApiOperation({
    summary: 'Commit new transaction to the account',
  })
  @ApiBadRequestResponse({ schema: transactionTypeInvalidException })
  public async commitTransaction(
    @Body() payload: TransactionCommitDTO,
  ): Promise<TransactionEntity> {
    return this.transactionsService.commitTransaction(payload);
  }
}
