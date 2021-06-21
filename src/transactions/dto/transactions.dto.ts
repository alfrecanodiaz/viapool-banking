import { IsEnum, IsNumber } from 'class-validator';
import { TransactionType } from '../transactions.types';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionCommitDTO {
  @ApiProperty({ required: true })
  @IsEnum(TransactionType)
  type: string;

  @ApiProperty({ required: true })
  @IsNumber()
  amount: number;
}
