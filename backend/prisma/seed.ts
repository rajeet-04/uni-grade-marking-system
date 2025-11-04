import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@university.edu' },
    update: {},
    create: {
      email: 'admin@university.edu',
      passwordHash: adminPassword,
      name: 'System Administrator',
      role: 'ADMIN',
    },
  });

  await prisma.admin.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      notes: 'System administrator account',
    },
  });

  // Create sample department
  const department = await prisma.department.upsert({
    where: { code: 'CS' },
    update: {},
    create: {
      name: 'Computer Science',
      code: 'CS',
    },
  });

  // Create sample course
  const course = await prisma.course.upsert({
    where: { code: 'BSC-CS' },
    update: {},
    create: {
      name: 'Bachelor of Science in Computer Science',
      code: 'BSC-CS',
      totalSemesters: 8,
      departmentId: department.id,
    },
  });

  // Create sample academic year
  const academicYear = await prisma.academicYear.create({
    data: {
      label: '2024-25',
      startDate: new Date('2024-08-01'),
      endDate: new Date('2025-07-31'),
      current: true,
    },
  });

  // Create sample grades
  const grades = [
    { name: 'A+', minMark: 90, maxMark: 100, gradePoint: 10 },
    { name: 'A', minMark: 80, maxMark: 89, gradePoint: 9 },
    { name: 'B+', minMark: 70, maxMark: 79, gradePoint: 8 },
    { name: 'B', minMark: 60, maxMark: 69, gradePoint: 7 },
    { name: 'C+', minMark: 50, maxMark: 59, gradePoint: 6 },
    { name: 'C', minMark: 40, maxMark: 49, gradePoint: 5 },
    { name: 'F', minMark: 0, maxMark: 39, gradePoint: 0 },
  ];

  for (const grade of grades) {
    await prisma.grade.upsert({
      where: { name: grade.name },
      update: {},
      create: grade,
    });
  }

  console.log('Seeding completed!');
  console.log('Admin credentials:');
  console.log('Email: admin@university.edu');
  console.log('Password: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
