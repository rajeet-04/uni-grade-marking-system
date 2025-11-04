import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AcademicYearsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.academicYear.findMany({
      orderBy: { startDate: 'desc' },
    });
  }
}