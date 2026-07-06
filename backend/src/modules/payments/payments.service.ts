import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByContract(contractId: string) {
    return this.prisma.payment.findMany({ where: { contractId }, orderBy: { dueDate: 'asc' } });
  }

  async findByProducer(producerId: string) {
    return this.prisma.payment.findMany({
      where: { contract: { producerId } },
      include: { contract: { select: { modality: true } } },
      orderBy: { dueDate: 'asc' },
    });
  }

  async upcoming(producerId: string) {
    return this.prisma.payment.findMany({
      where: { contract: { producerId }, status: { in: ['PENDING', 'OVERDUE'] } },
      include: { contract: { select: { modality: true } } },
      orderBy: { dueDate: 'asc' },
    });
  }
}
