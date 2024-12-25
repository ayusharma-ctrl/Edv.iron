import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ResponseConstants from '../../constants/response.constants';
import { TransactionStatus } from 'src/models/transaction-status.model';
import { Transaction } from 'src/models/transaction.model';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionStatus)
    private readonly statusRepository: Repository<TransactionStatus>,
  ) {}

  // helper function to restructure response data as per API requirements
  private mapTransactionData(transaction: Transaction) {
    return {
      collect_id: transaction._id,
      school_id: transaction.school_id,
      gateway: transaction.gateway,
      order_amount: transaction.order_amount,
      transaction_amount: transaction.statusDetails?.transaction_amount ?? 0,
      status: transaction.statusDetails?.status ?? 'UNKNOWN',
      custom_order_id: transaction.custom_order_id,
    };
  }

  // helper method to fetch transaction status
  async transactionsWithStatus(transactions: Transaction[]) {
    try {
      return await Promise.all(
        transactions.map(async (transaction) => {
          const statusDetails = await this.statusRepository.findOne({
            where: { collect_id: transaction._id },
          });
          return { ...transaction, statusDetails };
        }),
      );
    } catch (error) {
      console.log('Failed to fetch transactions status:', error);
      return transactions;
    }
  }

  // method to fetch all the transactions
  async fetchAllTransactions(page: number, limit: number) {
    try {
      const skip = (page - 1) * limit; // maintain paginated data

      const [transactions, totalCount] =
        await this.transactionRepository.findAndCount({
          skip,
          take: limit,
        });

      // fetch transaction status of each collect_id
      const transactionsWithStatus =
        await this.transactionsWithStatus(transactions);

      return {
        data: transactionsWithStatus.map(this.mapTransactionData),
        resultCount: transactions?.length | 0,
        totalCount,
        page,
        limit,
      };
    } catch (error) {
      console.log('Failed to fetch data:', error);
      return { data: [], resultCount: 0, totalCount: 0, page, limit };
    }
  }

  // method to fetch transactions related to school_id
  async fetchTransactionsBySchool(
    schoolId: string,
    page: number,
    limit: number,
  ) {
    try {
      const skip = (page - 1) * limit;

      const [transactions, totalCount] =
        await this.transactionRepository.findAndCount({
          where: { school_id: schoolId },
          skip,
          take: limit,
        });

      // fetch transaction status of each collect_id
      const transactionsWithStatus =
        await this.transactionsWithStatus(transactions);

      return {
        data: transactionsWithStatus.map(this.mapTransactionData),
        resultCount: transactions?.length | 0,
        totalCount,
        page,
        limit,
      };
    } catch (error) {
      console.log('Failed to fetch data:', error);
      return { data: [], resultCount: 0, totalCount: 0, page, limit };
    }
  }

  // method to check the status of transactions by custom_order_id
  async fetchTransactionsByCustOrderId(custom_order_id: string) {
    try {
      // find transaction
      const transaction = await this.transactionRepository.findOne({
        where: { custom_order_id },
      });

      if (!transaction) {
        return null;
      }

      // find status of transaction by collect_id
      const transactionStatus = await this.statusRepository.findOne({
        where: { collect_id: transaction._id },
      });

      // structure formatting
      const responseData = { ...transaction, statusDetails: transactionStatus };

      return this.mapTransactionData(responseData);
    } catch (error) {
      console.log('Failed to fetch data:', error);
      return null;
    }
  }

  // method to update transaction status manually
  async updateTransactionStatus(collectId: string, status: string) {
    try {
      // find transaction status by collect_id
      const transactionStatus = await this.statusRepository.findOne({
        where: { collect_id: new ObjectId(collectId) },
      });

      if (!transactionStatus) {
        throw new NotFoundException(ResponseConstants.STATUS.STATUS_NOT_FOUND);
      }

      transactionStatus.status = status;

      // save the new status
      await this.statusRepository.save(transactionStatus);

      return {
        message: 'Transaction status updated successfully',
        collect_id: collectId,
        new_status: status,
      };
    } catch (error) {
      console.log(error?.message);
      return null;
    }
  }

  // call Payment Gateway API to get Payment Page Link
  async getPaymentUrl(school_id: string, amount: number) {
    try {
      // access env variables
      const pg_uri = this.configService.get<string>('pg_uri');
      const pg_key = this.configService.get<string>('pg_key');
      const callback_url = this.configService.get<string>('callback_url');
      const api_key = this.configService.get<string>('PAYMENT_API_KEY');

      const payload = {
        school_id,
        amount,
        callback_url,
      };

      // tokenize sign of payload
      const sign = this.jwtService.sign(payload, { secret: pg_key });

      const body = {
        ...payload,
        sign,
      };

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${api_key}`,
      };

      const pg_endpoint = `${pg_uri}/erp/create-collect-request`;

      const response = await fetch(pg_endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(response?.statusText);
      }

      const data = await response.json();

      return data?.collect_request_url || null;
    } catch (error) {
      console.log(error?.message);
      return null;
    }
  }
}
