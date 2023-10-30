import { NestFactory } from '@nestjs/core';
import { SysModule } from './sys.module';

async function bootstrap() {
  const app = await NestFactory.create(SysModule);
  await app.listen(3000);
}
bootstrap();
