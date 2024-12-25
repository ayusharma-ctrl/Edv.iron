import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';
import { TransactionStatus } from './transaction-status.model';

@Entity('collect_request')
export class Transaction {
  @ObjectIdColumn()
  readonly _id: ObjectId;

  @Column()
  school_id: string;

  @Column()
  trustee_id: string;

  @Column()
  gateway: string;

  @Column()
  order_amount: number;

  @Column()
  custom_order_id: string;

  statusDetails: TransactionStatus;
}
