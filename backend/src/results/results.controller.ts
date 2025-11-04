import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ResultsService } from './results.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('results')
@Controller('results')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ResultsController {
  constructor(private resultsService: ResultsService) {}

  @Get()
  async findAll(@Query('studentId') studentId?: string) {
    if (studentId) {
      return this.resultsService.findByStudent(studentId);
    }
    return this.resultsService.findAll();
  }

  @Post()
  async create(@Body() data: any) {
    return this.resultsService.create(data);
  }
}
