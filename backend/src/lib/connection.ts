import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TransactionStatus } from 'src/models/transaction-status.model';
import { Transaction } from 'src/models/transaction.model';

export default (configService: ConfigService): TypeOrmModuleOptions => {
  return {
    type: 'mongodb',
    url: configService.get<string>('MONGO_URI'),
    database: 'environ',
    useUnifiedTopology: true,
    entities: [Transaction, TransactionStatus],
    synchronize: false,
  };
};
