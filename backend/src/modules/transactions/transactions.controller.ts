import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { TransactionsService } from './transactions.service';
import { ResponseInterceptor } from 'src/core/response.interceptor';
import ResponseConstants from 'src/constants/response.constants';

@UseGuards(AuthGuard)
@Controller('transactions')
@UseInterceptors(ResponseInterceptor)
export class TransactionsController {
  constructor(private readonly transactionService: TransactionsService) {}

  @Get('')
  @Version('1')
  async sample() {
    return 'protected transaction controller';
  }

  @Get('all')
  @Version('1')
  async getAllTransactions(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return await this.transactionService.fetchAllTransactions(
      parseInt(page),
      parseInt(limit),
    );
  }

  @Get('school/:schoolId')
  @Version('1')
  async getTransactionsBySchool(
    @Param('schoolId') schoolId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return await this.transactionService.fetchTransactionsBySchool(
      schoolId,
      parseInt(page),
      parseInt(limit),
    );
  }

  @Get('check-status/:customOrderId')
  @Version('1')
  async getTransactionStatus(@Param('customOrderId') customOrderId: string) {
    return await this.transactionService.fetchTransactionsByCustOrderId(
      customOrderId,
    );
  }

  @Post('update-status')
  @Version('1')
  async updateTransactionStatus(
    @Body() body: { collect_id: string; status: string },
  ) {
    const { collect_id, status } = body;

    if (!collect_id || !status) {
      throw new BadRequestException(ResponseConstants.Common[400]);
    }

    return await this.transactionService.updateTransactionStatus(
      collect_id,
      status,
    );
  }

  @Post('collect-payment')
  @Version('1')
  async collectPayment(@Body() body: { school_id: string; amount: number }) {
    const { school_id, amount } = body;

    if (!school_id || !amount) {
      throw new BadRequestException(ResponseConstants.Common[400]);
    }

    return await this.transactionService.getPaymentUrl(school_id, amount);
  }
}

@Controller('public/transactions')
@UseInterceptors(ResponseInterceptor)
export class TransactionsPublicController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('')
  @Version('1')
  async sample() {
    return { data: 'public transaction controller' };
  }

  @Get('error-demo')
  @Version('1')
  demoError() {
    // simulate an error to test http-exception filter
    throw new HttpException('This is a test error!', 400);
  }
}
