import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EmployeeModule } from './employee/employee.module';

//app.module.ts
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/playground', {
      connectionName: 'employees',
    }),
    EmployeeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
