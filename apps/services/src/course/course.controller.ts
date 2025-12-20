import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import {
  CourseService,
  CourseFilters,
  CoursePaginationOptions,
} from './course.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  async findAll(
    @Query()
    query: {
      page?: string;
      limit?: string;
      category?: string;
      level?: string;
      accessType?: string;
      instructorId?: string;
      isPublished?: string;
      isFeatured?: string;
      priceMin?: string;
      priceMax?: string;
      search?: string;
      sortBy?: string;
      sortOrder?: string;
    },
  ) {
    const filters: CourseFilters = {
      category: query.category,
      level: query.level as any,
      accessType: query.accessType as any,
      instructorId: query.instructorId,
      isPublished: query.isPublished ? query.isPublished === 'true' : undefined,
      isFeatured: query.isFeatured ? query.isFeatured === 'true' : undefined,
      priceMin: query.priceMin ? parseFloat(query.priceMin) : undefined,
      priceMax: query.priceMax ? parseFloat(query.priceMax) : undefined,
      search: query.search,
    };

    const pagination: CoursePaginationOptions = {
      page: query.page ? parseInt(query.page, 10) : 1,
      limit: query.limit ? parseInt(query.limit, 10) : 12,
      sortBy: query.sortBy as any,
      sortOrder: query.sortOrder as any,
    };

    return this.courseService.findAll(filters, pagination);
  }

  @Get('featured')
  async getFeaturedCourses(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 6;
    return this.courseService.getFeaturedCourses(limitNum);
  }

  @Get('categories')
  async getCategories() {
    return this.courseService.getCategories();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() data: Partial<any>, @Request() req) {
    const userId = req.user.id;
    return this.courseService.create(data, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<any>,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.courseService.update(id, data, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    await this.courseService.remove(id, userId);
    return { message: 'Course deleted successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/publish')
  async publish(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.courseService.publish(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/unpublish')
  async unpublish(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.courseService.unpublish(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/rate')
  async rateCourse(
    @Param('id') id: string,
    @Body() body: { rating: number },
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.courseService.updateRating(id, body.rating, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('instructor/my-courses')
  async getMyCourses(@Request() req) {
    const userId = req.user.id;
    return this.courseService.getCoursesByInstructor(userId, true);
  }
}
