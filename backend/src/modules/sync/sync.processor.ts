import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { TreesService } from '../trees/trees.service';

@Processor('sync')
export class SyncProcessor {
  constructor(private readonly trees: TreesService) {}

  @Process('process-batch')
  async handleBatch(job: Job<{ trees: any[] }>) {
    const { trees } = job.data;
    if (trees.length > 0) {
      await this.trees.createBatch(trees);
    }
    return { processed: trees.length };
  }
}
