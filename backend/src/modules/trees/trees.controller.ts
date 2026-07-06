import { Controller, Get, Post, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TreesService } from './trees.service';

@ApiTags('Trees')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('trees')
export class TreesController {
  constructor(private readonly s: TreesService) {}

  @Get('contract/:contractId')
  findByContract(@Param('contractId') contractId: string) {
    return this.s.findByContract(contractId);
  }

  @Post()
  create(@Body() dto: { contractId: string; latitude: number; longitude: number }) {
    return this.s.create(dto);
  }

  @Post('batch')
  createBatch(@Body() dto: { trees: { contractId: string; producerId: string; latitude: number; longitude: number }[] }) {
    return this.s.createBatch(dto.trees);
  }

  @Put(':id/verify')
  verify(@Param('id') id: string, @Body() dto: { photoUrl: string }) {
    return this.s.verify(id, dto.photoUrl);
  }
}
