import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@ApiTags('Sync')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('sync')
export class SyncController {
  constructor(@InjectQueue('sync') private readonly syncQueue: Queue) {}

  @Post('upload')
  async upload(@Body() body: { trees: any[]; photos: string[] }) {
    await this.syncQueue.add('process-batch', body, { attempts: 3, backoff: { type: 'exponential', delay: 5000 } });
    return { message: 'Batch enfileirado para processamento', count: body.trees.length };
  }

  @Post('status')
  status() {
    return { version: '1.0', serverTime: new Date().toISOString() };
  }
}
