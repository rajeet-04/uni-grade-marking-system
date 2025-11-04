import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MarksService } from './marks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('marks')
@Controller('marks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MarksController {
  constructor(private marksService: MarksService) {}

  @Get()
  async findAll() {
    return this.marksService.findAll();
  }

  @Post()
  async create(@Body() data: any) {
    return this.marksService.create(data);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.marksService.update(id, data);
  }
}
