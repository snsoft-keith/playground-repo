import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: ['employee'],
      protoPath: [join(__dirname, 'proto/employee.proto')],
    },
  });

  await app.listen(process.env.PORT ?? 9000);
}
bootstrap();
