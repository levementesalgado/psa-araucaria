import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class ProducersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() { return this.prisma.producer.findMany({ include: { properties: true, contracts: true } }); }
  async findById(id: string) { return this.prisma.producer.findUnique({ where: { id }, include: { properties: true, contracts: true } }); }

  async create(data: { name: string; cpfCnpj: string; email?: string; phone?: string }) {
    return this.prisma.producer.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.producer.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.producer.delete({ where: { id } });
  }
}
