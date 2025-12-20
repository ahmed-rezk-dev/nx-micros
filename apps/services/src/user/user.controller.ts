import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {
    console.log('UserController instantiated');
  }

  @Get()
  async findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.userService.findAll({ page: pageNum, limit: limitNum });
  }

  @Get('test')
  async test() {
    return { message: 'User service is working!', timestamp: new Date() };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Post()
  async create(@Body() data: any) {
    return this.userService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.userService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.userService.remove(id);
    return { message: 'User deleted successfully' };
  }
}
