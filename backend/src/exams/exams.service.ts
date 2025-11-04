import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExamsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.exam.findMany({ include: { academicYear: true, sessions: true } });
  }

  async findOne(id: string) {
    return this.prisma.exam.findUnique({ where: { id }, include: { sessions: true } });
  }

  async create(data: any) {
    return this.prisma.exam.create({ data });
  }
}
