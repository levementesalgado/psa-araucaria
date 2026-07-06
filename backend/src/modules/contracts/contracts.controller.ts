import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ContractsService } from './contracts.service';

@ApiTags('Contracts')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('contracts')
export class ContractsController {
  constructor(private readonly s: ContractsService) {}

  @Get()
  findAll() { return this.s.findAll(); }

  @Get('active')
  findActive() { return this.s.findActive(); }

  @Get('producer/:producerId')
  findByProducer(@Param('producerId') producerId: string) { return this.s.findByProducer(producerId); }

  @Post()
  create(@Body() dto: { producerId: string; modality: string; propertyAreaHa?: number }) {
    return this.s.create(dto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: { status: string }) {
    return this.s.updateStatus(id, dto.status);
  }
}
