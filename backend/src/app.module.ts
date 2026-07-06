import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { BullModule } from '@nestjs/bull';
import { PrismaModule } from './common/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProducersModule } from './modules/producers/producers.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { TreesModule } from './modules/trees/trees.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { TrainingsModule } from './modules/trainings/trainings.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { SyncModule } from './modules/sync/sync.module';
import { MediaModule } from './modules/media/media.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: { expiresIn: '1h' },
    }),
    BullModule.forRoot({
      redis: { host: process.env.REDIS_HOST || 'localhost', port: 6379 },
    }),
    AuthModule,
    ProducersModule,
    PropertiesModule,
    ContractsModule,
    TreesModule,
    PaymentsModule,
    TrainingsModule,
    ActivitiesModule,
    SyncModule,
    MediaModule,
  ],
})
export class AppModule {}
