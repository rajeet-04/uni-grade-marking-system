import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AcademicYearsService } from './academic-years.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('academic-years')
@Controller('academic-years')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AcademicYearsController {
  constructor(private academicYearsService: AcademicYearsService) {}

  @Get()
  async findAll() {
    return this.academicYearsService.findAll();
  }
}