import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class ContractsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.contract.findMany({ include: { producer: true, payments: true } });
  }

  async findActive() {
    return this.prisma.contract.findMany({ where: { status: 'ACTIVE' }, include: { producer: true } });
  }

  async findByProducer(producerId: string) {
    return this.prisma.contract.findMany({ where: { producerId }, include: { trees: true, payments: true } });
  }

  async create(data: { producerId: string; modality: string; propertyAreaHa?: number }) {
    return this.prisma.contract.create({ data: { ...data, modality: data.modality as any } });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.contract.update({ where: { id }, data: { status: status as any } });
  }
}
