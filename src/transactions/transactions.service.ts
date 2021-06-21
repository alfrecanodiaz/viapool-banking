import { Injectable } from '@nestjs/common';
import { TransactionEntity } from './entities/transactions.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}

  async fetchTransactions(): Promise<TransactionEntity[]> {
    return await this.transactionRepository.find();
  }
}
