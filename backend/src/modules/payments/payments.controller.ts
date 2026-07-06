import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PaymentsService } from './payments.service';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('payments')
export class PaymentsController {
  constructor(private readonly s: PaymentsService) {}

  @Get('contract/:contractId')
  findByContract(@Param('contractId') contractId: string) { return this.s.findByContract(contractId); }

  @Get('producer/:producerId')
  findByProducer(@Param('producerId') producerId: string) { return this.s.findByProducer(producerId); }

  @Get('upcoming/:producerId')
  upcoming(@Param('producerId') producerId: string) { return this.s.upcoming(producerId); }
}
