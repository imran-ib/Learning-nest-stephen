import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { AuthGuard } from 'src/users/guards/auth.guads';
import { User } from 'src/users/user.entity';
import { createReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private ReportsService: ReportsService) {}
  @Post()
  @UseGuards(AuthGuard)
  createReport(@Body() body: createReportDto, @CurrentUser() user: User) {
    return this.ReportsService.create(body, user);
  }
}
