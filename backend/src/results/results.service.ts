import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResultsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.result.findMany({ include: { student: true, academicYear: true } });
  }

  async findByStudent(studentId: string) {
    return this.prisma.result.findMany({
      where: { studentId },
      include: { academicYear: true },
    });
  }

  async create(data: any) {
    return this.prisma.result.create({ data });
  }
}
