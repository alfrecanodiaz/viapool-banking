import { Module, OnModuleInit } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { AccountEntity } from './entities/accounts.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity])],
  controllers: [AccountsController],
  providers: [AccountsService],
})
export class AccountsModule implements OnModuleInit {
  constructor(private accountsService: AccountsService) {}

  async onModuleInit(): Promise<void> {
    await this.accountsService.createAccountIfNeeded();
  }
}
