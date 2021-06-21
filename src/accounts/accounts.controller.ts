import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { AccountBalance } from './dto/accounts.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Get('/balance')
  @UsePipes(ValidationPipe)
  @ApiOperation({
    summary: 'Fetches account balance',
  })
  public async fetchBalance(): Promise<AccountBalance> {
    return await this.accountsService.getBalance();
  }
}
