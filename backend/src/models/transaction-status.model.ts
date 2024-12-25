import { Entity, ObjectId, Column, ObjectIdColumn } from 'typeorm';

@Entity('collect_request_status')
export class TransactionStatus {
  @ObjectIdColumn()
  readonly _id: ObjectId;

  @Column({ type: 'string' })
  collect_id: ObjectId;

  @Column()
  status: string;

  @Column()
  payment_method: string;

  @Column()
  gateway: string;

  @Column()
  bank_reference: string;

  @Column()
  transaction_amount: number;
}
