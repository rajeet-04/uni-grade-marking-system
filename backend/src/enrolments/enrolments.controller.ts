import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { EnrolmentsService } from './enrolments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('enrolments')
@Controller('enrolments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EnrolmentsController {
  constructor(private enrolmentsService: EnrolmentsService) {}

  @Get()
  async findAll() {
    return this.enrolmentsService.findAll();
  }

  @Get('student/:studentId')
  async findByStudent(@Param('studentId') studentId: string) {
    return this.enrolmentsService.findByStudent(studentId);
  }

  @Post()
  async create(@Body() data: any) {
    return this.enrolmentsService.create(data);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.enrolmentsService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.enrolmentsService.delete(id);
  }
}