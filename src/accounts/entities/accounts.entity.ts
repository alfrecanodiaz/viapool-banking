import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../commons/entities/base-entity';
import { bigint } from '../../utils/transformers.util';

@Entity({ name: 'accounts' })
export class AccountEntity extends BaseEntity {
  @Column({
    nullable: false,
    type: 'bigint',
    comment: 'bigint its used to handle big amount values',
    transformer: [bigint],
  })
  balance: number;
}
