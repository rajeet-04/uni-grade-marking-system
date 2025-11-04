import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MarksService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.mark.findMany({
      include: { student: true, examSession: true },
    });
  }

  async create(data: any) {
    return this.prisma.mark.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.mark.update({ where: { id }, data });
  }
}
