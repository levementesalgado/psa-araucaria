import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ProducersService } from './producers.service';

@ApiTags('Producers')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('producers')
export class ProducersController {
  constructor(private readonly s: ProducersService) {}

  @Get() findAll() { return this.s.findAll(); }
  @Get(':id') findById(@Param('id') id: string) { return this.s.findById(id); }
  @Post() create(@Body() dto: { name: string; cpfCnpj: string; email?: string; phone?: string }) { return this.s.create(dto); }
  @Put(':id') update(@Param('id') id: string, @Body() dto: any) { return this.s.update(id, dto); }
  @Delete(':id') delete(@Param('id') id: string) { return this.s.delete(id); }
}
