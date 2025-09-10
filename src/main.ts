import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ReflectionService } from '@grpc/reflection';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 9000);
}
bootstrap();
