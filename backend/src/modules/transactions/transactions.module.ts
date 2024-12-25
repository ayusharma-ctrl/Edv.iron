import { Module } from '@nestjs/common';
import {
  TransactionsController,
  TransactionsPublicController,
} from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/models/transaction.model';
import { TransactionStatus } from 'src/models/transaction-status.model';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Transaction, TransactionStatus]),
  ],
  controllers: [TransactionsController, TransactionsPublicController],
  providers: [TransactionsService, AuthService, JwtService],
  exports: [TransactionsService, AuthService, JwtService],
})
export class TransactionsModule {}
