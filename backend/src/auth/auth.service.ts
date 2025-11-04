import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(email: string, password: string, name: string, role: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      email,
      passwordHash: hashedPassword,
      name,
      role,
    });
    
    // Automatically create student or faculty profile based on role
    if (role === 'STUDENT') {
      // Generate a roll number based on timestamp
      const rollNumber = `STU${Date.now().toString().slice(-8)}`;
      await this.prisma.student.create({
        data: {
          userId: user.id,
          rollNumber: rollNumber,
          enrollmentYear: new Date().getFullYear(),
          status: 'active',
        },
      });
    } else if (role === 'FACULTY') {
      // Generate an employee ID based on timestamp
      const employeeId = `FAC${Date.now().toString().slice(-8)}`;
      await this.prisma.faculty.create({
        data: {
          userId: user.id,
          employeeId: employeeId,
        },
      });
    }
    
    const { passwordHash, ...result } = user;
    return result;
  }
}
