// Temporarily disable decorators to test basic functionality
export class UserController {
  constructor(private readonly userService: any) {
    console.log('UserController instantiated');
  }

  async findAll() {
    return this.userService.findAll({});
  }

  async test() {
    return { message: 'User service is working!', timestamp: new Date() };
  }
}
