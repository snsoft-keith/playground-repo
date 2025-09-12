import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { Metadata, status } from '@grpc/grpc-js';
import type { ServerUnaryCall } from '@grpc/grpc-js';
import { GetEmployeeRequest, GetEmployeeResponse } from '../../proto/employee';

@Controller()
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
    const employee = items.find(({ _id }) => _id === data._id);

    if (!employee) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `Employee with ID ${data._id} not found`,
      });
    }

    return employee as GetEmployeeResponse;
  }
}
