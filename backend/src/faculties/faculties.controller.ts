import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FacultiesService } from './faculties.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('faculties')
@Controller('faculties')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FacultiesController {
  constructor(private facultiesService: FacultiesService) {}

  @Get()
  async findAll() {
    return this.facultiesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.facultiesService.findOne(id);
  }
}
