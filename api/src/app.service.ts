import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Conecta Emprego Paranoá API is online!';
  }
}
