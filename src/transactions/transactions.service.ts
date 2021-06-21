import { Injectable } from '@nestjs/common';
import { TransactionEntity } from './entities/transactions.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionCommitDTO } from './dto/transactions.dto';
import { ErrorsConstants } from '../constants/error.constants';
import { AccountsService } from '../accounts/accounts.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
    private accountsService: AccountsService,
  ) {}

  async fetchTransactions(): Promise<TransactionEntity[]> {
    return await this.transactionRepository.find();
  }

  async findTransaction(transactionId: string): Promise<TransactionEntity> {
    const transaction = await this.transactionRepository.findOne(transactionId);

    if (!transaction) {
      throw ErrorsConstants.resourceNotFound('transaction');
    }

    return transaction;
  }

  async commitTransaction(
    payload: TransactionCommitDTO,
  ): Promise<TransactionEntity> {
    await this.accountsService.checkAccountBalance(payload);
    const transactionPayload = Object.assign(new TransactionEntity(), {
      ...payload,
      effectiveDate: new Date(),
    });
    const transaction = await this.transactionRepository.save(
      transactionPayload,
    );
    await this.accountsService.updateAccountBalance(transaction);
    return transaction;
  }
}
