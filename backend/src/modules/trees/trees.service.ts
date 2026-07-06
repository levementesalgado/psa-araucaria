import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class TreesService {
  constructor(private readonly prisma: PrismaService) {}

  async findByContract(contractId: string) {
    return this.prisma.tree.findMany({ where: { contractId } });
  }

  async create(data: { contractId: string; latitude: number; longitude: number; plantedDate?: Date }) {
    const contract = await this.prisma.contract.findUnique({ where: { id: data.contractId } });
    return this.prisma.tree.create({
      data: {
        contractId: data.contractId,
        producerId: contract!.producerId,
        latitude: data.latitude,
        longitude: data.longitude,
        plantedDate: data.plantedDate,
      },
    });
  }

  async createBatch(trees: { contractId: string; producerId: string; latitude: number; longitude: number }[]) {
    return this.prisma.tree.createMany({ data: trees });
  }

  async verify(id: string, photoUrl: string) {
    return this.prisma.tree.update({
      where: { id },
      data: { isVerified: true, photoUrl, syncStatus: 'SYNCED' },
    });
  }

  async countByProducer(producerId: string) {
    return this.prisma.tree.count({ where: { producerId } });
  }
}
