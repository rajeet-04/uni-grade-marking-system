import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.course.findMany({ include: { department: true } });
  }

  async findOne(id: string) {
    return this.prisma.course.findUnique({ where: { id }, include: { subjects: true } });
  }

  async create(data: any) {
    return this.prisma.course.create({ data });
  }
}
