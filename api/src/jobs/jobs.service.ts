import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.job.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(createJobDto: CreateJobDto) {
    return this.prisma.job.create({
      data: {
        title: createJobDto.title,
        description: createJobDto.description,
        salary: createJobDto.salary || null,
        whatsapp: createJobDto.whatsapp,
      },
    });
  }
}
