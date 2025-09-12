import { Module } from '@nestjs/common';
import { EmployeeModule } from './employee/employee.module';

//app.module.ts
@Module({
  imports: [EmployeeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
