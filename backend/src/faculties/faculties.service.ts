import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FacultiesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.faculty.findMany({ include: { user: true, department: true } });
  }

  async findOne(id: string) {
    return this.prisma.faculty.findUnique({ where: { id }, include: { user: true } });
  }
}
