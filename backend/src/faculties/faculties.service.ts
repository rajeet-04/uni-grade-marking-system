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

  async getStudentsByFaculty(facultyId: string) {
    // Get all subjects assigned to this faculty
    const subjects = await this.prisma.subject.findMany({
      where: { assignedFacultyId: facultyId },
      select: { id: true, courseId: true },
    });

    const courseIds = [...new Set(subjects.map(s => s.courseId))];

    // Get all students enrolled in courses that have subjects taught by this faculty
    const enrolments = await this.prisma.enrolment.findMany({
      where: {
        courseId: { in: courseIds },
        isActive: true,
      },
      include: {
        student: {
          include: {
            user: true,
            course: true,
            department: true,
          },
        },
        course: true,
        academicYear: true,
      },
    });

    return enrolments.map(e => ({
      ...e.student,
      enrolment: {
        semesterNumber: e.semesterNumber,
        academicYear: e.academicYear,
        course: e.course,
      },
    }));
  }
}
