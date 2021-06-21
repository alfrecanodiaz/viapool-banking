import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../commons/entities/base-entity';
import { TransactionType } from '../transactions.types';
import { bigint } from '../../utils/transformers.util';
import { DbAwareColumn } from '../../utils/test.utils';

@Entity({ name: 'transactions' })
export class TransactionEntity extends BaseEntity {
  @Column({ enum: TransactionType, nullable: false })
  type: TransactionType;

  @Column({
    nullable: false,
    type: 'bigint',
    comment: 'bigint its used to handle big amount values',
    transformer: [bigint],
  })
  amount: number;

  @DbAwareColumn({
    type: 'timestamp',
    nullable: false,
    name: 'effective_date',
  })
  effectiveDate: Date;
}
