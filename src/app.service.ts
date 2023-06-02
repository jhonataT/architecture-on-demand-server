import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return JSON.stringify({
      status: 'All Ok'
    }, null, 2);
  }
}
