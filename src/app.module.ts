import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './employee/employee.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

//app.module.ts
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PLAYGROUND_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'employee',
          protoPath: join(process.cwd(), 'proto/employee.proto'),
        },
      },
    ]),
    EmployeeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
