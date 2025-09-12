import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ReflectionService } from '@grpc/reflection';

//main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.GRPC,
      options: {
        package: ['employee'],
        protoPath: [join(process.cwd(), 'proto/employee.proto')],
        url: `0.0.0.0:${process.env.PORT ?? 9000}`,
        onLoadPackageDefinition(pkg, server) {
          new ReflectionService(pkg).addToServer(server);
        },
      },
    },
    { inheritAppConfig: true },
  );

  await app.listen(process.env.PORT ?? 9000);
}
bootstrap();
