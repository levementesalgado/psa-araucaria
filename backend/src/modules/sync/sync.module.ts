import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { SyncController } from './sync.controller';
import { SyncProcessor } from './sync.processor';
import { TreesModule } from '../trees/trees.module';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'sync' }),
    TreesModule,
    MediaModule,
  ],
  controllers: [SyncController],
  providers: [SyncProcessor],
})
export class SyncModule {}
