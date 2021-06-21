import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity } from './entities/accounts.entity';
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
}
