import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnrolmentsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.enrolment.findMany({
      include: {
        student: { include: { user: true } },
        course: true,
        academicYear: true,
      },
    });
  }

  async findByStudent(studentId: string) {
    return this.prisma.enrolment.findMany({
      where: { studentId },
      include: {
        course: true,
        academicYear: true,
      },
    });
  }

  async create(data: any) {
    return this.prisma.enrolment.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.enrolment.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.enrolment.delete({ where: { id } });
  }
}