import { IsNumber } from 'class-validator';

export class AccountBalance {
  @IsNumber()
  balance: number;
}
