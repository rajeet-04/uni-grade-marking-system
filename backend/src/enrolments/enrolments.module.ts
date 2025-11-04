import { Module } from '@nestjs/common';
import { EnrolmentsService } from './enrolments.service';
import { EnrolmentsController } from './enrolments.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EnrolmentsController],
  providers: [EnrolmentsService],
  exports: [EnrolmentsService],
})
export class EnrolmentsModule {}