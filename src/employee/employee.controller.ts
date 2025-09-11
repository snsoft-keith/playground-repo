import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { ServerUnaryCall } from '@grpc/grpc-js';
import { GetEmployeeRequest, GetEmployeeResponse } from '../../proto/employee';

@Controller('employee')
export class EmployeeController {
  @GrpcMethod('EmployeeService', 'GetEmployee')
  findOne(
    data: GetEmployeeRequest,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): GetEmployeeResponse {
    const items = [
      { _id: '1', name: 'John' },
      { _id: '2', name: 'Doe' },
    ];
    return items.find(({ _id }) => _id === data._id) as GetEmployeeRequest;
  }
}
