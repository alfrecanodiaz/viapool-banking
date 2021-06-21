import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity } from './entities/accounts.entity';
import { TransactionEntity } from '../transactions/entities/transactions.entity';
import { TransactionType } from '../transactions/transactions.types';
import { TransactionCommitDTO } from '../transactions/dto/transactions.dto';
import { ErrorsConstants } from '../constants/error.constants';
import { AccountBalance } from './dto/accounts.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  async getBalance(): Promise<AccountBalance> {
    const account = await this.accountRepository.findOne();

    return { balance: account?.balance ?? 0 };
  }

  // create default account to keep it simple
  async createAccountIfNeeded(): Promise<void> {
    const count = await this.accountRepository.count();

    if (!count) {
      await this.accountRepository.save({ balance: 0 });
    }
  }

  async checkAccountBalance(transaction: TransactionCommitDTO): Promise<void> {
    const account = await this.accountRepository.findOne();

    if (!account) {
      throw ErrorsConstants.resourceNotFound('account');
    }

    if (
      account.balance < transaction.amount &&
      transaction.type === TransactionType.DEBIT
    ) {
      throw ErrorsConstants.insufficientAccountBalanceError();
    }
  }

  async updateAccountBalance(transaction: TransactionEntity): Promise<void> {
    const account = await this.accountRepository.findOne();

    if (!account) {
      throw ErrorsConstants.resourceNotFound('account');
    }

    account.balance =
      transaction.type === TransactionType.CREDIT
        ? account.balance + transaction.amount
        : account.balance - transaction.amount;
    await this.accountRepository.save(account);
  }
}
